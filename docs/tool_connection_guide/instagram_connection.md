# Tool Connection Guide: Instagram Business API

This guide details the integration of the **Instagram Graph API** for autonomous brand awareness and visual GTM.

## 1. Prerequisites
- An **Instagram Business Account**.
- A **Facebook Page** linked to that Instagram account.
- A Developer App created at [developers.facebook.com](https://developers.facebook.com/).

## 2. API Configuration
1. **Add Product:** Add "Instagram Graph API" to your Meta App.
2. **Permissions:** You need an User Access Token with:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_show_list`
   - `pages_read_engagement`

## 3. Retrieving IDs
You will need your **Instagram Business Account ID** (not your username). You can find this via the Graph API Explorer by querying `/me/accounts`.

## 4. Configuration
Add the details to [`.env.local`](file:///Users/abdulfatiraziz/Synpase/Synpase%20Agentic%20GTM%20System/synapse-app/.env.local):
```bash
INSTAGRAM_ACCESS_TOKEN="your_meta_token_here"
INSTAGRAM_BUSINESS_ACCOUNT_ID="17841400000000000"
```

## 5. Agent Workflow
The **Content Lead (03c)** uses this tool to:
- `publish_media`: Post carousels or single images.
- `monitor_engagement`: Track reach and saves for PLG optimization.

## ⚠️ Important
Instagram requires "App Review" for public use. While in **Development Mode**, only the app owner (you) can be posted to.
