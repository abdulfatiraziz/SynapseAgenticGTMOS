import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { ToolGateway } from '../lib/tools/gateway';

async function testGoogleLive() {
  console.log("🚀 Testing Live Google Workspace Integration (Service Account)...\n");

  try {
    console.log("📡 Searching for your 'Company Profile' doc in the shared folder...");
    
    const result = await ToolGateway.executeTool('03c', 'Google', {
      action: 'list_files',
      resource: { query: "'1_DI1kEyjtsV1PuelaeS7PTiqxULDoNzg' in parents" }
    });

    if (result.status === 'success') {
      console.log(`\n✅ Success! Found files in your folder:`);
      const files = result.data.files || [];
      files.forEach((f: any) => console.log(`   - 📄 [${f.name}] | ID: ${f.id}`));
    } else {
      throw new Error(`Failed: ${result.message}`);
    }

  } catch (err: any) {
    console.error("❌ Live Test Failed:", err.message);
  }
}

testGoogleLive();
