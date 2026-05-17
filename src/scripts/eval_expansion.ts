import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { ExpansionAeAgent } from '../lib/agents/ExpansionAeAgent';
import { RenewalsManagerAgent } from '../lib/agents/RenewalsManagerAgent';

async function runEvaluation() {
  console.log("=== Expansion & Renewals Evaluation (CI/CD Quality Gate) ===\n");

  const expansionAgent = new ExpansionAeAgent();
  const renewalsAgent = new RenewalsManagerAgent();
  
  // Mock Expansion Signal
  const expansionSignal = {
    account_id: 'acct-exp-101',
    company_name: 'CloudScale Inc',
    reason: 'Account hit 100% of seat limits and tried to invite 5 more users.',
    current_arr: 50000
  };

  // Mock Healthy Renewal
  const healthyRenewal = {
    account_id: 'acct-ren-201',
    company_name: 'SecureData Corp',
    days_until_renewal: 45,
    health_score: 'Green',
    current_arr: 120000
  };

  // Mock At-Risk Renewal
  const riskRenewal = {
    account_id: 'acct-ren-301',
    company_name: 'LegacyBank',
    days_until_renewal: 30,
    health_score: 'Red',
    current_arr: 80000
  };

  try {
    console.log("Test 1: Expansion AE processing a seat limit signal");
    const expEval = await expansionAgent.processExpansionSignal(expansionSignal);
    console.log(`✅ Play Selected: ${expEval.play_type}`);
    
    if (expEval.play_type !== 'seat_upsell') {
      throw new Error("Expansion AE failed to identify a seat upsell opportunity.");
    }

    console.log("\n-----------------------------------\n");

    console.log("Test 2: Renewals Manager handling a healthy 45-day renewal");
    const healthyEval = await renewalsAgent.processUpcomingRenewal(healthyRenewal);
    console.log(`✅ Action Selected: ${healthyEval.action}`);
    
    if (healthyEval.action !== 'draft_renewal_contract') {
      throw new Error("Renewals Manager failed to draft a contract for a healthy account.");
    }

    console.log("\n-----------------------------------\n");

    console.log("Test 3: Renewals Manager handling an at-risk 30-day renewal");
    const riskEval = await renewalsAgent.processUpcomingRenewal(riskRenewal);
    console.log(`✅ Action Selected: ${riskEval.action}`);
    
    if (riskEval.action !== 'flag_for_csm_intervention') {
      throw new Error("Renewals Manager incorrectly drafted a contract for an at-risk account instead of flagging it.");
    }

    console.log("\n🎉 Expansion & Renewals Evaluation Passed!");
  } catch (error: any) {
    console.error("❌ Evaluation Failed:", error.message);
  }
}

runEvaluation();
