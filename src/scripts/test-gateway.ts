import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { ToolGateway } from '../lib/tools/gateway';

async function runTests() {
  console.log("=== Tool Gateway RBAC Tests ===\n");

  // Test 1: SDR Manager (03a) requesting Apollo (Authorized)
  console.log("Test 1: SDR Manager requesting Apollo...");
  try {
    const result1 = await ToolGateway.executeTool('03a', 'Apollo', { query: 'VP of Engineering' });
    console.log("✅ Success:", result1);
  } catch (e: any) {
    console.error("❌ Failed:", e.message);
  }

  console.log("\n-----------------------------------\n");

  // Test 2: SDR Manager (03a) requesting Tableau (Unauthorized)
  console.log("Test 2: SDR Manager requesting Tableau...");
  try {
    const result2 = await ToolGateway.executeTool('03a', 'Tableau', { query: 'Pipeline Coverage' });
    console.log("❌ Should have failed, but got:", result2);
  } catch (e: any) {
    console.log("✅ Blocked Successfully:", e.message);
  }

  console.log("\n-----------------------------------\n");

  // Test 3: CMO (01) requesting Tableau (Authorized)
  console.log("Test 3: CMO requesting Tableau...");
  try {
    const result3 = await ToolGateway.executeTool('01', 'Tableau', { query: 'Marketing Sourced Pipeline' });
    console.log("✅ Success:", result3);
  } catch (e: any) {
    console.error("❌ Failed:", e.message);
  }
}

runTests();
