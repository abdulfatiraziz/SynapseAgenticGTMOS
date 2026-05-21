import { supabase } from '../supabase';

// ─── Trace Event Types ───────────────────────────────────────────────────────

export type TraceEventType =
  | 'think_start'
  | 'think_end'
  | 'think_error'
  | 'tool_start'
  | 'tool_end'
  | 'tool_denied'
  | 'tool_error'
  | 'session_start'
  | 'session_end'
  | 'security_block';

export interface TraceEvent {
  trace_id: string;
  session_id: string;
  agent_id: string;
  event_type: TraceEventType;
  tool_name?: string;
  input_summary?: string;       // Truncated/hashed — never full PII
  output_summary?: string;      // Summary of what came back
  duration_ms?: number;
  token_count?: number;
  status: 'success' | 'error' | 'blocked';
  error_message?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

// ─── Session Management ───────────────────────────────────────────────────────

export function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function generateTraceId(): string {
  return `trc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Input Summarizer (Never logs raw PII) ────────────────────────────────────

function summarizeInput(input: unknown): string {
  const str = typeof input === 'string' ? input : JSON.stringify(input);
  // Truncate to 200 chars, never store raw email/phone patterns
  const truncated = str.slice(0, 200);
  return truncated.replace(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    '[email]'
  ).replace(/\b\d{10,}\b/g, '[phone]');
}

declare global {
  var inMemoryTraces: any[] | undefined;
}

if (!globalThis.inMemoryTraces) {
  globalThis.inMemoryTraces = [];
}

// ─── TraceLogger ─────────────────────────────────────────────────────────────

export class TraceLogger {
  private agentId: string;
  private sessionId: string;

  constructor(agentId: string, sessionId: string) {
    this.agentId = agentId;
    this.sessionId = sessionId;
  }

  // ── Core write method ──

  private async write(event: Omit<TraceEvent, 'trace_id' | 'agent_id' | 'session_id' | 'timestamp'>) {
    const record: TraceEvent = {
      trace_id: generateTraceId(),
      session_id: this.sessionId,
      agent_id: this.agentId,
      timestamp: new Date().toISOString(),
      ...event,
    };

    // Store in circular global in-memory buffer for offline UI monitoring
    if (!globalThis.inMemoryTraces) {
      globalThis.inMemoryTraces = [];
    }
    globalThis.inMemoryTraces.unshift(record);
    if (globalThis.inMemoryTraces.length > 100) {
      globalThis.inMemoryTraces = globalThis.inMemoryTraces.slice(0, 100);
    }

    // Fire-and-forget: never block agent execution on logging
    supabase.from('agent_traces').insert([record]).then(({ error }) => {
      if (error) {
        // Fallback: structured console log so nothing is silently lost
        console.error('[TraceLogger] Failed to write trace to Supabase:', JSON.stringify(record));
      }
    });

    // Also emit a structured console log for local dev visibility
    console.log(`[TRACE] ${record.event_type} | agent=${record.agent_id} | session=${record.session_id} | tool=${record.tool_name ?? 'llm'} | status=${record.status} | ${record.duration_ms != null ? `${record.duration_ms}ms` : ''}`);
  }

  // ── LLM Think Tracing ──

  async traceThinkStart(inputSummary: string): Promise<{ startTime: number }> {
    await this.write({
      event_type: 'think_start',
      input_summary: summarizeInput(inputSummary),
      status: 'success',
    });
    return { startTime: Date.now() };
  }

  async traceThinkEnd(startTime: number, outputSummary: string, tokenCount?: number) {
    await this.write({
      event_type: 'think_end',
      output_summary: summarizeInput(outputSummary),
      duration_ms: Date.now() - startTime,
      token_count: tokenCount,
      status: 'success',
    });
  }

  async traceThinkError(startTime: number, error: string) {
    await this.write({
      event_type: 'think_error',
      duration_ms: Date.now() - startTime,
      status: 'error',
      error_message: error.slice(0, 500),
    });
  }

  // ── Tool Call Tracing ──

  async traceToolStart(toolName: string, paramSummary: unknown): Promise<{ startTime: number }> {
    await this.write({
      event_type: 'tool_start',
      tool_name: toolName,
      input_summary: summarizeInput(paramSummary),
      status: 'success',
    });
    return { startTime: Date.now() };
  }

  async traceToolEnd(toolName: string, startTime: number, resultSummary: unknown) {
    await this.write({
      event_type: 'tool_end',
      tool_name: toolName,
      output_summary: summarizeInput(resultSummary),
      duration_ms: Date.now() - startTime,
      status: 'success',
    });
  }

  async traceToolError(toolName: string, startTime: number, error: string) {
    await this.write({
      event_type: 'tool_error',
      tool_name: toolName,
      duration_ms: Date.now() - startTime,
      status: 'error',
      error_message: error.slice(0, 500),
    });
  }

  async traceToolDenied(toolName: string, reason: string) {
    await this.write({
      event_type: 'tool_denied',
      tool_name: toolName,
      status: 'blocked',
      error_message: reason,
    });
  }

  async traceSecurityBlock(reason: string, inputSummary: string) {
    await this.write({
      event_type: 'security_block',
      input_summary: summarizeInput(inputSummary),
      status: 'blocked',
      error_message: reason,
    });
  }

  // ── Session Bookends ──

  async traceSessionStart(metadata?: Record<string, unknown>) {
    await this.write({
      event_type: 'session_start',
      status: 'success',
      metadata,
    });
  }

  async traceSessionEnd(metadata?: Record<string, unknown>) {
    await this.write({
      event_type: 'session_end',
      status: 'success',
      metadata,
    });
  }
}
