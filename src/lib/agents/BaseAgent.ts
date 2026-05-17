import { aiClient } from '../vertexai';
import { supabase } from '../supabase';
import { ToolGateway } from '../tools/gateway';
import { ToolParams, ToolResult } from '../tools/types';
import { SAIF } from '../security/saif';
import { ContextLoader } from '../knowledge/contextLoader';
import { TraceLogger, generateSessionId } from '../observability/traceLogger';
import { MemoryManager, type MemoryType, type MemoryEntry } from '../memory/memoryManager';
import { SynapseConfig } from '../../../synapse.config';

export class BaseAgent {
  public agentId: string;
  public name: string = '';
  public systemPrompt: string = '';
  public tools: string[] = [];

  /** Session ID groups all trace events for a single mission/run */
  public sessionId: string;

  /** Structured trace logger for this agent's session */
  protected tracer: TraceLogger;

  /** Static map to track token usage per session across agents within this process */
  private static sessionTokenUsage: Map<string, number> = new Map();

  constructor(agentId: string, sessionId?: string) {
    this.agentId = agentId;
    // Allow a parent orchestrator to inject a sessionId for cross-agent tracing,
    // or generate a fresh one when an agent is invoked standalone.
    this.sessionId = sessionId ?? generateSessionId();
    this.tracer = new TraceLogger(this.agentId, this.sessionId);
  }

  /**
   * Loads the agent's identity and permissions from the Supabase registry.
   */
  async initialize() {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('agent_id', this.agentId)
      .single();

    if (error || !data) {
      throw new Error(`Failed to load agent ${this.agentId} from registry.`);
    }

    this.name = data.name;
    this.systemPrompt = data.system_prompt;
    this.tools = data.tools_required || [];

    // Log session start once identity is confirmed
    await this.tracer.traceSessionStart({ agent_name: this.name, tools: this.tools });
  }

  /**
   * Calls the LLM to make a decision or generate an output based on the input.
   * Wraps the call with structured trace events (think_start → think_end | think_error).
   */
  async think(input: string, structuredSchema?: object): Promise<any> {
    if (!this.systemPrompt) {
      await this.initialize();
    }

    // SAIF Input Filtering
    const inputCheck = SAIF.sanitizeInput(input);
    if (!inputCheck.isSafe) {
      await this.tracer.traceSecurityBlock(inputCheck.reason, input);
      console.warn(`[SAIF BLOCKED] Input rejected: ${inputCheck.reason}`);
      throw new Error(`Security Violation: ${inputCheck.reason}`);
    }

    const { startTime } = await this.tracer.traceThinkStart(input);

    try {
      const config: Record<string, unknown> = {
        systemInstruction: this.systemPrompt,
        temperature: 0.2, // Low temperature for deterministic GTM routing
      };

      if (structuredSchema) {
        config.responseMimeType = 'application/json';
        config.responseSchema = structuredSchema;
      }

      const context = ContextLoader.getFullContext();

      // ── Memory Recall: inject relevant past memories into LLM context ────
      const memories = await MemoryManager.recall(this.agentId, input);
      const memoryContext = MemoryManager.formatForPrompt(memories);

      const fullInput = [
        context,
        memoryContext,
        `USER REQUEST/DATA:\n${input}`,
      ].filter(Boolean).join('\n\n');

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullInput,
        config,
      });

      // Estimate token count from character length (rough proxy before exact API support)
      const tokenCount = Math.ceil((fullInput.length + (response.text?.length ?? 0)) / 4);
      
      // ── Enforce Token Budget ──────────────────────────────────────────
      const currentUsage = BaseAgent.sessionTokenUsage.get(this.sessionId) || 0;
      const newUsage = currentUsage + tokenCount;
      if (newUsage > SynapseConfig.budgets.max_tokens_per_session) {
        throw new Error(`BudgetExceededError: Session ${this.sessionId} exceeded max token limit of ${SynapseConfig.budgets.max_tokens_per_session}. Current usage: ${newUsage}`);
      }
      BaseAgent.sessionTokenUsage.set(this.sessionId, newUsage);

      if (structuredSchema) {
        const parsedResponse = JSON.parse(response.text ?? '{}');

        // SAIF Output Filtering
        const outputCheck = SAIF.sanitizeOutput(parsedResponse);
        if (!outputCheck.isSafe) {
          await this.tracer.traceSecurityBlock(outputCheck.reason, JSON.stringify(parsedResponse));
          console.warn(`[SAIF BLOCKED] Output rejected: ${outputCheck.reason}`);
          throw new Error(`Security Violation: ${outputCheck.reason}`);
        }

        await this.tracer.traceThinkEnd(startTime, JSON.stringify(parsedResponse).slice(0, 200), tokenCount);

        // ── Auto-store decision as memory ──────────────────────────────────
        if (SynapseConfig.memory.auto_store_events.includes('agent_decision')) {
          MemoryManager.store({
            agentId: this.agentId,
            sessionId: this.sessionId,
            type: 'agent_decision',
            content: `Input: ${input.slice(0, 300)}\n\nDecision: ${JSON.stringify(parsedResponse).slice(0, 400)}`,
            metadata: { session_id: this.sessionId },
          }); // Fire and forget — don't await

          // ── Context Compaction Trigger (Google CE whitepaper §4.24) ──────
          // If memory count exceeds threshold, kick off async compaction.
          // Non-blocking: runs in background, never delays the agent response.
          const threshold = (SynapseConfig.memory as any).compaction_threshold ?? 50;
          MemoryManager.count(this.agentId).then(count => {
            if (count > threshold) {
              console.log(`[Memory] Compaction triggered for agent=${this.agentId} (${count} memories > threshold ${threshold})`);
              MemoryManager.compact(this.agentId).catch(e =>
                console.warn(`[Memory] Compaction error: ${e.message}`)
              );
            }
          });
        }

        return parsedResponse;
      }

      await this.tracer.traceThinkEnd(startTime, (response.text ?? '').slice(0, 200), tokenCount);
      return response.text;

    } catch (err: any) {
      await this.tracer.traceThinkError(startTime, err.message);
      throw err;
    }
  }

  /**
   * Executes a tool via the Gateway.
   * Wraps the call with structured trace events (tool_start → tool_end | tool_error).
   */
  async useTool(toolName: string, params: ToolParams): Promise<ToolResult> {
    const { startTime } = await this.tracer.traceToolStart(toolName, params);
    try {
      const result = await ToolGateway.executeTool(this.agentId, toolName, params);
      await this.tracer.traceToolEnd(toolName, startTime, result);
      return result as ToolResult;
    } catch (err: any) {
      // Distinguish RBAC denials from execution errors
      if (err.message?.startsWith('Forbidden:')) {
        await this.tracer.traceToolDenied(toolName, err.message);
      } else {
        await this.tracer.traceToolError(toolName, startTime, err.message);
      }
      throw err;
    }
  }

  /**
   * Call this when a mission/session is complete to close the trace session.
   */
  async endSession(summary?: Record<string, unknown>) {
    await this.tracer.traceSessionEnd(summary);
  }

  // ── Memory convenience methods (available in all agent subclasses) ─────────

  /**
   * Store something in long-term memory.
   * Call this from agent subclasses to record important learnings.
   */
  protected async remember(
    content: string,
    type: MemoryType = 'agent_decision',
    metadata?: Record<string, unknown>
  ): Promise<string | null> {
    return MemoryManager.store({
      agentId: this.agentId,
      sessionId: this.sessionId,
      type,
      content,
      metadata,
    });
  }

  /**
   * Recall relevant memories for a query.
   */
  protected async recall(
    query: string,
    topK?: number
  ): Promise<MemoryEntry[]> {
    return MemoryManager.recall(this.agentId, query, { topK });
  }
}
