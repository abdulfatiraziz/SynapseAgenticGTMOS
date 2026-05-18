# Tool Connection Guide: Meta Ads (Facebook/Instagram)

This guide explains how to connect the Synapse AI ecosystem to **Meta Ads** for performance monitoring and budget optimization.

## 1. Setup in Meta for Developers
1. **Create App:** Create a "Business" type app in the [Meta App Dashboard](https://developers.facebook.com).
2. **Marketing API:** Add the Marketing API product to your app.
3. **Graph API Explorer:**
   - Go to **Tools > Graph API Explorer**.
   - Select your App and set the token type to **Get User Access Token**.
   - Add the `ads_read` permission (and `read_insights` if available).
   - Click **Generate Access Token**.
4. **Ad Account ID:** Your ID can be found in the Ads Manager URL (e.g., `act_123456789`).

## 2. Environment Variables
Add the following keys to your [`.env.local`](`.env.local`):
- `META_ADS_ACCESS_TOKEN`: The token generated in the Explorer.
- `META_ADS_AD_ACCOUNT_ID`: Your ad account ID (including the `act_` prefix).

## 3. How it Works
The `MetaAds` tool uses the Meta Graph API v20.0 to pull real-time insights:
1. **Request:** The agent requests spend, impressions, and clicks for a specific time range.
2. **Analysis:** The tool returns a JSON object containing the performance metrics.
3. **Action:** The Demand Gen agent (03b) analyzes the data to calculate ROAS and flags underperforming campaigns.

## 4. Verification
Run the following command to test the live connection:
```bash
npx tsx --env-file=.env.local src/scripts/test_meta_ads_live.ts
```
