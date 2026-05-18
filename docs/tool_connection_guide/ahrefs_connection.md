# Tool Connection Guide: Ahrefs

This guide explains how to connect the Synapse AI ecosystem to **Ahrefs** for organic search strategy and competitor intelligence.

## 1. Setup in Ahrefs
1. Log in to your **Ahrefs** account.
2. Navigate to the **Ahrefs API** section.
3. Create a **Private App** or generate an **API Key**.
4. Ensure the app has permissions for `site-explorer` and `keywords-explorer`.

## 2. Environment Variables
Add the following key to your [`.env.local`](`.env.local`):
- `AHREFS_API_KEY`: Your Ahrefs API v3 token.

## 3. Implementation Details
The `Ahrefs` tool is implemented in [`gateway.ts`](`src/lib/tools/gateway.ts`). It uses the Ahrefs API v3 to pull SEO metrics.

### Example Usage:
```typescript
await ToolGateway.executeTool('03c', 'Ahrefs', {
  endpoint: 'site-explorer/overview',
  body: {
    target: 'example.com',
    from: '2026-01-01'
  }
});
```

## 4. Strategic Use Cases
In our 17-agent framework, Ahrefs is used as follows:

| Agent | Use Case | Result |
| :--- | :--- | :--- |
| **Content & SEO (03c)** | Keyword Clusters | Identifies high-intent keyword gaps to inform the editorial calendar. |
| **Market Intel (01d)** | Competitor Benchmarking | Monitors competitor organic traffic growth and backlink profiles. |

## 5. Testing
Run the following command to verify the connection:
```bash
npx tsx src/scripts/test_ahrefs_live.ts
```
