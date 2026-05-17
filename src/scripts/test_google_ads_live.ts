import { ToolGateway } from '../lib/tools/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testGoogleAds() {
  console.log('--- Google Ads Live Connectivity Test ---');

  const testParams = {
    query: "SELECT campaign.name, metrics.cost_micros, metrics.conversions FROM campaign LIMIT 5"
  };

  try {
    const result = await ToolGateway.executeTool('03b', 'Google Ads', testParams);
    
    console.log('Result Status:', result.status);
    
    if (result.status === 'success') {
      console.log('✅ Success: Retreived campaign data from Google Ads.');
      console.log('Sample Data:', JSON.stringify(result.data, null, 2));
    } else {
      console.log('❌ Failed: Google Ads returned an error.');
      console.log('Error Details:', result.message || JSON.stringify(result.data, null, 2));
    }
  } catch (error: any) {
    console.error('❌ Execution Error:', error.message);
  }
}

testGoogleAds();
