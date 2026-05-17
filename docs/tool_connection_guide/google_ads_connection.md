# Tool Connection Guide: Google Ads (Performance Monitoring)

This guide explains how to connect the Synapse AI ecosystem to **Google Ads** using OAuth 2.0 with a Refresh Token. This is the only reliable method for personal (@gmail.com) accounts.

## 1. Setup in Google Cloud Console
1. **Create Project:** Create a project in the [Google Cloud Console](https://console.cloud.google.com).
2. **Enable API:** Go to **Library** and enable the **"Google Ads API"**.
3. **OAuth Credentials:** 
   - Go to **APIs & Services > Credentials**.
   - Click **+ Create Credentials > OAuth Client ID**.
   - Select **Web Application**.
   - **CRITICAL:** Under "Authorized redirect URIs," add: `https://developers.google.com/oauthplayground`
4. **Copy Keys:** Save your **Client ID** and **Client Secret**.

## 2. Creating a TRUE Test Account (Bypassing Billing)
> [!IMPORTANT]
> If Google asks for a payment method (UPI, Credit Card), you have entered the "Smart Mode" trap. Follow these steps to bypass it:

1. **Test Manager Link:** Use the [Google Ads Test Account Creator](https://ads.google.com/home/tools/manager-accounts/).
2. **Switch to Expert Mode:** On the "Let's start by talking about your business" screen, click **"Switch to Expert Mode"** at the very bottom.
3. **Skip Campaign:** On the goal selection screen, click the tiny link at the bottom: **"Create an account without a campaign."**
4. **Finalize:** Click **"Submit"** on the business info page (it will not ask for payment here).
5. **Verify:** You should now see a red **"Test account"** banner in the top right.

## 3. Generate the Refresh Token
1. Go to the [Google OAuth Playground](https://developers.google.com/oauthplayground).
2. Click the **Settings (⚙️)** icon (top right) and check **"Use your own OAuth credentials"**.
3. Enter your **Client ID** and **Client Secret** from Step 1.
4. On the left side (Step 1), find **Google Ads API v17** (or paste `https://www.googleapis.com/auth/adwords`).
5. Click **Authorize APIs** and sign in with your email.
6. In Step 2, click **Exchange authorization code for tokens**.
7. Copy the **Refresh Token**.

## 4. Environment Variables
Add these 6 keys to your [`.env.local`](file:///Users/abdulfatiraziz/Synpase/Synpase%20Agentic%20GTM%20System/synapse-app/.env.local):
- `GOOGLE_ADS_CLIENT_ID`: Your Cloud Client ID.
- `GOOGLE_ADS_CLIENT_SECRET`: Your Cloud Client Secret.
- `GOOGLE_ADS_REFRESH_TOKEN`: The token from OAuth Playground.
- `GOOGLE_ADS_DEVELOPER_TOKEN`: From your Manager Account > Tools > API Center.
- `GOOGLE_ADS_CUSTOMER_ID`: The 10-digit ID of your **Test Client Account**.
- `GOOGLE_ADS_LOGIN_CUSTOMER_ID`: The 10-digit ID of your **Test Manager Account**.

## 5. How it Works (Mock Fallback)
The `ToolGateway` includes a development fallback:
- **Live Attempt:** First, it tries the live API using your credentials.
- **Fallback:** If your Developer Token is still "Pending approval" or restricted to test accounts, the gateway catches the error and returns **realistic sample campaign data**.
- **Result:** Your agents can develop optimization logic immediately without waiting for Google's approval.

## 6. Verification
Run the connectivity test:
```bash
npx tsx --env-file=.env.local src/scripts/test_google_ads_live.ts
```
