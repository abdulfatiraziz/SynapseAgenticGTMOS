import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { ToolGateway } from '../lib/tools/gateway';

async function testNotionLive() {
  console.log("🚀 Testing Live Notion Integration (The GTM Bedrock)...\n");

  try {
    console.log("📡 Searching for GTM Strategy/ICP documents...");
    
    // We simulate a Strategy agent (01a) searching for the ICP
    const result = await ToolGateway.executeTool('01a', 'Notion', {
      method: 'POST',
      endpoint: '/v1/search',
      body: {
        query: 'ICP',
        filter: { property: 'object', value: 'page' },
        sort: { direction: 'descending', timestamp: 'last_edited_time' }
      }
    });

    if (result.status === 'success') {
      const pages = result.data.results || [];
      console.log(`\n✅ Success! Found ${pages.length} pages matching 'ICP'.`);
      
      pages.forEach((page: any) => {
        const title = page.properties?.title?.title?.[0]?.plain_text || "Untitled Page";
        console.log(`   📄 [${title}] | Last Edited: ${page.last_edited_time}`);
        console.log(`   🔗 URL: ${page.url}`);
      });
      
      if (pages.length === 0) {
        console.log("   ⚠️ No pages found. Make sure you have shared your ICP page with the 'Synapse AI' integration!");
      }
    } else {
      throw new Error(`Failed: ${JSON.stringify(result.data)}`);
    }

  } catch (err: any) {
    console.error("❌ Live Test Failed:", err.message);
  }
}

testNotionLive();
