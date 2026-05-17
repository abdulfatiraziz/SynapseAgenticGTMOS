import { BaseAgent } from '../lib/agents/BaseAgent';
import { SynapseConfig } from '../../synapse.config';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testMarketIntel() {
  console.log('🚀 --- TESTING MARKET INTEL AGENT (01d) --- 🚀\n');
  
  // Set budget appropriately
  SynapseConfig.budgets.max_tokens_per_session = 50000;
  
  try {
    const marketIntel = new BaseAgent('01d');
    const prompt = `We are targeting the B2B SaaS logistics market. 
    Please use Apollo or your other connected tools to find exactly 1 recent news event or intent signal about a company named "Freightos" or any major logistics competitor. 
    Analyze it and provide an intent score.`;
    
    console.log(`🤖 Agent 01d (Market Intel) is thinking using model: gemini-3-flash-preview...`);
    const result = await marketIntel.think(prompt, {
      type: 'object',
      properties: {
        signal: { type: 'string' },
        intent_score: { type: 'number' },
        rationale: { type: 'string' }
      }
    });
    
    console.log('\n✅ RESULT:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (err: any) {
    console.error('\n❌ --- TEST FAILED --- ❌');
    console.error(err.message);
  }
}

testMarketIntel();
