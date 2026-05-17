# Tool Connection Guide: LinkedIn Direct API

This guide details how to connect your personal or company LinkedIn account directly to the Synapse Agentic GTM system.

## 1. Developer Portal Setup
1. Go to the [LinkedIn Developer Portal](https://www.linkedin.com/developers/).
2. Create a new App named **"Synapse GTM Agent"**.
3. **Verify your Page:** You must link the app to a LinkedIn Company Page (even a test page works).

## 2. Product Selection
In the **"Products"** tab, request access to:
- **Share on LinkedIn:** Enables the `create_post` action.
- **Sign In with LinkedIn:** Required for OAuth handshake.

## 3. Auth & Permissions
Your Access Token must have the following scopes:
- `w_member_social` (to post on your behalf)
- `r_liteprofile` (to read your URN)

## 4. Configuration
Add your token to [`.env.local`](file:///Users/abdulfatiraziz/Synpase/Synpase%20Agentic%20GTM%20System/synapse-app/.env.local):
```bash
LINKEDIN_ACCESS_TOKEN="your_oauth_token_here"
```

## 5. Verification Mission
Run the LinkedIn verification script to test the connection:
```bash
npx tsx --env-file=.env.local src/scripts/mission_direct_linkedin.ts
```

## ⚠️ Known Limitation
LinkedIn tokens typically expire every 60 days. For production, the **RevOps Agent (03e)** can be configured to send a Slack alert when the token is 7 days from expiry.
