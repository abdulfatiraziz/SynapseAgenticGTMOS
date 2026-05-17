import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { ToolGateway } from '../lib/tools/gateway';

async function finalSprint1Test() {
  console.log("🏁 Final Sprint 1 Validation: The 'Manifesto' Workflow...\n");

  const TEMPLATE_ID = '1zm8MBNDHBzSRU0Cxiy42KQG2LW0rQGPKdnj3hG-GxW0';
  const FOLDER_ID = '1_DI1kEyjtsV1PuelaeS7PTiqxULDoNzg';

  try {
    // 1. Copy the Template
    console.log("📡 Content Lead (03c) is copying the 'Company Profile' to create the Manifesto...");
    const copyResult = await ToolGateway.executeTool('03c', 'Google', {
      action: 'copy_file',
      resource: { 
        file_id: TEMPLATE_ID,
        new_title: 'Synapse AI: Agentic GTM Manifesto (DRAFT)',
        parent_id: FOLDER_ID
      }
    });

    if (copyResult.status !== 'success') throw new Error(`Copy Failed: ${copyResult.message}`);
    const newDocId = copyResult.data.id;
    console.log(`   ✨ Copy Created! ID: ${newDocId}`);

    // 2. Add the Agent's Mark
    console.log("\n📡 Content Lead (03c) is adding the Agentic Stamp to the document...");
    const updateResult = await ToolGateway.executeTool('03c', 'Google', {
      action: 'update_doc',
      resource: { 
        document_id: newDocId,
        text: "--- DRAFTED BY SYNAPSE AI (Agent 03c) ---\nThis document was autonomously generated based on the Bedrock Strategy in Notion and the Company Profile in Google Drive.\n\n"
      }
    });

    if (updateResult.status === 'success') {
      console.log(`\n✅ SPRINT 1 VALIDATION COMPLETE!`);
      console.log(`   📄 Document: Synapse AI: Agentic GTM Manifesto (DRAFT)`);
      console.log(`   🌐 View your new Doc: https://docs.google.com/document/d/${newDocId}/edit`);
    } else {
      throw new Error(`Update Failed: ${updateResult.message}`);
    }

  } catch (err: any) {
    console.error("❌ Final Test Failed:", err.message);
  }
}

finalSprint1Test();
