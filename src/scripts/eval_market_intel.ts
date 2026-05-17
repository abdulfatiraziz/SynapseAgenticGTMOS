import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { MarketIntelAgent } from '../lib/agents/MarketIntelAgent';

async function runEvaluation() {
  console.log("=== Market Intel Evaluation (CI/CD Quality Gate) ===\n");

  const intelAgent = new MarketIntelAgent();
  
  // High Intent Signal
  const highIntentSignal = {
    company_name: 'Nexus Security',
    industry: 'B2B Enterprise Software',
    employee_count: 350,
    source_type: 'Job Board Scraping',
    signal_data: 'Nexus Security just posted 3 new roles for "Revenue Operations Manager" and "Salesforce Administrator".'
  };

  // Low Intent Signal
  const lowIntentSignal = {
    company_name: 'Mom & Pop Bakery',
    industry: 'Food & Beverage',
    employee_count: 12,
    source_type: 'News API',
    signal_data: 'Mom & Pop Bakery just opened a new storefront in downtown Austin.'
  };

  try {
    console.log("Test 1: Processing High-Intent Signal");
    const result1 = await intelAgent.processMarketSignal(highIntentSignal);
    
    console.log(`✅ Expected Actionable: true | Actual: ${result1.analysis.is_actionable}`);
    console.log(`✅ Expected Task Dispatched: Yes | Actual Task ID: ${result1.taskId}`);
    
    if (!result1.analysis.is_actionable || !result1.taskId) {
      throw new Error("Failed Quality Gate: High intent signal was not routed.");
    }

    console.log("\n-----------------------------------\n");

    console.log("Test 2: Processing Low-Intent Signal");
    const result2 = await intelAgent.processMarketSignal(lowIntentSignal);
    
    console.log(`✅ Expected Actionable: false | Actual: ${result2.analysis.is_actionable}`);
    console.log(`✅ Expected Task Dispatched: No | Actual Task ID: ${result2.taskId}`);
    
    if (result2.analysis.is_actionable || result2.taskId) {
      throw new Error("Failed Quality Gate: Low intent signal was incorrectly routed.");
    }

    console.log("\n🎉 Market Intel Evaluation Passed!");
  } catch (error: any) {
    console.error("❌ Evaluation Failed:", error.message);
  }
}

runEvaluation();
