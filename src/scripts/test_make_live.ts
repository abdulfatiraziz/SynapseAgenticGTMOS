import { ToolGateway } from '../lib/tools/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Load environment variables immediately
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { ToolGateway } from '../lib/tools/gateway';

async function testMake() {
  console.log('--- Make.com Live Connectivity Test ---');

  const toolboxId = process.env.MAKE_TOOLBOX_ID;
  const testParams = {
    toolbox_id: toolboxId,
    action_id: 't3044_scenario_a_test', // Corrected name from discovery
    inputs: {
      linkedin_url: 'https://linkedin.com/in/test-prospect',
      company_name: 'Synapse AI'
    }
  };

  try {
    // Using RevOps (03e) as the testing agent
    const result = await ToolGateway.executeTool('03e', 'Make', testParams);
    
    console.log('Result Status:', result.status);
    
    if (result.status === 'success') {
      console.log('✅ Success: Tool Gateway successfully triggered the Make Toolbox.');
      console.log('Response Data:', JSON.stringify(result.data, null, 2));
    } else {
      console.log('❌ Failed: Make returned an error.');
      console.log('Error Details:', result.message || JSON.stringify(result.data, null, 2));
    }
  } catch (error: any) {
    console.error('❌ Execution Error:', error.message);
  }
}

testMake();
