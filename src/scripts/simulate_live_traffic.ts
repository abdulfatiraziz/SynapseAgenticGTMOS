import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { supabase } from '../lib/supabase';
import { Orchestrator } from '../lib/orchestration/orchestrator';

const AGENT_IDS = [
  '01', '01b', '01c', '01d', // Strategy
  '02a', '02b', '02c', '02d', // Motions
  '03a', '03b', '03c', '03d', '03e', // Execution
  '04a', '04b', '04c', '04d' // NRR
];

async function simulateTraffic() {
  console.log("🚀 Starting Agentic GTM Live Traffic Simulation...");
  console.log("Watch the Executive Dashboard to see nodes pulsating!");

  // Fetch all UUIDs for our agents
  const { data: agents } = await supabase.from('agents').select('id, agent_id');
  if (!agents || agents.length === 0) {
    console.error("No agents found in the DB. Did you run the seed script?");
    return;
  }

  const agentMap: Record<string, string> = {};
  agents.forEach(a => {
    agentMap[a.agent_id] = a.id;
  });

  // Keep pumping data
  while (true) {
    // Pick a random sender and receiver
    const senderId = AGENT_IDS[Math.floor(Math.random() * AGENT_IDS.length)];
    let receiverId = AGENT_IDS[Math.floor(Math.random() * AGENT_IDS.length)];
    while (receiverId === senderId) {
      receiverId = AGENT_IDS[Math.floor(Math.random() * AGENT_IDS.length)];
    }

    const senderUuid = agentMap[senderId];
    const receiverUuid = agentMap[receiverId];

    if (senderUuid && receiverUuid) {
      // 1. Wake up sender
      await Orchestrator.updateAgentStatus(senderUuid, 'acting', `Compiling data for ${receiverId}...`);
      
      // Random delay to simulate LLM thinking
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
      
      // 2. Dispatch the task (this sets receiver to 'thinking' and sender to 'idle')
      await Orchestrator.dispatchTask(senderId, receiverId, {
        title: `Simulated Traffic from ${senderId}`,
        input_data: { test: true }
      });

      // 3. Keep receiver "thinking" for a bit
      await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 2000));

      // 4. Return receiver to idle
      await Orchestrator.updateAgentStatus(receiverUuid, 'idle', `Waiting for next signal.`);
    }

    // Wait before next simulation cycle
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
  }
}

simulateTraffic();
