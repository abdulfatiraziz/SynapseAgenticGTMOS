import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { ToolGateway } from '../lib/tools/gateway';

async function testApolloLive() {
  console.log("🚀 Testing Live Apollo.io Integration...\n");

  try {
    // 1. Search Test (Stay within 1-2 page limit for safety)
    console.log("📡 Searching for 'VP of Sales' in SaaS companies (Page 1)...");
    
    const searchResult = await ToolGateway.executeTool('03a', 'Apollo', {
      q_keywords: 'VP of Sales',
      person_locations: ['United States'],
      organization_industries: ['software'],
      page: 1
    });

    if (searchResult.status === 'success') {
      const people = searchResult.data.people || [];
      console.log(`✅ Success! Found ${people.length} prospects on page 1.`);
      
      if (people.length > 0) {
        console.log(`Sample: ${people[0].name} | ${people[0].title} @ ${people[0].organization?.name}`);
      }
    } else {
      throw new Error(`Search Failed: ${searchResult.message || JSON.stringify(searchResult.data)}`);
    }

    console.log("\n-----------------------------------\n");

    // 2. Sequence Stats Test
    console.log("📡 Attempting to pull Sequence/Campaign stats...");
    
    const sequenceResult = await ToolGateway.executeTool('03a', 'Apollo', {
      method: 'POST',
      endpoint: '/v1/emailer_campaigns/search',
      params: {
        page: 1
      }
    });

    if (sequenceResult.status === 'success') {
      const campaigns = sequenceResult.data.emailer_campaigns || [];
      console.log(`✅ Success! Found ${campaigns.length} active sequences.`);
      
      if (campaigns.length > 0) {
        console.log(`Sample Sequence: ${campaigns[0].name} | Total Enrolled: ${campaigns[0].num_enrolled}`);
      }
    } else {
      console.log(`⚠️ Sequence Stats not available on this plan or endpoint: ${sequenceResult.data?.message || 'Unauthorized'}`);
    }

  } catch (err: any) {
    console.error("❌ Live Test Failed:", err.message);
  }
}

testApolloLive();
