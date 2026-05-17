import { supabase } from '../lib/supabase';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function authorizePLGAgents() {
  console.log('--- Authorizing PLG & Demand Gen Agents ---');
  
  // Agent 02b (Head of PLG)
  const { error: err02b } = await supabase
    .from('agents')
    .update({ 
      tools_required: ['PostHog', 'HubSpot', 'Slack', 'Notion'] 
    })
    .eq('agent_id', '02b');

  // Agent 03b (Demand Gen Manager)
  const { error: err03b } = await supabase
    .from('agents')
    .update({ 
      tools_required: ['GoogleAnalytics', 'GoogleAds', 'MetaAds', 'Slack', 'MarketIntel'] 
    })
    .eq('agent_id', '03b');

  if (err02b || err03b) {
    console.error('❌ Failed to update RBAC for PLG/Demand Gen agents.');
  } else {
    console.log('✅ Agent 02b and 03b authorized for PostHog & GA4.');
  }
}

authorizePLGAgents();
