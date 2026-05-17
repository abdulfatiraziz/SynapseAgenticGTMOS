import { supabase } from '../lib/supabase';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function authorizeEventsAgent() {
  console.log('--- Authorizing Agent 03d (Field & Events Manager) ---');
  
  const { error } = await supabase
    .from('agents')
    .update({ 
      tools_required: ['Google', 'Zoom', 'HubSpot', 'Slack', 'Notion'] 
    })
    .eq('agent_id', '03d');

  if (error) {
    console.error('❌ Failed to update RBAC for Agent 03d:', error.message);
  } else {
    console.log('✅ Agent 03d authorized for Google Sheets & Zoom.');
  }
}

authorizeEventsAgent();
