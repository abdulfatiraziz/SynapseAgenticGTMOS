# Tool Connection Guide: Google Workspace (Service Account)

This guide explains how we use a **Google Service Account** to allow agents to manage Drive, Docs, and Sheets.

## 1. Service Account Setup
1. Created a service account in the **Level Up Life** GCP project.
2. **Key Email:** `synapse-enterprise-agent@level-up-life-j44w4.iam.gserviceaccount.com`
3. **Permissions:** The service account has been granted API access to Drive, Docs, and Sheets.

## 2. Environment Variables
The following key is used in [`.env.local`](file:///Users/abdulfatiraziz/Synpase/Synpase Agentic GTM System/synapse-app/.env.local):
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to the service account JSON key file.

## 3. Implementation Details
The `Google` tool is implemented in [`gateway.ts`](file:///Users/abdulfatiraziz/Synpase/Synpase Agentic GTM System/synapse-app/src/lib/tools/gateway.ts) using the `googleapis` library.

### Key Use Cases:
- **Drafting Strategy Docs:** Content Lead (03c) creates Google Docs for whitepapers.
- **Lead Sheets:** RevOps (03e) creates and updates Google Sheets for lead tracking.
- **Asset Management:** Drive is used as a shared repository for GTM assets.

### Sharing Requirements (IMPORTANT):
Because this is a Service Account, it has its own private Drive. To allow it to see **your** files:
1. Create a folder in your Google Drive (e.g., "Synapse GTM Assets").
2. Click **Share**.
3. Add `synapse-enterprise-agent@level-up-life-j44w4.iam.gserviceaccount.com` as an **Editor**.

## 4. Example Usage:
```typescript
// Create a new strategy doc
await ToolGateway.executeTool('03c', 'Google', {
  action: 'create_doc',
  resource: { title: 'Q3 Enterprise Outreach Strategy' }
});
```
