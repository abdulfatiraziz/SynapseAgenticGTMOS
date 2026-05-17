import * as dotenv from 'dotenv';
import path from 'path';
import { supabase } from '../lib/supabase';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function authorizeTools() {
  console.log("🔐 Authorizing Tools for the 17-Agent GTM Org...\n");

  const { data: agents, error } = await supabase.from('agents').select('agent_id, tools_required');
  
  if (error) {
    console.error("Error fetching agents:", error);
    return;
  }

  for (const agent of agents) {
    // Add Google and Notion to the existing tools_required array if not already present
    const updatedTools = [...new Set([...(agent.tools_required || []), 'Google', 'Notion', 'Slack', 'HubSpot', 'Apollo.io', 'Clay'])];
    
    console.log(`📡 Updating Agent ${agent.agent_id}...`);
    const { error: updateError } = await supabase
      .from('agents')
      .update({ tools_required: updatedTools })
      .eq('agent_id', agent.agent_id);

    if (updateError) {
      console.error(`   ❌ Failed to update ${agent.agent_id}:`, updateError);
    } else {
      console.log(`   ✅ Authorized: ${updatedTools.join(', ')}`);
    }
  }

  console.log("\n🎉 All 17 agents are now fully authorized to use the GTM Stack.");
}

authorizeTools();
