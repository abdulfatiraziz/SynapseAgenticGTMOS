import { supabase } from '../lib/supabase';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function authorizeAgent03b() {
  console.log('Updating RBAC for Agent 03b (Demand Gen Manager)...');
  
  const { error } = await supabase
    .from('agents')
    .update({ 
      tools_required: ['Google Ads', 'MetaAds', 'HubSpot', 'Apollo.io', 'Clay', 'Make', 'Slack'] 
    })
    .eq('agent_id', '03b');

  if (error) {
    console.error('❌ Failed to update RBAC:', error.message);
  } else {
    console.log('✅ Agent 03b is now authorized for the Performance Optimization Mission.');
  }
}

authorizeAgent03b();
