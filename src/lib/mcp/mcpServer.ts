/**
 * Synapse MCP Server — Model Context Protocol Gateway
 * ─────────────────────────────────────────────────────
 * Exposes all Synapse tool integrations as a formal MCP-compliant server.
 * Agents (or any MCP-compatible host like Claude Desktop, Cursor, Gemini etc.)
 * can discover and call tools via the standard JSON-RPC 2.0 protocol.
 *
 * Usage:
 *   npm run mcp:start
 *   — or pipe to an MCP host via stdin/stdout (default transport)
 *
 * Reference:
 *   Google Agent Tools & MCP whitepaper (Nov 2025), §"Core Architectural Components"
 *   Protocol spec: https://modelcontextprotocol.io
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

// ─── Tool Definitions (MCP-compliant schemas) ─────────────────────────────────

export const MCP_TOOLS: Tool[] = [
  {
    name: 'hubspot_search_contacts',
    description: 'Search HubSpot CRM for contacts matching a company, email, or property filter.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query — company name, email, or filter string' },
        limit: { type: 'number', description: 'Max results to return (default: 10)', default: 10 },
      },
      required: ['query'],
    },
  },
  {
    name: 'hubspot_create_deal',
    description: 'Create a new deal in HubSpot CRM. Requires HITL approval if over deal threshold.',
    inputSchema: {
      type: 'object',
      properties: {
        deal_name: { type: 'string', description: 'Name of the deal' },
        amount: { type: 'number', description: 'Deal value in USD' },
        stage: { type: 'string', description: 'Pipeline stage (e.g., "appointmentscheduled")' },
        contact_id: { type: 'string', description: 'Associated HubSpot contact ID' },
      },
      required: ['deal_name', 'amount', 'stage'],
    },
  },
  {
    name: 'apollo_search_people',
    description: 'Search Apollo.io for people matching title, company, location, or seniority filters.',
    inputSchema: {
      type: 'object',
      properties: {
        company_name: { type: 'string', description: 'Target company name' },
        title: { type: 'string', description: 'Job title filter (e.g., "Head of Engineering")' },
        location: { type: 'string', description: 'City, state, or country filter' },
        limit: { type: 'number', description: 'Max results (default: 20)', default: 20 },
      },
      required: [],
    },
  },
  {
    name: 'slack_post_message',
    description: 'Post a message to a Slack channel. High-stakes channels require HITL approval.',
    inputSchema: {
      type: 'object',
      properties: {
        channel: { type: 'string', description: 'Slack channel name or ID (e.g., "#gtm-alerts")' },
        text: { type: 'string', description: 'Message text (supports Slack markdown)' },
        blocks: { type: 'array', description: 'Optional Slack block kit payload', items: { type: 'object' } },
      },
      required: ['channel', 'text'],
    },
  },
  {
    name: 'notion_create_page',
    description: 'Create a new Notion page in a database or as a child of an existing page.',
    inputSchema: {
      type: 'object',
      properties: {
        parent_id: { type: 'string', description: 'Parent page or database ID' },
        title: { type: 'string', description: 'Page title' },
        content: { type: 'string', description: 'Page body content in plain text or Markdown' },
        properties: { type: 'object', description: 'Optional Notion database properties' },
      },
      required: ['parent_id', 'title'],
    },
  },
  {
    name: 'make_trigger_scenario',
    description: 'Trigger a Make.com scenario webhook to execute an automation workflow.',
    inputSchema: {
      type: 'object',
      properties: {
        scenario_id: { type: 'string', description: 'Make.com scenario ID or webhook slug' },
        payload: { type: 'object', description: 'JSON payload to send to the scenario webhook' },
      },
      required: ['scenario_id', 'payload'],
    },
  },
  {
    name: 'memory_recall',
    description: 'Recall relevant past memories from the Synapse agent memory store (pgvector).',
    inputSchema: {
      type: 'object',
      properties: {
        agent_id: { type: 'string', description: 'Agent ID to scope the memory lookup' },
        query: { type: 'string', description: 'Natural language query to find relevant memories' },
        top_k: { type: 'number', description: 'Max memories to return (default: 5)', default: 5 },
      },
      required: ['agent_id', 'query'],
    },
  },
  {
    name: 'agent_run',
    description: 'Invoke any Synapse GTM agent by ID with a mission payload.',
    inputSchema: {
      type: 'object',
      properties: {
        agent_id: {
          type: 'string',
          description: 'Agent ID (e.g., "01" for CMO, "03a" for SDR Manager, "01d" for Market Intel)',
          enum: ['01', '01b', '01c', '01d', '02a', '02b', '02c', '02d', '03a', '03b', '03c', '03d', '03e', '04a', '04b', '04c', '04d'],
        },
        mission: { type: 'string', description: 'Mission or task description for the agent' },
        session_id: { type: 'string', description: 'Optional session ID to link to an existing trace session' },
      },
      required: ['agent_id', 'mission'],
    },
  },
];

// ─── Tool Handler ─────────────────────────────────────────────────────────────

export async function handleToolCall(name: string, args: Record<string, unknown>): Promise<unknown> {
  // Dynamically import ToolGateway to avoid circular dep issues at startup
  const { ToolGateway } = await import('../tools/gateway');

  switch (name) {
    case 'hubspot_search_contacts':
      return ToolGateway.executeTool('mcp-host', 'hubspot', {
        action: 'searchContacts',
        query: args.query as string,
        limit: (args.limit as number) ?? 10,
      });

    case 'hubspot_create_deal':
      return ToolGateway.executeTool('mcp-host', 'hubspot', {
        action: 'createDeal',
        deal_name: args.deal_name,
        amount: args.amount,
        stage: args.stage,
        contact_id: args.contact_id,
      });

    case 'apollo_search_people':
      return ToolGateway.executeTool('mcp-host', 'apollo', {
        action: 'searchPeople',
        company_name: args.company_name,
        title: args.title,
        location: args.location,
        limit: args.limit ?? 20,
      });

    case 'slack_post_message':
      return ToolGateway.executeTool('mcp-host', 'slack', {
        action: 'postMessage',
        channel: args.channel,
        text: args.text,
        blocks: args.blocks,
      });

    case 'notion_create_page':
      return ToolGateway.executeTool('mcp-host', 'notion', {
        action: 'createPage',
        parent_id: args.parent_id,
        title: args.title,
        content: args.content,
        properties: args.properties,
      });

    case 'make_trigger_scenario':
      return ToolGateway.executeTool('mcp-host', 'make', {
        action: 'triggerScenario',
        scenario_id: args.scenario_id,
        payload: args.payload,
      });

    case 'memory_recall': {
      const { MemoryManager } = await import('../memory/memoryManager');
      const memories = await MemoryManager.recall(
        args.agent_id as string,
        args.query as string,
        { topK: (args.top_k as number) ?? 5 }
      );
      return MemoryManager.formatForPrompt(memories);
    }

    case 'agent_run': {
      // Call the agent's Next.js A2A API route internally
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/agents/${args.agent_id}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mission: args.mission,
          sessionId: args.session_id,
        }),
      });
      if (!res.ok) throw new Error(`Agent run failed: ${res.status} ${await res.text()}`);
      return res.json();
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ─── MCP Server Bootstrap ─────────────────────────────────────────────────────

async function main() {
  const server = new Server(
    {
      name: 'synapse-gtm',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List all available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: MCP_TOOLS,
  }));

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
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

  // Start with stdio transport (compatible with Claude Desktop, Cursor, etc.)
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('[Synapse MCP] Server running via stdio transport. Waiting for tool calls...');
}

main().catch((err) => {
  console.error('[Synapse MCP] Fatal error:', err);
  process.exit(1);
});
