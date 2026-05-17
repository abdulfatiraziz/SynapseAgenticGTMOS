import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { SdrManagerAgent } from '../lib/agents/SdrManagerAgent';

async function runEvaluation() {
  console.log("=== SDR Manager Evaluation (CI/CD Quality Gate) ===\n");

  const sdrManager = new SdrManagerAgent();
  
  // Mock account routed from RevOps
  const routedAccount = {
    id: 'acct-999',
    company_name: 'TechFlow Analytics',
    industry: 'B2B SaaS Data Pipelines',
    intent_score: 85,
    tech_stack: ['Snowflake', 'dbt', 'AWS']
  };

  try {
    console.log("Test 1: Persona Targeting & Apollo Search");
    const result = await sdrManager.processAssignedAccount(routedAccount);
    
    console.log("\n✅ Targeting Results:");
    console.log(JSON.stringify(result.targeting, null, 2));
    
    if (!result.targeting.titles || result.targeting.titles.length === 0) {
      throw new Error("Failed Quality Gate: SDR Manager did not return target titles.");
    }

    console.log(`\n✅ Gateway Response from Apollo:`);
    console.log(JSON.stringify(result.apolloResults, null, 2));

    console.log("\n🎉 SDR Manager Evaluation Passed!");
  } catch (error: any) {
    console.error("❌ Evaluation Failed:", error.message);
  }
}

runEvaluation();
