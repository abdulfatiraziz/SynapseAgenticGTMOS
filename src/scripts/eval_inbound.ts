import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { ContentSeoAgent } from '../lib/agents/ContentSeoAgent';
import { DemandGenAgent } from '../lib/agents/DemandGenAgent';

async function runEvaluation() {
  console.log("=== Inbound Engine Evaluation (CI/CD Quality Gate) ===\n");

  const contentAgent = new ContentSeoAgent();
  const demandGenAgent = new DemandGenAgent();
  
  // Mock Strategy from CMO
  const strategyData = {
    messaging_theme: "Unlock Unified Efficiency: Transform your operations with our AI-powered, integrated platform. Consolidate your tech stack.",
    icp_definition: "B2B SaaS companies with 500+ employees struggling with fragmented tools."
  };

  // Mock High-Quality MQL
  const goodMql = {
    id: 'mql-101',
    company_name: 'TechGiant Solutions',
    employee_count: 850,
    email: 'vp.ops@techgiant.com',
    source: 'LinkedIn Ad - Unified Platform Guide',
    pages_visited: 5
  };

  // Mock Low-Quality MQL (Student/Personal)
  const badMql = {
    id: 'mql-102',
    company_name: 'Unknown',
    employee_count: 1,
    email: 'coolskater99@gmail.com',
    source: 'Organic Blog Search',
    pages_visited: 1
  };

  try {
    console.log("Test 1: Content & SEO Agent generating Brief from Strategy");
    const brief = await contentAgent.generateContentBrief(strategyData);
    console.log(`✅ Blog Title: ${brief.blog_title}`);
    console.log(`✅ Keywords: ${brief.keywords.join(', ')}`);
    
    if (!brief.blog_title) throw new Error("Content Agent failed to generate a brief.");

    console.log("\n-----------------------------------\n");

    console.log("Test 2: Demand Gen Agent scoring a High-Quality MQL");
    const goodEval = await demandGenAgent.evaluateInboundMQL(goodMql);
    console.log(`✅ Decision: ${goodEval.decision}`);
    if (goodEval.decision !== 'handoff_to_revops') throw new Error("Demand Gen failed to route good MQL.");

    console.log("\n-----------------------------------\n");

    console.log("Test 3: Demand Gen Agent scoring a Low-Quality MQL");
    const badEval = await demandGenAgent.evaluateInboundMQL(badMql);
    console.log(`✅ Decision: ${badEval.decision}`);
    if (badEval.decision === 'handoff_to_revops') throw new Error("Demand Gen incorrectly routed a bad MQL to RevOps.");

    console.log("\n🎉 Inbound Engine Evaluation Passed!");
  } catch (error: any) {
    console.error("❌ Evaluation Failed:", error.message);
  }
}

runEvaluation();
