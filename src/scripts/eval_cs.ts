import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { CsmAgent } from '../lib/agents/CsmAgent';
import { VpCsAgent } from '../lib/agents/VpCsAgent';

async function runEvaluation() {
  console.log("=== Customer Success Evaluation (CI/CD Quality Gate) ===\n");

  const csmAgent = new CsmAgent();
  const vpCsAgent = new VpCsAgent();
  
  // High Churn Risk (Strategic Account)
  const redHealthData = {
    account_id: 'acct-777',
    company_name: 'Wayne Enterprises',
    arr: 150000,
    health_score: 'Red',
    reason: 'Executive Sponsor Left Company, Usage Dropped 40%',
    tier: 'Strategic'
  };

  // Good Health (Expansion Signal)
  const expansionData = {
    account_id: 'acct-888',
    company_name: 'Daily Planet',
    arr: 25000,
    health_score: 'Green',
    reason: 'Hit 95% of seat licenses, requesting API access.',
    tier: 'Mid-Market'
  };

  try {
    console.log("Test 1: CSM Handling a Red Health Score (Expecting Escalation to VP CS)");
    const csmRedEval = await csmAgent.processHealthAlert(redHealthData);
    console.log(`✅ Expected Action: execute_save_play | Actual: ${csmRedEval.action}`);
    console.log(`✅ Expected Escalation: true | Actual: ${csmRedEval.requires_escalation}`);
    
    if (csmRedEval.action !== 'execute_save_play' || !csmRedEval.requires_escalation) {
      throw new Error("CSM Agent failed to properly escalate a Red Strategic Account.");
    }

    console.log("\n-----------------------------------\n");

    console.log("Test 2: VP CS Handling the Escalation (Expecting Executive Alignment)");
    const vpCsEval = await vpCsAgent.reviewChurnEscalation(redHealthData);
    console.log(`✅ Expected Decision: executive_alignment_call | Actual: ${vpCsEval.action}`);
    
    if (vpCsEval.action !== 'executive_alignment_call') {
      throw new Error("VP CS Agent failed to trigger executive alignment for a $150k account.");
    }

    console.log("\n-----------------------------------\n");

    console.log("Test 3: CSM Handling an Expansion Signal");
    const csmExpEval = await csmAgent.processHealthAlert(expansionData);
    console.log(`✅ Expected Action: route_to_expansion | Actual: ${csmExpEval.action}`);
    
    if (csmExpEval.action !== 'route_to_expansion') {
      throw new Error("CSM Agent failed to route expansion signal.");
    }

    console.log("\n🎉 Customer Success Evaluation Passed!");
  } catch (error: any) {
    console.error("❌ Evaluation Failed:", error.message);
  }
}

runEvaluation();
