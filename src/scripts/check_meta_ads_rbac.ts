import { ToolGateway } from '../lib/tools/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkRBAC() {
  console.log('--- Meta Ads: RBAC Security Validation ---');

  const agentsToTest = [
    { id: '03b', name: 'Demand Gen Manager' },
    { id: '03c', name: 'Content & SEO Lead' },
    { id: '01', name: 'CMO (Leadership)' }
  ];

  for (const agent of agentsToTest) {
    console.log(`\nTesting Identity: ${agent.name} (${agent.id})`);
    try {
      const result = await ToolGateway.executeTool(agent.id, 'Meta Ads', { endpoint: 'insights' });
      console.log(`✅ Result: Access GRANTED. (Status: ${result.status})`);
    } catch (error: any) {
      if (error.message.includes('Forbidden') || error.message.includes('not in the approved toolset')) {
        console.log(`🛡️ Result: Access DENIED. (Security Layer Working)`);
      } else {
        console.error(`❌ Unexpected Error:`, error.message);
      }
    }
  }
}

checkRBAC();
