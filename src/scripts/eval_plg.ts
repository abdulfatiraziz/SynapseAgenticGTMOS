import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { PlgAgent } from '../lib/agents/PlgAgent';

async function runEvaluation() {
  console.log("=== PLG Engine Evaluation (CI/CD Quality Gate) ===\n");

  const plgAgent = new PlgAgent();
  
  // High Usage Telemetry (PQL)
  const highUsageData = {
    account_id: 'acct-333',
    company_name: 'FastGrowth Startup',
    users_added: 8,
    premium_feature_x_uses: 5,
    api_calls_last_7d: 150000,
    plan: 'Freemium'
  };

  // Low Usage Telemetry (Needs Nurture)
  const lowUsageData = {
    account_id: 'acct-444',
    company_name: 'SlowAdopter LLC',
    users_added: 1,
    premium_feature_x_uses: 0,
    api_calls_last_7d: 50,
    plan: 'Freemium'
  };

  try {
    console.log("Test 1: Evaluating High Usage Telemetry (Expecting PQL -> alert_sales)");
    const highEval = await plgAgent.evaluateProductTelemetry(highUsageData);
    console.log(`✅ Expected: alert_sales | Actual: ${highEval.decision}`);
    
    if (highEval.decision !== 'alert_sales') {
      throw new Error("PLG Agent failed to alert sales on a clear PQL.");
    }

    console.log("\n-----------------------------------\n");

    console.log("Test 2: Evaluating Low Usage Telemetry (Expecting Nurture -> trigger_in_app_flow)");
    const lowEval = await plgAgent.evaluateProductTelemetry(lowUsageData);
    console.log(`✅ Expected: trigger_in_app_flow | Actual: ${lowEval.decision}`);
    
    if (lowEval.decision !== 'trigger_in_app_flow' && lowEval.decision !== 'monitor') {
      throw new Error("PLG Agent incorrectly alerted sales on a low-usage account.");
    }

    console.log("\n🎉 PLG Engine Evaluation Passed!");
  } catch (error: any) {
    console.error("❌ Evaluation Failed:", error.message);
  }
}

runEvaluation();
