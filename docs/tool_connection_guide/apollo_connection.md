# Tool Connection Guide: Apollo.io

This guide explains how to connect the Synapse AI ecosystem to **Apollo.io** for real-time lead enrichment and prospecting.

## 1. Get Your API Key
1. Log in to your **Apollo.io** account.
2. Go to **Settings > API**.
3. Create a new API Key and copy it.

## 2. Environment Variables
Add the following key to your [`.env.local`](file:///Users/abdulfatiraziz/Synpase/Synpase Agentic GTM System/synapse-app/.env.local):
- `APOLLO_API_KEY`: Your unique Apollo API key.

## 3. Implementation Details
The `Apollo` tool is implemented in [`gateway.ts`](file:///Users/abdulfatiraziz/Synpase/Synpase Agentic GTM System/synapse-app/src/lib/tools/gateway.ts). 

### Security & Authentication
- **Header Auth:** The API key is passed via the `X-Api-Key` header (not the request body).
- **Endpoint:** Uses the latest `v1/mixed_people/api_search` endpoint for people searches.

### Credit Safety Logic
To prevent accidental depletion of Apollo credits by autonomous agents:
- **Search Depth Limit:** The `ToolGateway` includes a hard-coded safety block that prevents agents from requesting results deeper than **Page 5**.
- **Page Size Control:** Agents are instructed to use minimal page sizes for initial discovery.

### Example Usage:
```typescript
await this.useTool('Apollo', {
  endpoint: '/v1/mixed_people/api_search', // Default search endpoint
  q_keywords: 'VP Sales',
  person_locations: ['United States'],
  page: 1
});

// To pull sequence performance:
await this.useTool('Apollo', {
  method: 'POST',
  endpoint: '/v1/emailer_campaigns/search',
  params: { page: 1 }
});
```

## 4. Maintenance
- **API Credits:** Keep an eye on your Apollo credit balance.
- **Filtering:** You can pass any valid Apollo search parameters (industry, company size, technographics) into the `params` object.
