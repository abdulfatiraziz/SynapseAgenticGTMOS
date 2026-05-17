import { ToolGateway } from '../lib/tools/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runStrategyMission() {
  console.log('--- [Market Intel 01d] Strategic Intelligence Mission ---');
  
  try {
    // 1. Search the Market
    console.log('\nStep 1: Performing Grounded Market Search...');
    const searchResult = await ToolGateway.executeTool('01d', 'MarketIntel', { 
      action: 'search_market', 
      query: 'Agentic GTM and B2B enrichment competitors' 
    });
    console.log('✅ Search Complete. Findings:', JSON.stringify(searchResult.data.findings, null, 2));

    // 2. Analyze Competitor Vulnerability
    console.log('\nStep 2: Analyzing Competitor Pricing & Differentiation...');
    const analysisResult = await ToolGateway.executeTool('01d', 'MarketIntel', { 
      action: 'analyze_competitor', 
      competitor_url: 'https://www.apollo.io/pricing' 
    });
    
    if (analysisResult.status === 'success') {
      console.log('\n💡 Market Intelligence Report:');
      console.log(`Competitor: ${analysisResult.data.url}`);
      console.log(`Vulnerability Identified: ${analysisResult.data.analysis.vulnerability}`);
      console.log('Recommendation: Synapse should lead with "Unlimited Enrichment" to displace high-cost credit models.');
    }
  } catch (err: any) {
    console.error('❌ Mission Failed:', err.message);
  }
}

runStrategyMission();
