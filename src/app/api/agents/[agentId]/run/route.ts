import { NextRequest, NextResponse, waitUntil } from 'next/server';
import { SynapseConfig, isAgentActive } from '@config';
import { getSupabaseAdmin } from '@lib/supabaseAdmin';
import { verifyBearerToken } from '@lib/security/authHelper';

/**
 * POST /api/agents/[agentId]/run
 *
 * A2A endpoint — receives a task dispatched by another agent
 * and executes it using the appropriate agent class.
 *
 * Request body:
 * {
 *   task_type:       string   — method name to call on the agent (e.g. 'processAssignedAccount')
 *   input_data:      object   — data payload for the agent method
 *   session_id:      string   — propagated across agent chain for trace correlation
 *   calling_agent_id: string  — sender's agent ID
 *   task_id?:        string   — optional: existing agent_tasks row ID
 *   priority?:       'high' | 'medium' | 'low'
 * }
 *
 * Response:
 * { task_id, status: 'queued' | 'running' | 'done' | 'failed', output? }
 */

// Registry: maps agent_id → { import path, class name, method map }
// Add new agents here as the system grows
const AGENT_REGISTRY: Record<string, {
  importPath: string;
  className: string;
  methods: string[];
}> = {
  '01':  { importPath: '../../lib/agents/CmoAgent',          className: 'CmoAgent',          methods: ['defineGtmStrategy'] },
  '01b': { importPath: '../../lib/agents/VpPmmAgent',        className: 'VpPmmAgent',        methods: ['createMessagingFramework'] },
  '01c': { importPath: '../../lib/agents/PricingManagerAgent',className: 'PricingManagerAgent',methods: ['evaluateDiscountRequest'] },
  '01d': { importPath: '../../lib/agents/MarketIntelAgent',  className: 'MarketIntelAgent',  methods: ['processMarketSignal'] },
  '02a': { importPath: '../../lib/agents/VpSalesAgent',       className: 'VpSalesAgent',       methods: ['reviewEnterprisePipeline'] },
  '02b': { importPath: '../../lib/agents/PlgAgent',          className: 'PlgAgent',          methods: ['evaluateProductTelemetry'] },
  '02c': { importPath: '../../lib/agents/CommunityAgent',    className: 'CommunityAgent',    methods: ['processCommunitySignal'] },
  '02d': { importPath: '../../lib/agents/VpPartnershipsAgent',className: 'VpPartnershipsAgent',methods: ['processPartnerOverlap'] },
  '03a': { importPath: '../../lib/agents/SdrManagerAgent',   className: 'SdrManagerAgent',   methods: ['processAssignedAccount'] },
  '03b': { importPath: '../../lib/agents/DemandGenAgent',    className: 'DemandGenAgent',    methods: ['evaluateInboundMQL'] },
  '03c': { importPath: '../../lib/agents/ContentSeoAgent',   className: 'ContentSeoAgent',   methods: ['generateContentBrief'] },
  '03d': { importPath: '../../lib/agents/FieldEventsAgent',   className: 'FieldEventsAgent',   methods: ['processEventAttendees'] },
  '03e': { importPath: '../../lib/agents/RevOpsAgent',       className: 'RevOpsAgent',       methods: ['processInboundLead'] },
  '04a': { importPath: '../../lib/agents/VpCsAgent',         className: 'VpCsAgent',         methods: ['reviewChurnEscalation'] },
  '04b': { importPath: '../../lib/agents/CsmAgent',          className: 'CsmAgent',          methods: ['processHealthAlert'] },
  '04c': { importPath: '../../lib/agents/ExpansionAeAgent',   className: 'ExpansionAeAgent',   methods: ['processExpansionSignal'] },
  '04d': { importPath: '../../lib/agents/RenewalsManagerAgent',className: 'RenewalsManagerAgent',methods: ['processUpcomingRenewal'] },
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  // Lazy client — only created at request time, never at module load
  const sbAdmin = getSupabaseAdmin();

  const { agentId: originalAgentId } = await params;
  let targetAgentId = originalAgentId;

  // ── Canary Routing ────────────────────────────────────────────────────────
  if (SynapseConfig.canary.enabled && SynapseConfig.canary.routing[targetAgentId]) {
    const { v2_id, traffic_percentage } = SynapseConfig.canary.routing[targetAgentId];
    if (Math.random() * 100 < traffic_percentage) {
      console.log(`[CANARY] Routing request for ${targetAgentId} → ${v2_id}`);
      targetAgentId = v2_id;
    }
  }

  // ── Auth: require internal service key ──────────────────────────────────────
  const authHeader = req.headers.get('authorization');
  const expectedToken = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Validate agent ──────────────────────────────────────────────────────────
  if (!isAgentActive(targetAgentId)) {
    return NextResponse.json(
      { error: `Agent '${targetAgentId}' is not active in SynapseConfig.agents.active` },
      { status: 404 }
    );
  }

  const agentDef = AGENT_REGISTRY[targetAgentId];
  if (!agentDef) {
    return NextResponse.json(
      { error: `Agent '${targetAgentId}' has no registered implementation` },
      { status: 404 }
    );
  }

  // ── Parse body ──────────────────────────────────────────────────────────────
  let body: {
    task_type: string;
    input_data: Record<string, unknown>;
    session_id: string;
    calling_agent_id: string;
    task_id?: string;
    priority?: 'high' | 'medium' | 'low';
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { task_type, input_data, session_id, calling_agent_id, priority = 'medium' } = body;

  if (!task_type || !input_data || !session_id || !calling_agent_id) {
    return NextResponse.json(
      { error: 'Missing required fields: task_type, input_data, session_id, calling_agent_id' },
      { status: 400 }
    );
  }

  if (!agentDef.methods.includes(task_type)) {
    return NextResponse.json(
      { error: `Unknown task_type '${task_type}' for agent '${targetAgentId}'. Available: ${agentDef.methods.join(', ')}` },
      { status: 400 }
    );
  }

  // ── Create task record ─────────────────────────────────────────────────────
  const { data: taskRow, error: taskErr } = await (sbAdmin as any)
    .from('agent_tasks')
    .insert({
      session_id,
      from_agent_id: calling_agent_id,
      to_agent_id: targetAgentId,
      task_type,
      title: `${calling_agent_id} → ${targetAgentId}: ${task_type}`,
      priority,
      input_data,
      status: 'queued',
    })
    .select('id')
    .single();

  if (taskErr || !taskRow) {
    return NextResponse.json({ error: `Failed to create task: ${taskErr?.message}` }, { status: 500 });
  }

  const taskId = taskRow.id;

  // ── Execute agent async (don't block the response, protected by waitUntil) ──
  const updateRunningPromise = (sbAdmin as any).from('agent_tasks').update({ status: 'running', started_at: new Date().toISOString() }).eq('id', taskId);

  const executionPromise = (async () => {
    await updateRunningPromise;
    try {
      await executeAgent(targetAgentId, agentDef, task_type, input_data, session_id, taskId, sbAdmin);
    } catch (err) {
      console.error(`[A2A] Agent ${targetAgentId} execution failed:`, err);
    }
  })();

  waitUntil(executionPromise);

  return NextResponse.json(
    { task_id: taskId, status: 'running', agent_id: targetAgentId, task_type, original_agent_id: originalAgentId },
    { status: 202 }
  );
}

/** GET /api/agents/[agentId]/run?task_id=xxx — Poll task status */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  if (!verifyBearerToken(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sbAdmin = getSupabaseAdmin();
  const { agentId } = await params;
  const taskId = req.nextUrl.searchParams.get('task_id');
  if (!taskId) {
    return NextResponse.json({ error: 'task_id query param required' }, { status: 400 });
  }

  const { data, error } = await (sbAdmin as any)
    .from('agent_tasks')
    .select('id, status, output_data, error_message, created_at, completed_at')
    .eq('id', taskId)
    .eq('to_agent_id', agentId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

// ─── Agent Executor ───────────────────────────────────────────────────────────

async function executeAgent(
  agentId: string,
  agentDef: typeof AGENT_REGISTRY[string],
  taskType: string,
  inputData: Record<string, unknown>,
  sessionId: string,
  taskId: string,
  sbAdmin: any
): Promise<void> {
  try {
    const importedModule = await import(agentDef.importPath);
    const AgentClass = importedModule[agentDef.className];

    if (!AgentClass) throw new Error(`Class '${agentDef.className}' not found in module`);

    const agent = new AgentClass(sessionId);
    const method = agent[taskType];

    if (typeof method !== 'function') {
      throw new Error(`Method '${taskType}' not found on ${agentDef.className}`);
    }

    const output = await method.call(agent, inputData);

    await sbAdmin.from('agent_tasks').update({
      status: 'done',
      output_data: output ?? {},
      completed_at: new Date().toISOString(),
    }).eq('id', taskId);

  } catch (err: any) {
    await sbAdmin.from('agent_tasks').update({
      status: 'failed',
      error_message: err.message,
      completed_at: new Date().toISOString(),
    }).eq('id', taskId);
  }
}
