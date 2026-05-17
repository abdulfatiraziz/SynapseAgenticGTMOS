import { ToolGateway } from '../lib/tools/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runCommunityMission() {
  console.log('--- [Community Lead 02c] Community Intelligence Mission ---');
  
  try {
    // 1. Audit Channels
    console.log('\nStep 1: Auditing Existing Slack Channels...');
    const audit = await ToolGateway.executeTool('02c', 'Slack', { action: 'list_channels' });
    
    if (audit.status === 'success' && audit.channels) {
      const channelNames = audit.channels.map((c: any) => c.name);
      console.log(`✅ Audit Complete. Found ${channelNames.length} channels.`);
      console.log(`Channels: ${channelNames.slice(0, 5).join(', ')}${channelNames.length > 5 ? '...' : ''}`);

      // 2. Create Intelligence Hub (if not exists)
      const hubName = 'synapse-community-intel';
      if (!channelNames.includes(hubName)) {
        console.log(`\nStep 2: Creating Community Hub: #${hubName}...`);
        const createResult = await ToolGateway.executeTool('02c', 'Slack', { 
          action: 'create_channel', 
          channel_name: hubName 
        });
        
        if (createResult.status === 'success') {
          console.log(`✅ Success: Channel #${hubName} created.`);
        } else {
          console.log(`⚠️ Warning: Could not create channel. (Check Bot Permissions: channels:manage)`);
        }
      } else {
        console.log(`✅ Hub #${hubName} already exists.`);
      }

      // 3. Monitor for Intent
      console.log('\nStep 3: Monitoring for High-Intent Community Signals...');
      // We use a dummy ID or the first one found if none provided
      const targetChannel = audit.channels[0]?.id;
      const monitor = await ToolGateway.executeTool('02c', 'Slack', { 
        action: 'monitor_intent',
        channel: targetChannel
      });

      console.log(`✅ Mission Success: Agent is now "Listening" for community intent in #${audit.channels[0]?.name}.`);
      if (monitor.intent_alerts?.length > 0) {
        console.log(`🔥 ALERT: Detected ${monitor.intent_alerts.length} high-intent signals!`);
      } else {
        console.log(`🟢 System Status: No urgent intent signals detected in recent history.`);
      }
    } else {
      console.error('❌ Audit Failed:', JSON.stringify(audit, null, 2));
    }
  } catch (err: any) {
    console.error('❌ Mission Failed:', err.message);
  }
}

runCommunityMission();
