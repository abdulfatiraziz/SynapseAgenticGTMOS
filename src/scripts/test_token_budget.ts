import { BaseAgent } from '../lib/agents/BaseAgent';
import { SynapseConfig } from '../../synapse.config';

async function testTokenBudget() {
  console.log('Testing Token Budget...');
  SynapseConfig.budgets.max_tokens_per_session = 500;
  
  const agent = new BaseAgent('03a'); // SDR Manager
  
  try {
    for (let i = 0; i < 20; i++) {
      console.log(`Call ${i + 1}...`);
      await agent.think('This is a test prompt designed to consume tokens. Repeat this back to me exactly.');
    }
  } catch (err: any) {
    if (err.message.includes('BudgetExceededError')) {
      console.log('✅ PASS: BudgetExceededError caught as expected.');
      console.log(err.message);
      process.exit(0);
    } else {
      console.error('❌ FAIL: Unexpected error', err);
      process.exit(1);
    }
  }
  
  console.error('❌ FAIL: Budget was not exceeded after 20 calls. Something is wrong.');
  process.exit(1);
}

testTokenBudget();
