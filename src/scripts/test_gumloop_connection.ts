import { ToolGateway } from '../lib/tools/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testGumloop() {
  console.log('--- Gumloop Connection Smoke Test ---');
  
  const testParams = {
    pipeline_id: 'test_pipeline_id', // Replace with a real ID for a real test
    pipeline_inputs: [
      { input_name: 'company_url', value: 'https://synapse.ai' }
    ]
  };

  try {
    // Using Market Intel (01d) as the testing agent
    const result = await ToolGateway.executeTool('01d', 'Gumloop', testParams);
    
    console.log('Result Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));

    if (result.status === 'success') {
      console.log('✅ Success: Tool Gateway successfully communicated with Gumloop.');
    } else {
      console.log('❌ Failed: Gumloop returned an error (Expected if ID is fake, but check message).');
      console.log('Error Message:', result.message || result.data?.message);
    }
  } catch (error: any) {
    console.error('❌ Execution Error:', error.message);
  }
}

testGumloop();
