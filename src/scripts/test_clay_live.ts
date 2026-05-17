import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { ToolGateway } from '../lib/tools/gateway';

async function testClayLive() {
  console.log("🚀 Testing Live Clay.com Integration...\n");

  try {
    console.log("📡 Sending test lead data to Clay Webhook...");
    
    // We simulate a RevOps agent sending a lead for enrichment
    const result = await ToolGateway.executeTool('03e', 'Clay', {
      test_mode: true,
      timestamp: new Date().toISOString(),
      lead_data: {
        full_name: 'Abdul Fatir Aziz',
        company: 'Synapse AI',
        linkedin_url: 'https://www.linkedin.com/in/abdulfatiraziz/',
        email: 'abdul@example.com',
        source: 'Synapse Agentic System Test'
      }
    });

    if (result.status === 'success') {
      console.log("\n✅ Success! Data dispatched to Clay.");
      console.log("👉 Please check your Clay table to see the new row appear.");
    } else {
      throw new Error(`Failed: ${result.message}`);
    }

  } catch (err: any) {
    console.error("❌ Live Test Failed:", err.message);
  }
}

testClayLive();
