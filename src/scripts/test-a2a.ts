import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { Orchestrator } from '../lib/orchestration/orchestrator';

async function runA2ATest() {
  console.log("=== Agent-to-Agent (A2A) Handoff Test ===\n");

  try {
    // 1. Market Intel (01d) spots an intent spike and sends it to the SDR Manager (03a)
    console.log("Step 1: Market Intel (01d) dispatching task to SDR Manager (03a)...");
    
    const task = await Orchestrator.dispatchTask('01d', '03a', {
      title: 'Intent Spike Alert: Acme Corp',
      description: 'Acme Corp just showed high intent on pricing page. Add to Tier 1 Sequence.',
      priority: 'high',
      input_data: {
        company: 'Acme Corp',
        intent_score: 95,
        source: 'Bombora',
        recommended_action: 'Engage immediately'
      }
    });

    console.log(`✅ Task Queued Successfully. Task ID: ${task.id}\n`);

    // 2. Simulate the Orchestrator Sweeping the Queue
    console.log("Step 2: Orchestrator Sweeping the Queue...");
    // Give it a tiny delay so we can see the time difference if needed
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await Orchestrator.processQueue();

  } catch (error: any) {
    console.error("❌ Test Failed:", error.message);
  }
}

runA2ATest();
