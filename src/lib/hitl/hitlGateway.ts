/**
 * HitlGateway — Human-in-the-Loop Approval System
 * ─────────────────────────────────────────────────
 * Intercepts high-stakes tool calls defined in SynapseConfig.hitl.gates
 * and pauses execution until a human approves via Slack.
 *
 * Flow:
 *  1. ToolGateway calls HitlGateway.requestApproval() before executing gated tools
 *  2. HitlGateway writes an approval record to Supabase hitl_approvals
 *  3. Sends a Slack message with Approve / Deny buttons
 *  4. Polls Supabase until decision is made or timeout is reached
 *  5. Returns 'approved' | 'denied' | 'timed_out'
 *
 * The Slack button click handler lives at: /api/hitl/approve/route.ts
 *
 * Controlled by SynapseConfig.hitl:
 *   enabled              → master switch (default: false)
 *   gates                → list of action names that require approval
 *   slack_channel_id     → where to send approval requests
 *   timeout_minutes      → how long to wait before auto-denying
 *   auto_approve_on_timeout → override to auto-approve instead
 */

import { getSupabaseAdmin } from '../supabaseAdmin';

// ─── Types ────────────────────────────────────────────────────────────────────

export type HitlDecision = 'approved' | 'denied' | 'timed_out';

export interface ApprovalRequest {
  agentId: string;
  sessionId: string;
  taskId?: string;
  toolName: string;
  action: string;
  paramsSummary: string; // Pre-sanitized — no PII
}

export interface ApprovalResult {
  decision: HitlDecision;
  approvalId: string;
  decidedBy?: string;
  decisionNote?: string;
}

import { SynapseConfig, isHitlGated } from '@config';

// ─── Slack helper ─────────────────────────────────────────────────────────────

async function sendSlackApprovalRequest(
  approvalId: string,
  req: ApprovalRequest,
  expiresAt: Date
): Promise<void> {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) {
    console.warn('[HITL] SLACK_BOT_TOKEN not set — approval request logged to DB only');
    return;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const approveUrl = `${appUrl}/api/hitl/approve?id=${approvalId}&decision=approved`;
  const denyUrl = `${appUrl}/api/hitl/approve?id=${approvalId}&decision=denied`;

  const expiryText = `Expires at ${expiresAt.toLocaleTimeString()} (${SynapseConfig.hitl.timeout_minutes}min)`;

  const payload = {
    channel: SynapseConfig.hitl.slack_channel_id,
    text: `⚠️ *HITL Approval Required*`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '⚠️ Human Approval Required' },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Agent:*\n${req.agentId}` },
          { type: 'mrkdwn', text: `*Tool:*\n${req.toolName}` },
          { type: 'mrkdwn', text: `*Action:*\n${req.action}` },
          { type: 'mrkdwn', text: `*Session:*\n${req.sessionId}` },
        ],
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Details:*\n${req.paramsSummary}` },
      },
      {
        type: 'context',
        elements: [{ type: 'mrkdwn', text: expiryText }],
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '✅ Approve' },
            style: 'primary',
            url: approveUrl,
            action_id: `approve_${approvalId}`,
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '❌ Deny' },
            style: 'danger',
            url: denyUrl,
            action_id: `deny_${approvalId}`,
          },
        ],
      },
    ],
  };

  try {
    const res = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.ok) {
      console.warn(`[HITL] Slack message failed: ${json.error}`);
    } else {
      console.log(`[HITL] Slack approval request sent to channel ${SynapseConfig.hitl.slack_channel_id}`);
    }
  } catch (err: any) {
    console.warn(`[HITL] Slack send error: ${err.message}`);
  }
}

// ─── Polling helper ───────────────────────────────────────────────────────────

async function pollForDecision(
  approvalId: string,
  expiresAt: Date
): Promise<ApprovalResult> {
  const pollIntervalMs = 3000; // Poll every 3 seconds
  const timeoutMs = SynapseConfig.hitl.timeout_minutes * 60 * 1000;
  const deadline = Date.now() + timeoutMs;

  console.log(`[HITL] Polling for decision on approval ${approvalId}...`);

  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, pollIntervalMs));

    const { data, error } = await (getSupabaseAdmin() as any)
      .from('hitl_approvals')
      .select('status, decided_by, decision_note')
      .eq('id', approvalId)
      .single();

    if (error) {
      console.warn(`[HITL] Poll error: ${error.message}`);
      continue;
    }

    if (data.status === 'approved' || data.status === 'denied') {
      return {
        decision: data.status as HitlDecision,
        approvalId,
        decidedBy: data.decided_by,
        decisionNote: data.decision_note,
      };
    }
  }

  // Timeout reached — update DB
  const finalDecision: HitlDecision = SynapseConfig.hitl.auto_approve_on_timeout
    ? 'approved'
    : 'timed_out';

  await (getSupabaseAdmin() as any)
    .from('hitl_approvals')
    .update({ status: 'timed_out', decided_at: new Date().toISOString() })
    .eq('id', approvalId);

  console.warn(`[HITL] Approval ${approvalId} timed out → ${finalDecision}`);
  return { decision: finalDecision, approvalId };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export class HitlGateway {
  /**
   * Check if a tool action needs HITL approval.
   * Fast path: returns false if HITL is disabled or action is not gated.
   */
  static isGated(action: string): boolean {
    return isHitlGated(action);
  }

  /**
   * Request human approval for a gated tool call.
   * Blocks until approved, denied, or timed out.
   *
   * Usage (in ToolGateway):
   *   const result = await HitlGateway.requestApproval({ ... });
   *   if (result.decision !== 'approved') throw new HitlDeniedError();
   */
  static async requestApproval(req: ApprovalRequest): Promise<ApprovalResult> {
    if (!SynapseConfig.hitl.enabled) {
      // HITL disabled — auto-approve immediately
      return { decision: 'approved', approvalId: 'hitl_disabled' };
    }

    const expiresAt = new Date(
      Date.now() + SynapseConfig.hitl.timeout_minutes * 60 * 1000
    );

    // Write approval record to Supabase
    const { data, error } = await (getSupabaseAdmin() as any)
      .from('hitl_approvals')
      .insert({
        task_id: req.taskId ?? null,
        agent_id: req.agentId,
        session_id: req.sessionId,
        tool_name: req.toolName,
        action: req.action,
        params_summary: req.paramsSummary,
        status: 'pending',
        requested_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .select('id')
      .single();

    if (error || !data) {
      console.warn(`[HITL] Failed to create approval record: ${error?.message}`);
      // Fail safe: deny if we can't create the record
      return { decision: 'denied', approvalId: 'creation_failed' };
    }

    const approvalId = data.id;
    console.log(`[HITL] Approval requested: ${approvalId} | ${req.toolName}.${req.action} | Agent: ${req.agentId}`);

    // Send Slack notification (non-blocking)
    await sendSlackApprovalRequest(approvalId, req, expiresAt);

    // Poll for decision
    return pollForDecision(approvalId, expiresAt);
  }

  /**
   * Record a human decision (called by /api/hitl/approve route).
   */
  static async recordDecision(
    approvalId: string,
    decision: 'approved' | 'denied',
    decidedBy: string,
    note?: string
  ): Promise<void> {
    await (getSupabaseAdmin() as any)
      .from('hitl_approvals')
      .update({
        status: decision,
        decided_by: decidedBy,
        decision_note: note ?? null,
        decided_at: new Date().toISOString(),
      })
      .eq('id', approvalId);
  }
}

/** Thrown when HITL gate denies a tool call */
export class HitlDeniedError extends Error {
  constructor(toolName: string, reason: string = 'Human denied the action') {
    super(`[HITL DENIED] ${toolName}: ${reason}`);
    this.name = 'HitlDeniedError';
  }
}
