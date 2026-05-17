import { ToolGateway } from '../lib/tools/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function listTools() {
  console.log('--- Make.com: Listing Available Toolbox Tools ---');

  const toolboxKey = process.env.MAKE_TOOLBOX_ID;
  const serverUrl = 'https://eu1.make.com/mcp/server/68e0ea91-3031-4748-bebd-2dddf79074f0';

  try {
    const response = await fetch(`${serverUrl}/t/${toolboxKey}/stateless`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
      })
    });

    const text = await response.text();
    const lines = text.split('\n');
    const dataLine = lines.find(line => line.startsWith('data: '));
    
    if (dataLine) {
      const jsonData = JSON.parse(dataLine.replace('data: ', ''));
      console.log('Full JSON Response:', JSON.stringify(jsonData, null, 2));
      if (jsonData.result && jsonData.result.tools) {
        console.log('Available Tools:');
        console.log(JSON.stringify(jsonData.result.tools, null, 2));
      } else {
        console.log('No tools found in result.');
      }
    } else {
      console.log('No tools found or unexpected response format.');
      console.log('Raw Response:', text);
    }
  } catch (error: any) {
    console.error('❌ Error listing tools:', error.message);
  }
}

listTools();
