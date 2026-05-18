# Tool Connection Guide: Clay.com

This guide explains how to connect the Synapse AI ecosystem to **Clay.com** using **Incoming Webhooks**. Clay acts as our "Waterfall Enrichment" and "Hyper-Personalization" engine.

## 1. Setup in Clay
1. Create a new table in **Clay**.
2. Select **"Import from Webhook"** as the source.
3. Copy the **Webhook URL** provided by Clay.

## 2. Environment Variables
Add the following key to your [`.env.local`](`.env.local`):
- `CLAY_WEBHOOK_URL`: The specific URL for your Clay table.

## 3. Implementation Details
The `Clay` tool is implemented in [`gateway.ts`](`src/lib/tools/gateway.ts`). It sends a `POST` request with the agent's requested data directly to your Clay table.

### Example Usage (Enrichment):
```typescript
await this.useTool('Clay', {
  action: 'enrich_lead',
  linkedin_url: 'https://linkedin.com/in/prospect',
  email: 'prospect@company.com'
});
```

## 4. Key GTM Use Cases
In our 17-agent framework, Clay is used as follows:

| Agent | Use Case | Result |
| :--- | :--- | :--- |
| **RevOps (03e)** | Lead Waterfall | Enriches leads with data from 50+ providers before pushing to HubSpot. |
| **Market Intel (01d)** | Deep Research | Scrapes company websites for specific keywords (e.g., "hiring for AI"). |
| **SDR Manager (03a)** | Personalized Hooks | Generates hyper-personalized opening lines based on a prospect's latest news. |

## 5. Testing
You can use the `src/scripts/test_clay_live.ts` script to push test data to your Clay table and verify it appears correctly.
