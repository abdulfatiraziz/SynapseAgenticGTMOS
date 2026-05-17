import { ToolGateway } from '../lib/tools/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testMetaAds() {
  console.log('--- Meta Ads Live Connectivity Test ---');

  const testParams = {
    endpoint: 'insights',
    fields: 'campaign_name,spend,impressions',
    time_range: { 'since': '2026-05-01', 'until': '2026-05-16' }
  };

  try {
    const result = await ToolGateway.executeTool('03b', 'Meta Ads', testParams);
    
    console.log('Result Status:', result.status);
    
    if (result.status === 'success') {
      console.log('✅ Success: Retreived insights data from Meta Ads.');
      console.log('Sample Data:', JSON.stringify(result.data, null, 2));
    } else {
      console.log('❌ Failed: Meta Ads returned an error.');
      console.log('Error Details:', result.message || JSON.stringify(result.data, null, 2));
    }
  } catch (error: any) {
    console.error('❌ Execution Error:', error.message);
  }
}

testMetaAds();
