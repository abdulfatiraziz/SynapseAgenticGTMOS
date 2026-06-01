import http from 'http';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { MCP_TOOLS, handleToolCall } from './mcpServer';

async function startSseServer() {
  const mcpServer = new Server(
    {
      name: 'synapse-gtm-sse',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: MCP_TOOLS,
  }));

  mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
      const result = await handleToolCall(name, (args ?? {}) as Record<string, unknown>);
      return {
        content: [
          {
            type: 'text',
            text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (err: any) {
      return {
        content: [{ type: 'text', text: `Error: ${err.message}` }],
        isError: true,
      };
    }
  });

  let sseTransport: SSEServerTransport | null = null;

  const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.method === 'GET' && req.url?.startsWith('/sse')) {
      console.log('[Synapse MCP SSE] New client requesting SSE channel...');
      sseTransport = new SSEServerTransport('/messages', res);
      await mcpServer.connect(sseTransport);
      console.log('[Synapse MCP SSE] SSE channel established successfully.');
      return;
    }

    if (req.method === 'POST' && req.url?.startsWith('/messages')) {
      if (sseTransport) {
        await sseTransport.handlePostMessage(req, res);
      } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('SSE connection not established yet. Connect via GET /sse first.');
      }
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found. MCP SSE Server listens at GET /sse and POST /messages');
  });

  const PORT = 3001;
  server.listen(PORT, () => {
    console.log(`[Synapse MCP SSE] Server listening on http://localhost:${PORT}`);
    console.log(`[Synapse MCP SSE] Endpoint: http://localhost:${PORT}/sse`);
  });
}

startSseServer().catch(err => {
  console.error('[Synapse MCP SSE] Fatal error:', err);
  process.exit(1);
});
