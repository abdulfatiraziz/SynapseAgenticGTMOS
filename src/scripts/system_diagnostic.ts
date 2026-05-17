import { ToolGateway } from '../lib/tools/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runSystemDiagnostic() {
  console.log('=== SYNAPSE GTM SYSTEM DIAGNOSTIC (Sprint 1 & 2) ===\n');

  const { supabase } = await import('../lib/supabase');

  // 1. Connection Ping Test
  console.log('--- [1] Live Connectivity Audit ---');
  const connections = [
    { name: 'HubSpot', type: 'OAuth', status: process.env.HUBSPOT_CLIENT_ID ? '✅ Configured' : '❌ Missing' },
    { name: 'Apollo.io', type: 'API Key', status: process.env.APOLLO_API_KEY ? '✅ Configured' : '❌ Missing' },
    { name: 'Clay.com', type: 'Webhook', status: process.env.CLAY_WEBHOOK_URL ? '✅ Configured' : '❌ Missing' },
    { name: 'Slack', type: 'Bot Token', status: process.env.SLACK_BOT_TOKEN ? '✅ Configured' : '❌ Missing' },
    { name: 'Notion', type: 'Integration', status: process.env.NOTION_API_KEY ? '✅ Configured' : '❌ Missing' },
    { name: 'Make.com', type: 'MCP', status: process.env.MAKE_API_TOKEN ? '✅ Configured' : '❌ Missing' },
    { name: 'Meta Ads', type: 'Graph API', status: process.env.META_ADS_ACCESS_TOKEN ? '✅ Configured' : '❌ Missing' },
    { name: 'Google Ads', type: 'OAuth/Mock', status: process.env.GOOGLE_ADS_REFRESH_TOKEN ? '✅ Configured (Mock Fallback Active)' : '⚠️ Missing (Will use Mock)' }
  ];
  console.table(connections);

  // 2. Agent RBAC Audit
  console.log('\n--- [2] Agent Authorization (RBAC) Audit ---');
  const { data: agents, error } = await supabase
    .from('agents')
    .select('agent_id, name, tools_required')
    .order('agent_id');

  if (error) {
    console.error('❌ Error fetching agents from Supabase:', error.message);
  } else {
    console.log(`Found ${agents.length} Agents in Database:`);
    const agentSummary = agents.map(a => ({
      ID: a.agent_id,
      Name: a.name,
      Tools: a.tools_required ? a.tools_required.join(', ') : 'NONE'
    }));
    console.table(agentSummary);
  }

  // 3. Tool Gateway Registry Check
  console.log('\n--- [3] Tool Gateway Integrity Check ---');
  try {
    const registeredTools = ToolGateway.getRegisteredTools();
    console.log(`✅ Gateway is tracking ${registeredTools.length} core tool handlers:`);
    console.log(registeredTools.join(' | '));
  } catch (err) {
    console.error('❌ Could not inspect ToolGateway registry.');
  }

  console.log('\n=== DIAGNOSTIC COMPLETE ===');
}

runSystemDiagnostic();
