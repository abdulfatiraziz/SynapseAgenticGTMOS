import { ToolGateway } from '../lib/tools/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function verifyOutputs() {
  console.log('--- [Output Verification] Market Intelligence ---');
  
  // 1. Market Map
  const map = await ToolGateway.executeTool('01d', 'MarketIntel', { 
    action: 'search_market', 
    query: 'Autonomous SDR agents' 
  });
  console.log('\n--- DATA OUTPUT: Market Map ---');
  console.log(JSON.stringify(map.data, null, 2));

  // 2. Vibe Check
  const sentiment = await ToolGateway.executeTool('01d', 'MarketIntel', { 
    action: 'fetch_g2_sentiment', 
    query: 'Salesforce Agentforce' 
  });
  console.log('\n--- DATA OUTPUT: Sentiment (G2 Style) ---');
  console.log(JSON.stringify(sentiment.data, null, 2));
}

verifyOutputs();
