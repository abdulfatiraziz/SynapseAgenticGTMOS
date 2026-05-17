# Tool Connection Guide: Notion (Strategy Bedrock)

This guide explains how we use **Notion** as the foundational "Brain" for our 17 GTM agents. Notion stores our ICP, Messaging, and Pricing strategy.

## 1. Notion Setup
1. Create an Internal Integration at [notion.so/my-integrations](https://www.notion.so/my-integrations).
2. Name it **"Synapse AI"**.
3. **Important:** You must manually "Share" specific pages/databases with this integration for the agents to see them (Click `...` > `Connect to` > `Synapse AI`).

## 2. Environment Variables
Add the following key to [`.env.local`](file:///Users/abdulfatiraziz/Synpase/Synpase Agentic GTM System/synapse-app/.env.local):
- `NOTION_API_KEY`: Your Internal Integration Secret (`secret_...`).

## 3. Implementation Details
The `Notion` tool is implemented in [`gateway.ts`](file:///Users/abdulfatiraziz/Synpase/Synpase Agentic GTM System/synapse-app/src/lib/tools/gateway.ts). It uses the **Notion REST API (v1)**.

### Key Use Cases:
- **ICP Enforcement:** RevOps (03e) reads the ICP doc to qualify HubSpot leads.
- **Messaging Alignment:** Content Lead (03c) reads Positioning docs to craft on-brand copy.
- **Market Intel Sync:** Market Intel (01d) updates the Competitive Landscape page.

### Example Usage:
```typescript
// Search for Strategy docs
await this.useTool('Notion', {
  method: 'POST',
  endpoint: '/v1/search',
  body: {
    query: 'ICP',
    filter: { property: 'object', value: 'page' }
  }
});
```

## 4. Maintenance
- **Sharing:** If an agent reports a "Not Found" error, ensure the specific page has been shared with the "Synapse AI" integration.
- **Version:** We use the `2022-06-28` version of the Notion API.
