import { ToolGateway } from '../lib/tools/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testAhrefs() {
  console.log('--- Ahrefs Live Connectivity Test ---');

  const testParams = {
    endpoint: 'site-explorer/overview',
    body: {
      target: 'synapse.ai'
    }
  };

  try {
    const result = await ToolGateway.executeTool('03c', 'Ahrefs', testParams);
    
    console.log('Result Status:', result.status);
    
    if (result.status === 'success') {
      console.log('✅ Success: Retreived SEO data from Ahrefs.');
      console.log('Sample Data:', JSON.stringify(result.data, null, 2));
    } else {
      console.log('❌ Failed: Ahrefs returned an error.');
      console.log('Error Details:', result.message || JSON.stringify(result.data, null, 2));
    }
  } catch (error: any) {
    console.error('❌ Execution Error:', error.message);
  }
}

testAhrefs();
