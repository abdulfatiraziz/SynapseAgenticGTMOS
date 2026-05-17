import { createClient } from '@supabase/supabase-js';
import { SynapseConfig } from '../../../synapse.config';

export interface TaskPayload {
  title: string;
  description?: string;
  input_data: any;
  priority?: 'high' | 'medium' | 'low';
  task_type?: string; // Method name to invoke on the receiving agent
}

const sbAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export class Orchestrator {
  /**
   * Dispatches a task from one agent to another.
   *
   * Transport is determined by SynapseConfig.a2a.transport:
   *   'internal' → POST to /api/agents/[receiverId]/run (Next.js API route)
   *   'http'     → POST to SynapseConfig.a2a.base_url/agents/[receiverId]/run
   *
   * Retries up to SynapseConfig.a2a.max_retries times with exponential backoff.
   * Propagates session_id for cross-agent trace correlation.
   */
  static async dispatchTask(
    senderId: string,
    receiverId: string,
    payload: TaskPayload,
    sessionId?: string
  ): Promise<{ id: string; status: string }> {
    console.log(`[A2A] Dispatching: ${senderId} → ${receiverId} | ${payload.title}`);

    const sid = sessionId ?? `sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const taskType = payload.task_type ?? this.inferTaskType(receiverId, payload);

    const { transport, max_retries, retry_backoff_ms, base_url } = SynapseConfig.a2a;

    const baseUrl = transport === 'internal'
      ? (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000')
      : (base_url ?? 'http://localhost:3000');

    const endpoint = `${baseUrl}/api/agents/${receiverId}/run`;

    const body = {
      task_type:        taskType,
      input_data:       payload.input_data,
      session_id:       sid,
      calling_agent_id: senderId,
      priority:         payload.priority ?? 'medium',
    };

    // ── Retry loop ──────────────────────────────────────────────────────────
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= max_retries; attempt++) {
      if (attempt > 0) {
        const backoff = retry_backoff_ms * Math.pow(2, attempt - 1);
        console.log(`[A2A] Retry ${attempt}/${max_retries} in ${backoff}ms...`);
        await new Promise(r => setTimeout(r, backoff));
      }

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errText}`);
        }

        const result = await res.json();
        console.log(`[A2A] Task accepted: ${result.task_id} | status: ${result.status}`);
        return { id: result.task_id, status: result.status };

      } catch (err: any) {
        lastError = err;
        console.warn(`[A2A] Attempt ${attempt + 1} failed: ${err.message}`);
      }
    }

    // All retries exhausted — write a failed task to DB for observability
    console.error(`[A2A] All ${max_retries} retries failed for ${senderId}→${receiverId}`);

    const { data: failedTask } = await sbAdmin
      .from('agent_tasks')
      .insert({
        session_id:     sid,
        from_agent_id:  senderId,
        to_agent_id:    receiverId,
        task_type:      taskType,
        title:          payload.title,
        description:    payload.description ?? '',
        priority:       payload.priority ?? 'medium',
        input_data:     payload.input_data,
        status:         'failed',
        error_message:  lastError?.message ?? 'All retries exhausted',
        completed_at:   new Date().toISOString(),
      })
      .select('id')
      .single();

    throw new Error(
      `[Orchestrator] Failed to dispatch task to agent ${receiverId}: ${lastError?.message}`
    );
  }

  /**
   * Poll a task until it reaches a terminal state (done/failed/hitl_denied).
   * Useful when the calling agent needs the output before continuing.
   *
   * @param taskId - The task_id returned by dispatchTask()
   * @param timeoutMs - Max wait time (default: 60s)
   */
  static async waitForTask(
    taskId: string,
    receiverId: string,
    timeoutMs = 60_000
  ): Promise<{ status: string; output_data?: unknown }> {
    const deadline = Date.now() + timeoutMs;
    const pollMs = 2000;

    while (Date.now() < deadline) {
      await new Promise(r => setTimeout(r, pollMs));

      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
      const res = await fetch(
        `${appUrl}/api/agents/${receiverId}/run?task_id=${taskId}`,
        { headers: { Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` } }
      );

      if (res.ok) {
        const task = await res.json();
        if (['done', 'failed', 'hitl_denied'].includes(task.status)) {
          return task;
        }
      }
    }

    return { status: 'timed_out' };
  }

  /**
   * Infer the task_type method name from the receiver agent and payload context.
   * Override by passing task_type explicitly in TaskPayload.
   */
  private static inferTaskType(receiverId: string, payload: TaskPayload): string {
    const defaults: Record<string, string> = {
      '01':  'defineGtmStrategy',
      '01b': 'createBattlecard',
      '01d': 'processMarketSignal',
      '02b': 'evaluateProductTelemetry',
      '03a': 'processAssignedAccount',
      '03c': 'generateContentBrief',
      '03e': 'triageLead',
    };
    return defaults[receiverId] ?? 'run';
  }

  // ── Legacy helpers (kept for backward compatibility) ──────────────────────

  static async logEvent(agentUuid: string, taskId: string | null, type: string, content: string) {
    const traceId = `trace-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    console.log(`[Cloud Trace: ${traceId}] type='${type}' agent=${agentUuid}`);
    await sbAdmin.from('logs').insert([{
      agent_id: agentUuid,
      task_id: taskId,
      event_type: type,
      content,
    }]).catch(() => {});
  }

  static async updateAgentStatus(agentUuid: string, status: string, actionText: string) {
    await sbAdmin.from('agents').update({
      status,
      last_action: actionText,
      updated_at: new Date().toISOString(),
    }).eq('id', agentUuid).catch(() => {});
  }
}
