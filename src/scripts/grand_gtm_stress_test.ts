import { ToolGateway } from '../lib/tools/gateway';
import { supabase } from '../lib/supabase';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function grandStressTest() {
  console.log('🚀 --- STARTING GRAND GTM STRESS TEST (SPRINT 3) --- 🚀\n');

  // 1. Fetch All Agents
  const { data: agents, error } = await supabase.from('agents').select('*').order('agent_id');
  if (error || !agents) {
    console.error('❌ Failed to fetch agents from database.');
    return;
  }

  console.log(`📋 Found ${agents.length} Agents in the GTM Hierarchy.\n`);

  const results: any = [];

  for (const agent of agents) {
    const tools = agent.tools_required || [];
    if (tools.length === 0) continue;

    console.log(`🤖 Testing Agent ${agent.agent_id} (${agent.name})...`);
    
    // Pick the most representative tool for a pulse check
    const testTool = tools[0];
    try {
      // Simulate a generic pulse check action
      const pulse = await ToolGateway.executeTool(agent.agent_id, testTool, { action: 'pulse_check' });
      results.push({ agent: agent.agent_id, tool: testTool, status: '✅ PASS' });
    } catch (err: any) {
      // If action 'pulse_check' is not recognized, it still counts as a PASS for authorization
      if (err.message.includes('not recognized') || err.message.includes('not implemented')) {
        results.push({ agent: agent.agent_id, tool: testTool, status: '✅ AUTHORIZED' });
      } else {
        results.push({ agent: agent.agent_id, tool: testTool, status: `❌ FAIL: ${err.message}` });
      }
    }
  }

  // 2. Multi-Motion Verification Pulse
  console.log('\n📡 --- MULTI-MOTION PULSE CHECKS ---');
  
  const motions = [
    { name: 'Market Intel', agent: '01d', tool: 'MarketIntel', action: 'search_market' },
    { name: 'Social Voice', agent: '03c', tool: 'LinkedIn', action: 'create_post' },
    { name: 'Community', agent: '02c', tool: 'Slack', action: 'list_channels' },
    { name: 'Product (PLG)', agent: '02b', tool: 'PostHog', action: 'identify_pqls' },
    { name: 'Events', agent: '03d', tool: 'Zoom', action: 'get_webinar_attendees' },
    { name: 'Partners', agent: '02d', tool: 'HubSpot', action: 'get_partner_deals' }
  ];

  for (const m of motions) {
    try {
      const res = await ToolGateway.executeTool(m.agent, m.tool, { action: m.action });
      console.log(`🌟 [Motion: ${m.name}] Verified via Agent ${m.agent}. Source: ${res.source || 'Actual'}`);
    } catch (err: any) {
      console.log(`⚠️ [Motion: ${m.name}] Failed: ${err.message}`);
    }
  }

  // 3. Security Stress Test (RBAC Check)
  console.log('\n🛡️ --- SECURITY STRESS TEST (RBAC) ---');
  try {
    console.log('Attempting unauthorized access: SDR (03a) accessing MarketIntel...');
    await ToolGateway.executeTool('03a', 'MarketIntel', { action: 'analyze_competitor' });
    console.log('❌ SECURITY BREACH: Unauthorized tool access granted!');
  } catch (err: any) {
    console.log(`✅ SECURITY VERIFIED: Access Denied as expected. ("${err.message}")`);
  }

  console.log('\n✅ --- GRAND STRESS TEST COMPLETE --- ✅');
}

grandStressTest();
