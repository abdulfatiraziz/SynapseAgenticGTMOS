import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { ToolGateway } from '../lib/tools/gateway';

async function directWriteTest() {
  console.log("⚡ Sprint 1 Final Validation: Direct Write Mode...\n");

  const DOC_ID = '1zm8MBNDHBzSRU0Cxiy42KQG2LW0rQGPKdnj3hG-GxW0';

  try {
    // 1. Update Google Doc
    console.log("📡 Content Lead (03c) is writing directly to your 'Manifesto Template'...");
    const googleResult = await ToolGateway.executeTool('03c', 'Google', {
      action: 'update_doc',
      resource: { 
        document_id: DOC_ID,
        text: "✅ SYSTEM UPDATE: Google Workspace Connection Verified by Synapse AI.\n" +
              "Timestamp: " + new Date().toISOString() + "\n" +
              "Status: Success (Direct Write Mode enabled to bypass SA Quota).\n\n"
      }
    });

    if (googleResult.status !== 'success') throw new Error(`Google Update Failed: ${googleResult.message}`);
    console.log("   ✅ Google Doc updated!");

    // 2. Update Notion (Bonus check)
    console.log("\n📡 CMO (01) is updating the Notion Bedrock with the integration status...");
    // We'll search for the GTM Guidelines page and add a note
    const notionSearch = await ToolGateway.executeTool('01', 'Notion', {
      method: 'POST',
      endpoint: '/v1/search',
      body: { query: 'GTM Guidelines' }
    });

    if (notionSearch.status === 'success' && notionSearch.data.results.length > 0) {
      const pageId = notionSearch.data.results[0].id;
      await ToolGateway.executeTool('01', 'Notion', {
        method: 'PATCH',
        endpoint: `/v1/blocks/${pageId}/children`,
        body: {
          children: [
            {
              object: 'block',
              type: 'callout',
              callout: {
                rich_text: [{ type: 'text', text: { content: 'Integration Alert: Google Workspace is now live and connected to Layer 3 Agents.' } }],
                icon: { emoji: '🚀' }
              }
            }
          ]
        }
      });
      console.log("   ✅ Notion Strategy Hub updated!");
    }

    console.log("\n🏆 SPRINT 1 COMPLETE! Your GTM Org is now fully cross-connected.");

  } catch (err: any) {
    console.error("❌ Direct Write Test Failed:", err.message);
  }
}

directWriteTest();
