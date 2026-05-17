# Tool Connection Guide: Gumloop.com

This guide explains how to connect the Synapse AI ecosystem to **Gumloop.com** for deep research and multi-step orchestration.

## 1. Setup in Gumloop
1. Log in to your **Gumloop** account.
2. Navigate to **Settings** > **API Keys**.
3. Create a new API Key and copy it.
4. Note your **User ID** (found in the same settings panel).

## 2. Environment Variables
Add the following keys to your [`.env.local`](file:///Users/abdulfatiraziz/Synpase/Synpase%20Agentic%20GTM%20System/synapse-app/.env.local):
- `GUMLOOP_API_KEY`: Your secret API key.
- `GUMLOOP_USER_ID`: Your unique User ID.

## 3. Implementation Details
The `Gumloop` tool is implemented in [`gateway.ts`](file:///Users/abdulfatiraziz/Synpase/Synpase%20Agentic%20GTM%20System/synapse-app/src/lib/tools/gateway.ts). It uses the `trigger_pipeline_run` endpoint to start a flow.

### Example Usage:
```typescript
await ToolGateway.executeTool('01d', 'Gumloop', {
  pipeline_id: 'your_flow_id_here',
  inputs: {
    company_url: 'https://example.com',
    research_depth: 'deep'
  }
});
```

## 4. Key GTM Use Cases
In our 17-agent framework, Gumloop is used as follows:

| Agent | Use Case | Result |
| :--- | :--- | :--- |
| **Market Intel (01d)** | 10-K Analysis | Extracts strategic initiatives from annual reports. |
| **SDR Manager (03a)** | Website Scraping | Identifies recent product launches or hiring trends. |
| **CMO (01)** | Competitor Intel | Monitors competitor news and blog updates automatically. |

## 5. Testing
Run the following command to verify the connection:
```bash
npm run test:gumloop
```
