import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { CmoAgent } from '../lib/agents/CmoAgent';
import { VpPmmAgent } from '../lib/agents/VpPmmAgent';
import { VpSalesAgent } from '../lib/agents/VpSalesAgent';

async function runEvaluation() {
  console.log("=== Strategy & Sales Leadership Evaluation (CI/CD Quality Gate) ===\n");

  const cmo = new CmoAgent();
  const pmm = new VpPmmAgent();
  const vpSales = new VpSalesAgent();
  
  // Mock Market Intel Data for CMO
  const marketIntel = {
    trend: "Significant shift towards AI-driven automation in B2B SaaS.",
    competitor_activity: "Competitor X just raised $50M and is heavily discounting.",
    target_icp_change: "Mid-market companies are now looking for consolidated platforms rather than point solutions."
  };

  // Mock Enterprise Lead for VP Sales
  const enterpriseLead = {
    id: 'lead-999',
    company_name: 'Stark Industries',
    employee_count: 10000,
    intent_score: 98,
    decision_maker_identified: true,
    title: 'CTO'
  };

  try {
    console.log("Test 1: CMO Agent defining GTM Strategy");
    const strategy = await cmo.defineGtmStrategy(marketIntel);
    console.log(`✅ Strategy Theme Generated: ${strategy.messaging_theme}`);
    
    if (!strategy.messaging_theme) throw new Error("CMO failed to generate messaging theme.");

    console.log("\n-----------------------------------\n");

    console.log("Test 2: VP PMM Agent creating Battlecards from Strategy");
    const messaging = await pmm.createMessagingFramework(strategy);
    console.log(`✅ Pitch Generated: ${messaging.elevator_pitch}`);
    console.log(`✅ Value Prop 1: ${messaging.value_prop_1}`);
    
    if (!messaging.elevator_pitch) throw new Error("VP PMM failed to generate elevator pitch.");

    console.log("\n-----------------------------------\n");

    console.log("Test 3: VP Sales Agent reviewing Enterprise Pipeline");
    const salesDecision = await vpSales.reviewEnterprisePipeline(enterpriseLead);
    console.log(`✅ Decision Made: ${salesDecision.action}`);
    console.log(`✅ Rationale: ${salesDecision.rationale}`);
    
    if (!salesDecision.action) throw new Error("VP Sales failed to make a routing decision.");

    console.log("\n🎉 Strategy & Leadership Evaluation Passed!");
  } catch (error: any) {
    console.error("❌ Evaluation Failed:", error.message);
  }
}

runEvaluation();
