import { ToolGateway } from '../lib/tools/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runContentLeadMission() {
  console.log('--- [Content Lead 03c] SEO Strategy Mission ---');
  
  try {
    const result = await ToolGateway.executeTool('03c', 'Ahrefs', { 
      action: 'keyword_research', 
      keyword: 'agentic gtm orchestration' 
    });

    console.log('\n✅ Keyword Research Result:');
    console.log(JSON.stringify(result, null, 2));

    if (result.status === 'success') {
      console.log('\n💡 Content Lead Analysis:');
      console.log(`Keyword: ${result.data.keyword}`);
      console.log(`Volume: ${result.data.search_volume}`);
      console.log(`Difficulty: ${result.data.difficulty}`);
      console.log('Recommendation: This is a high-intent keyword. Create a Pillar Page titled "The Ultimate Guide to Agentic GTM Orchestration".');
    }
  } catch (err: any) {
    console.error('❌ Mission Failed:', err.message);
  }
}

runContentLeadMission();
