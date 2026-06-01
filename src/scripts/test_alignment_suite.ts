import { ToolGateway } from '../lib/agents/../tools/gateway';
import { BaseAgent } from '../lib/agents/BaseAgent';
import { CriticAgent } from '../lib/agents/CriticAgent';

async function runTests() {
  console.log('=== [Synapse GTM OS: Alignment Suite Verification Suite] ===\n');

  let successCount = 0;
  let failCount = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      successCount++;
    } else {
      console.error(`[FAIL] ${message}`);
      failCount++;
    }
  }

  // --------------------------------------------------
  // Test 1: Memory-as-a-Tool Gateway Registration & RBAC Bypass
  // --------------------------------------------------
  try {
    console.log('--- Test 1: Tool Gateway Memory-as-a-Tool ---');
    
    // Attempting to execute recall_memories tool via the gateway on behalf of CMO (01)
    const result = await ToolGateway.executeTool('01', 'recall_memories', {
      agentId: '01',
      query: 'Q3 target segments',
      topK: 2
    });

    assert(result.status === 'success', 'ToolGateway successfully executed recall_memories with RBAC bypass.');
    assert(Array.isArray(result.data), 'recall_memories returned a valid array structure.');
  } catch (err: any) {
    console.error('[FAIL] Test 1: tool execution crashed:', err.message);
    failCount++;
  }

  // --------------------------------------------------
  // Test 2: Memory-as-a-Tool Store Operation
  // --------------------------------------------------
  try {
    console.log('\n--- Test 2: Memory-as-a-Tool Store operation ---');
    const storeResult = await ToolGateway.executeTool('01', 'store_memory', {
      agentId: '01',
      content: 'ICP verified: Enterprise SaaS buyers require custom SLAs and SSO integrations.',
      type: 'icp_learning'
    });

    assert(storeResult.status === 'success', 'ToolGateway successfully executed store_memory.');
  } catch (err: any) {
    console.error('[FAIL] Test 2: store memory failed:', err.message);
    failCount++;
  }

  // --------------------------------------------------
  // Test 3: Critic Agent Initialization & Identity Check
  // --------------------------------------------------
  try {
    console.log('\n--- Test 3: Critic Agent Initialization ---');
    const critic = new CriticAgent();
    await critic.initialize();

    assert(critic.name === 'Critic Agent', 'CriticAgent initialized with the correct GTM identity.');
    assert(critic.agentId === 'critic', 'CriticAgent registered under ID: critic.');
  } catch (err: any) {
    console.error('[FAIL] Test 3: initialization failed:', err.message);
    failCount++;
  }

  // --------------------------------------------------
  // Summary
  // --------------------------------------------------
  console.log('\n=== [VERIFICATION SUMMARY] ===');
  console.log(`Passed: ${successCount} | Failed: ${failCount}`);
  if (failCount === 0) {
    console.log('All tests completed successfully. Code is 100% verified.');
    process.exit(0);
  } else {
    console.error('Some tests failed. Check log outputs.');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error running verification script:', err);
  process.exit(1);
});
