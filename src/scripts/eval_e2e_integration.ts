import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { supabase } from '../lib/supabase';
import { MarketIntelAgent } from '../lib/agents/MarketIntelAgent';
import { RevOpsAgent } from '../lib/agents/RevOpsAgent';
import { SdrManagerAgent } from '../lib/agents/SdrManagerAgent';
import { VpSalesAgent } from '../lib/agents/VpSalesAgent';
import { Orchestrator } from '../lib/orchestration/orchestrator';

// Instantiate the agents
const agentMap: Record<string, any> = {
  '01d': new MarketIntelAgent(),
  '03e': new RevOpsAgent(),
  '03a': new SdrManagerAgent(),
  '02a': new VpSalesAgent(),
};

async function processE2EQueue() {
  console.log(`\n[E2E Orchestrator Loop] Sweeping queue for pending tasks...`);
  
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*, receiver:agents!tasks_receiver_agent_id_fkey(agent_id, name, id), sender:agents!tasks_sender_agent_id_fkey(agent_id, name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(1);

  if (error) throw error;

  if (!tasks || tasks.length === 0) {
    return false; // Queue empty
  }

  const task = tasks[0];
  console.log(`\n======================================================`);
  console.log(`[E2E Orchestrator] Task Picked: [${task.sender.name} ➔ ${task.receiver.name}]`);
  console.log(`[E2E Orchestrator] Subject: ${task.title}`);
  console.log(`======================================================\n`);

  // Mark as in progress
  await supabase.from('tasks').update({ status: 'in_progress' }).eq('id', task.id);
  await Orchestrator.updateAgentStatus(task.receiver.id, 'acting', `Processing task: ${task.title}`);

  try {
    const receiverAgentId = task.receiver.agent_id;
    const agentInstance = agentMap[receiverAgentId];

    if (!agentInstance) {
      console.log(`[E2E Orchestrator] Skipping task for unmapped agent ${receiverAgentId}`);
      await supabase.from('tasks').update({ status: 'failed', output_data: { error: 'Not mapped' } }).eq('id', task.id);
      return true;
    }

    let result: any = {};
    
    // Route to the specific agent logic based on who received it
    if (receiverAgentId === '03e') {
      result = await agentInstance.processInboundLead(task.input_data);
    } else if (receiverAgentId === '03a') {
      result = await agentInstance.processAssignedAccount(task.input_data);
    } else if (receiverAgentId === '02a') {
      result = await agentInstance.reviewEnterprisePipeline(task.input_data);
    }

    // Mark as completed
    await supabase.from('tasks').update({ 
      status: 'completed', 
      output_data: result 
    }).eq('id', task.id);

    await Orchestrator.logEvent(task.receiver.id, task.id, 'action', `Completed task: ${task.title}`);
    await Orchestrator.updateAgentStatus(task.receiver.id, 'idle', `Completed task: ${task.title}`);
    
    return true; // Processed a task, might be more
  } catch (err: any) {
    console.error(`❌ Task Failed: ${err.message}`);
    await supabase.from('tasks').update({ status: 'failed', output_data: { error: err.message } }).eq('id', task.id);
    return false;
  }
}

async function runE2EIntegration() {
  console.log("=== Phase 3 E2E Integration Test (Demand-to-Revenue Loop) ===\n");

  try {
    // 1. Clean the queue for the test
    await supabase.from('tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    // 2. Initial Trigger: Market Intel Agent finds a signal
    const intelAgent = new MarketIntelAgent();
    const rawSignal = {
      company_name: 'Stark Industries',
      industry: 'B2B Enterprise Software',
      employee_count: 10000,
      source_type: 'Job Board Scraping',
      signal_data: 'Stark Industries just posted 5 new roles for "Revenue Operations Manager" and "Salesforce Architect".'
    };

    console.log("▶️ TRIGGER: Market Intel (01d) initiates the pipeline...\n");
    await intelAgent.processMarketSignal(rawSignal);

    // 3. Loop until the queue is empty (E2E Domino Effect)
    let hasMoreTasks = true;
    while (hasMoreTasks) {
      // Wait a moment between sweeps
      await new Promise(resolve => setTimeout(resolve, 2000));
      hasMoreTasks = await processE2EQueue();
    }

    console.log("\n🎉 E2E Pipeline Completed! All agents successfully handed off context.");
  } catch (error: any) {
    console.error("❌ E2E Evaluation Failed:", error.message);
  }
}

runE2EIntegration();
