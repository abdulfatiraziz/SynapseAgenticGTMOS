import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { RevOpsAgent } from '../lib/agents/RevOpsAgent';

async function runEvaluation() {
  console.log("=== RevOps Agent Evaluation (CI/CD Quality Gate) ===\n");

  const revOps = new RevOpsAgent();
  
  // High Intent Enterprise Lead
  const enterpriseLead = {
    id: 'lead-101',
    company_name: 'GlobalTech Corp',
    employee_count: 5000,
    intent_score: 95,
    source: 'Website Demo Request'
  };

  // Standard SMB Lead
  const smbLead = {
    id: 'lead-102',
    company_name: 'Local Startups LLC',
    employee_count: 45,
    intent_score: 60,
    source: 'Ebook Download'
  };

  try {
    console.log("Test 1: Routing an Enterprise High-Intent Lead");
    const result1 = await revOps.processInboundLead(enterpriseLead);
    console.log(`✅ Expected: 02a (VP Sales) | Actual: ${result1.evaluation.route_to_agent_id}`);
    if (result1.evaluation.route_to_agent_id !== '02a') {
      throw new Error("Failed Quality Gate: Incorrect Routing for Enterprise Lead.");
    }
    
    console.log("\n-----------------------------------\n");

    console.log("Test 2: Routing a Standard Mid-Intent Lead");
    const result2 = await revOps.processInboundLead(smbLead);
    console.log(`✅ Expected: 03a (SDR Manager) | Actual: ${result2.evaluation.route_to_agent_id}`);
    if (result2.evaluation.route_to_agent_id !== '03a') {
      throw new Error("Failed Quality Gate: Incorrect Routing for SMB Lead.");
    }

    console.log("\n🎉 All RevOps Routing Evaluations Passed!");
  } catch (error: any) {
    console.error("❌ Evaluation Failed:", error.message);
  }
}

runEvaluation();
