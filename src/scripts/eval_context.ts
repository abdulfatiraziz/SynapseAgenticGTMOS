import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { CmoAgent } from '../lib/agents/CmoAgent';

async function runEvaluation() {
  console.log("=== Knowledge Base Context Evaluation ===\n");

  const cmoAgent = new CmoAgent();

  try {
    console.log("Testing CMO Agent reasoning with company context...");
    
    // We ask the CMO a question that requires knowledge of the company profile (Synapse AI)
    const prompt = "Based on our current company profile, what is our main product and what are our primary target industries for expansion?";
    
    const schema = {
      type: "OBJECT",
      properties: {
        product_name: { type: "STRING" },
        target_industries: { type: "ARRAY", items: { type: "STRING" } },
        rationale: { type: "STRING" }
      },
      required: ["product_name", "target_industries", "rationale"]
    };

    const evaluation = await cmoAgent.think(prompt, schema);
    
    console.log(`✅ Product Identified: ${evaluation.product_name}`);
    console.log(`✅ Target Industries: ${evaluation.target_industries.join(", ")}`);
    
    if (evaluation.product_name.includes("Synapse Agentic GTM") && evaluation.target_industries.includes("Fintech")) {
      console.log("\n🎉 Context Ingestion Verified! The agent correctly reasoned using the local Knowledge Base.");
    } else {
      throw new Error("Agent failed to identify company-specific details from the context.");
    }

  } catch (error: any) {
    console.error("❌ Evaluation Failed:", error.message);
  }
}

runEvaluation();
