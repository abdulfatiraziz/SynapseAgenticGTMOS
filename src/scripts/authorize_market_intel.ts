import { supabase } from '../lib/supabase';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function authorizeMarketIntelAgents() {
  console.log('--- Authorizing Agents for Market Intelligence Layer ---');
  
  const targetAgents = ['01', '01b', '01d', '03c'];
  
  for (const agentId of targetAgents) {
    // Get existing tools first to avoid overwriting
    const { data: agent } = await supabase
      .from('agents')
      .select('tools_required')
      .eq('agent_id', agentId)
      .single();

    const existingTools = agent?.tools_required || [];
    const updatedTools = [...new Set([...existingTools, 'MarketIntel', 'Google'])];

    const { error } = await supabase
      .from('agents')
      .update({ tools_required: updatedTools })
      .eq('agent_id', agentId);

    if (error) {
      console.error(`❌ Failed to authorize Agent ${agentId}:`, error.message);
    } else {
      console.log(`✅ Agent ${agentId} authorized for MarketIntel.`);
    }
  }
}

authorizeMarketIntelAgents();
