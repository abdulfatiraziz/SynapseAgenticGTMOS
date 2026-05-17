import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables immediately
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function updateRBAC() {
  console.log('--- Sprint 2 RBAC Update: Demand Gen (03b) ---');
  
  const { supabase } = await import('../lib/supabase');

  const agentId = '03b';
  const newTools = ['Google Ads', 'Meta Ads'];

  // 1. Fetch current tools
  const { data: agent, error: fetchError } = await supabase
    .from('agents')
    .select('tools_required')
    .eq('agent_id', agentId)
    .single();

  if (fetchError || !agent) {
    console.error('❌ Error fetching agent:', fetchError?.message);
    return;
  }

  const currentTools = agent.tools_required || [];
  const updatedTools = Array.from(new Set([...currentTools, ...newTools]));

  // 2. Update agents table
  const { error: updateError } = await supabase
    .from('agents')
    .update({ tools_required: updatedTools })
    .eq('agent_id', agentId);

  if (updateError) {
    console.error('❌ Error updating RBAC:', updateError.message);
  } else {
    console.log(`✅ Successfully authorized Agent ${agentId} for: ${newTools.join(', ')}`);
  }
}

updateRBAC();
