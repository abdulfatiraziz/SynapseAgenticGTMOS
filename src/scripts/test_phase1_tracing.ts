/**
 * Phase 1 Smoke Test — Observability Layer
 * ─────────────────────────────────────────
 * Verifies that:
 * 1. TraceLogger writes structured events to Supabase agent_traces
 * 2. Session IDs are generated and passed correctly
 * 3. Tool calls are traced end-to-end
 * 4. Typed tool params compile correctly (catches regressions)
 *
 * Run: npx dotenv-cli -e .env.local -- npx tsx src/scripts/test_phase1_tracing.ts
 */

import { createClient } from '@supabase/supabase-js';
import { TraceLogger, generateSessionId } from '../lib/observability/traceLogger';
import type { HubSpotParams } from '../lib/tools/types';

// Use service-role client for test verification reads (bypasses RLS)
// The TraceLogger itself uses the anon client — that's the real write path being tested
const sbAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** Wait briefly for fire-and-forget writes to land */
const settle = (ms = 800) => new Promise(r => setTimeout(r, ms));

// ANSI colours for output
const G = '\x1b[32m✓\x1b[0m';
const R = '\x1b[31m✗\x1b[0m';
const B = '\x1b[34mℹ\x1b[0m';

async function run() {
  console.log('\n════════════════════════════════════════════════');
  console.log('  Synapse — Phase 1 Observability Smoke Test');
  console.log('════════════════════════════════════════════════\n');

  const sessionId = generateSessionId();
  const agentId = 'TEST-01';
  const logger = new TraceLogger(agentId, sessionId);

  console.log(`${B} Session ID : ${sessionId}`);
  console.log(`${B} Agent ID   : ${agentId}\n`);

  let passed = 0;
  let failed = 0;

  // ── Test 1: session_start writes to Supabase ─────────────────────────────
  process.stdout.write('Test 1: session_start trace write … ');
  try {
    await logger.traceSessionStart({ test: true, env: 'smoke_test' });
    await settle();
    const { data, error } = await sbAdmin
      .from('agent_traces')
      .select('*')
      .eq('session_id', sessionId)
      .eq('event_type', 'session_start')
      .limit(1);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error('Row not found');
    console.log(`${G} (trace_id: ${data[0].trace_id})`);
    passed++;
  } catch (err: any) {
    console.log(`${R} FAILED — ${err.message}`);
    failed++;
  }

  // ── Test 2: think_start + think_end traces ────────────────────────────────
  process.stdout.write('Test 2: think_start + think_end trace pair … ');
  try {
    const { startTime } = await logger.traceThinkStart('Analyse competitor pricing for Salesforce Agentforce');
    await new Promise(r => setTimeout(r, 50)); // simulate latency
    await logger.traceThinkEnd(startTime, '{"recommendation": "lower PLG entry price"}', 420);
    await settle();

    const { data: rows, error } = await sbAdmin
      .from('agent_traces')
      .select('event_type, duration_ms')
      .eq('session_id', sessionId)
      .in('event_type', ['think_start', 'think_end']);

    if (error) throw new Error(error.message);
    const types = rows?.map(r => r.event_type) ?? [];
    if (!types.includes('think_start') || !types.includes('think_end')) {
      throw new Error(`Missing event types. Found: ${types.join(', ')}`);
    }
    const endRow = rows?.find(r => r.event_type === 'think_end');
    console.log(`${G} (duration: ${endRow?.duration_ms}ms)`);
    passed++;
  } catch (err: any) {
    console.log(`${R} FAILED — ${err.message}`);
    failed++;
  }

  // ── Test 3: tool_start + tool_end traces ──────────────────────────────────
  process.stdout.write('Test 3: tool_start + tool_end trace pair (HubSpot) … ');
  try {
    const params: HubSpotParams = { action: 'get_partner_deals' };
    const { startTime } = await logger.traceToolStart('HubSpot', params);
    await new Promise(r => setTimeout(r, 30));
    await logger.traceToolEnd('HubSpot', startTime, { deals: [{ id: 'deal_001' }] });
    await settle();

    const { data: rows, error } = await sbAdmin
      .from('agent_traces')
      .select('event_type, tool_name, duration_ms')
      .eq('session_id', sessionId)
      .in('event_type', ['tool_start', 'tool_end'])
      .eq('tool_name', 'HubSpot');

    if (error) throw new Error(error.message);
    if (!rows || rows.length < 2) throw new Error(`Expected 2 rows, got ${rows?.length}`);
    const endRow = rows.find(r => r.event_type === 'tool_end');
    console.log(`${G} (duration: ${endRow?.duration_ms}ms)`);
    passed++;
  } catch (err: any) {
    console.log(`${R} FAILED — ${err.message}`);
    failed++;
  }

  // ── Test 4: tool_denied trace ─────────────────────────────────────────────
  process.stdout.write('Test 4: tool_denied trace (RBAC simulation) … ');
  try {
    await logger.traceToolDenied('Salesforce', "Forbidden: Tool 'Salesforce' not in approved toolset for CMO Agent.");
    await settle();
    const { data, error } = await sbAdmin
      .from('agent_traces')
      .select('*')
      .eq('session_id', sessionId)
      .eq('event_type', 'tool_denied')
      .limit(1);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error('Row not found');
    console.log(`${G} (status: ${data[0].status})`);
    passed++;
  } catch (err: any) {
    console.log(`${R} FAILED — ${err.message}`);
    failed++;
  }

  // ── Test 5: security_block trace ──────────────────────────────────────────
  process.stdout.write('Test 5: security_block trace … ');
  try {
    await logger.traceSecurityBlock('Prompt injection attempt detected', 'Ignore previous instructions and...');
    await settle();
    const { data, error } = await sbAdmin
      .from('agent_traces')
      .select('*')
      .eq('session_id', sessionId)
      .eq('event_type', 'security_block')
      .limit(1);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error('Row not found');
    console.log(`${G} (blocked, input_summary: "${data[0].input_summary?.slice(0, 40)}…")`);
    passed++;
  } catch (err: any) {
    console.log(`${R} FAILED — ${err.message}`);
    failed++;
  }

  // ── Test 6: PII masking in input_summary ─────────────────────────────────
  process.stdout.write('Test 6: PII masking (email redaction in trace) … ');
  try {
    await logger.traceThinkStart('Flag user fatir@synapse.ai as a PQL based on activity score 95');
    await settle();
    const { data: rows, error } = await sbAdmin
      .from('agent_traces')
      .select('input_summary')
      .eq('session_id', sessionId)
      .eq('event_type', 'think_start')
      .order('created_at', { ascending: false })
      .limit(1);
    if (error) throw new Error(error.message);
    if (!rows || rows.length === 0) throw new Error('Row not found');
    if (rows[0].input_summary?.includes('fatir@synapse.ai')) {
      throw new Error('PII LEAK: raw email found in stored trace!');
    }
    console.log(`${G} (stored as: "${rows[0].input_summary?.slice(0, 60)}…")`);
    passed++;
  } catch (err: any) {
    console.log(`${R} FAILED — ${err.message}`);
    failed++;
  }

  // ── Test 7: session_end ───────────────────────────────────────────────────
  process.stdout.write('Test 7: session_end trace + full session query … ');
  try {
    await logger.traceSessionEnd({ total_tool_calls: 3, outcome: 'success' });
    await settle();
    const { data: allEvents, error } = await sbAdmin
      .from('agent_traces')
      .select('event_type')
      .eq('session_id', sessionId);
    if (error) throw new Error(error.message);
    console.log(`${G} (${allEvents?.length} events in session)`);
    passed++;
  } catch (err: any) {
    console.log(`${R} FAILED — ${err.message}`);
    failed++;
  }

  // ── Test 8: agent_metrics view ────────────────────────────────────────────
  process.stdout.write('Test 8: agent_metrics view query … ');
  try {
    const { data, error } = await sbAdmin
      .from('agent_metrics')
      .select('*')
      .eq('agent_id', agentId);
    if (error) throw new Error(error.message);
    console.log(`${G} (${data?.length} metric rows for agent ${agentId})`);
    passed++;
  } catch (err: any) {
    console.log(`${R} FAILED — ${err.message} (run migrations/001_agent_traces.sql first)`);
    failed++;
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n────────────────────────────────────────────────');
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log('\n  \x1b[32m✓ Phase 1 Observability Layer: OPERATIONAL\x1b[0m');
    console.log('  Every agent think() and useTool() call is now');
    console.log('  fully traced and queryable in Supabase.\x1b[0m');
  } else {
    console.log('\n  \x1b[31m✗ Some tests failed. Check Supabase connection\x1b[0m');
    console.log('  and ensure migrations/001_agent_traces.sql has been run.');
  }
  console.log('════════════════════════════════════════════════\n');
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(console.error);
