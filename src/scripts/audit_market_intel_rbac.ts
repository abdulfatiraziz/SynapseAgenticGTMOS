import { ToolGateway } from '../lib/tools/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runRbacAudit() {
  console.log('=== SYNAPSE RBAC AUDIT: Market Intelligence Layer ===\n');

  const testCases = [
    { id: '01d', role: 'Market Intel Analyst', expected: 'ALLOW' },
    { id: '01', role: 'CMO', expected: 'ALLOW' },
    { id: '03b', role: 'Demand Gen Manager', expected: 'DENY' },
    { id: '02a', role: 'VP Sales', expected: 'DENY' }
  ];

  for (const test of testCases) {
    console.log(`Testing Agent ${test.id} (${test.role})...`);
    try {
      const result = await ToolGateway.executeTool(test.id, 'MarketIntel', { 
        action: 'search_market', 
        query: 'Security Audit Test' 
      });
      console.log(`   Result: ✅ ACCESS GRANTED. Status: ${result.status}`);
      if (test.expected === 'DENY') {
        console.error(`   ❌ SECURITY FAILURE: Agent ${test.id} should have been DENIED.`);
      }
    } catch (err: any) {
      console.log(`   Result: 🔒 ACCESS DENIED. Reason: ${err.message}`);
      if (test.expected === 'ALLOW') {
        console.error(`   ❌ SECURITY FAILURE: Agent ${test.id} should have been ALLOWED.`);
      }
    }
    console.log('--------------------------------------------------');
  }

  console.log('\n=== AUDIT COMPLETE ===');
}

runRbacAudit();
