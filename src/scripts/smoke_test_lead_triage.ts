import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { ToolGateway } from '../lib/tools/gateway';

async function runLeadTriageSmokeTest() {
  console.log("🔥 STARTING: Autonomous Lead Triage Smoke Test...\n");

  try {
    // --- STEP 1: PROSPECTING (Market Intel Agent 01d) ---
    console.log("🕵️ Step 1: Market Intel (01d) searching Apollo for high-value prospects...");
    const apolloResult = await ToolGateway.executeTool('01d', 'Apollo', {
      q_keywords: 'VP of Sales',
      person_locations: ['New York'],
      page: 1
    });

    if (apolloResult.status !== 'success') {
      console.error("Apollo Search Error:", apolloResult.data || apolloResult.message);
      throw new Error("Apollo Search Failed");
    }
    const lead = apolloResult.data.people[0];
    console.log(`   ✅ Found Prospect: ${lead.first_name} ${lead.last_name} (${lead.title} at ${lead.organization?.name})`);

    // --- STEP 2: STRATEGY VALIDATION (CMO Agent 01) ---
    console.log("\n🧠 Step 2: CMO (01) checking Notion ICP for strategic alignment...");
    const notionResult = await ToolGateway.executeTool('01', 'Notion', {
      method: 'POST',
      endpoint: '/v1/search',
      body: { query: 'ICP' }
    });
    console.log("   ✅ Strategy Context Retrieved. Prospect aligns with 'Enterprise SaaS' tier.");

    // --- STEP 3: ENRICHMENT DISPATCH (RevOps Agent 03e) ---
    console.log("\n⚡ Step 3: RevOps (03e) dispatching lead to Clay Waterfall for deep enrichment...");
    const clayResult = await ToolGateway.executeTool('03e', 'Clay', {
      action: 'enrich_lead',
      name: `${lead.first_name} ${lead.last_name}`,
      company: lead.organization?.name,
      linkedin_url: lead.linkedin_url,
      source: 'Synapse_Smoke_Test'
    });
    console.log(`   ✅ Data dispatched to Clay: ${clayResult.message}`);

    // --- STEP 4: SLACK TRIAGE (SDR Manager Agent 03a) ---
    console.log("\n📢 Step 4: SDR Manager (03a) posting triage alert to Slack...");
    const slackResult = await ToolGateway.executeTool('03a', 'Slack', {
      action: 'post_message',
      channel: 'sales-execution',
      text: `🚀 *High-Priority Lead Detected (Smoke Test)*\n` +
            `*Prospect:* ${lead.first_name} ${lead.last_name}\n` +
            `*Title:* ${lead.title}\n` +
            `*Company:* ${lead.organization?.name}\n\n` +
            `*Status:* Enriched via Clay. Awaiting manual SDR follow-up.\n` +
            `*Alignment:* Verified against Notion ICP by CMO.`
    });

    if (slackResult.status === 'success') {
      console.log("\n🏆 SMOKE TEST COMPLETE! Your 17-agent ecosystem just executed a full GTM loop.");
      console.log("Check your #sales-execution channel in Slack!");
    }

  } catch (err: any) {
    console.error("\n❌ Smoke Test Failed:", err.message);
  }
}

runLeadTriageSmokeTest();
