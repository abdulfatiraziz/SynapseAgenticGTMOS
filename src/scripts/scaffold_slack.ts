import * as dotenv from 'dotenv';
import path from 'path';
import { WebClient } from '@slack/web-api';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

const CHANNELS = [
  'gtm-strategy',
  'marketing-ops',
  'gtm-finance',
  'market-intelligence',
  'sales-leadership',
  'product-growth',
  'community-pulse',
  'ecosystem-partners',
  'sales-execution',
  'demand-gen',
  'content-review',
  'event-ops',
  'ops-notifications',
  'customer-success',
  'account-management',
  'expansion-growth',
  'renewal-ops'
];

async function scaffoldSlack() {
  console.log("🚀 Starting Synapse AI Slack Scaffolder...\n");

  try {
    // 1. Test Auth
    const auth = await slack.auth.test();
    console.log(`✅ Authenticated as bot: ${auth.user} (${auth.team})\n`);

    // 2. Create Channels
    for (const channelName of CHANNELS) {
      console.log(`📡 Creating channel: #${channelName}...`);
      try {
        const result = await slack.conversations.create({ name: channelName });
        console.log(`   ✨ Created! ID: ${result.channel?.id}`);
      } catch (err: any) {
        if (err.data?.error === 'name_taken') {
          console.log(`   ℹ️ Channel #${channelName} already exists.`);
        } else {
          console.error(`   ❌ Failed to create #${channelName}:`, err.data?.error);
        }
      }
    }

    // 3. Post "Hello World" from SDR Manager
    console.log("\n📡 Sending test message from SDR Manager (03a)...");
    
    // Find the sales-execution channel ID
    const list = await slack.conversations.list({ types: 'public_channel,private_channel' });
    const salesChannel = list.channels?.find(c => c.name === 'sales-execution');

    if (salesChannel?.id) {
      // Invite bot to channel (required to post)
      try {
        await slack.conversations.join({ channel: salesChannel.id });
      } catch (e) {}

      await slack.chat.postMessage({
        channel: salesChannel.id,
        text: "*System Alert: SDR Manager (03a) Online*",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*🚀 SDR Manager (03a) reporting for duty!*"
            }
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: "*Status:* Online" },
              { type: "mrkdwn", text: "*Environment:* Production" },
              { type: "mrkdwn", text: "*Integrated Tools:* HubSpot, Apollo, Clay" }
            ]
          },
          {
            type: "divider"
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "I am now connected to the GTM Execution Lab. I will start posting live lead alerts here as they are qualified."
            }
          }
        ]
      });
      console.log("✅ Test message sent to #sales-execution!");
    }

    console.log("\n🎉 Slack Scaffolding Complete! Your autonomous workspace is ready.");

  } catch (err: any) {
    console.error("❌ Scaffolding Failed:", err.message);
  }
}

scaffoldSlack();
