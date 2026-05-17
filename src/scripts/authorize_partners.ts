import { supabase } from '../lib/supabase';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function authorizePartnerAgent() {
  console.log('--- Authorizing Agent 02d (Head of Partnerships) ---');
  
  const { error } = await supabase
    .from('agents')
    .update({ 
      tools_required: ['HubSpot', 'Slack', 'LinkedIn', 'MarketIntel', 'Notion'] 
    })
    .eq('agent_id', '02d');

  if (error) {
    console.error('❌ Failed to update RBAC for Agent 02d:', error.message);
  } else {
    console.log('✅ Agent 02d authorized for HubSpot Partner Intelligence.');
  }
}

authorizePartnerAgent();
