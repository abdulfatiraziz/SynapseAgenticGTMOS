import { supabase } from '../lib/supabase';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function authorizeSocialAgents() {
  console.log('--- Authorizing Agents for Social Intelligence & Execution ---');
  
  // Agent 02c (Head of Community)
  const { error: err02c } = await supabase
    .from('agents')
    .update({ tools_required: ['SocialHub', 'Slack', 'Notion', 'MarketIntel'] })
    .eq('agent_id', '02c');

  // Agent 03c (Content & SEO Lead)
  const { error: err03c } = await supabase
    .from('agents')
    .update({ tools_required: ['SocialHub', 'Ahrefs', 'HubSpot', 'MarketIntel'] })
    .eq('agent_id', '03c');

  if (err02c || err03c) {
    console.error('❌ Failed to update RBAC for social agents.');
  } else {
    console.log('✅ Agent 02c and 03c authorized for SocialHub.');
  }
}

authorizeSocialAgents();
