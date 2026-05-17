# Tool Connection Guide: Google Analytics 4 (GA4)

This guide details the integration of the **Google Analytics Data API** for autonomous marketing attribution.

## 1. Overview
The **Demand Gen Manager (03b)** uses GA4 to identify which marketing channels (LinkedIn Ads, Search, etc.) are driving the highest quality trial signups.

## 2. Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. **Enable API:** Enable the "Google Analytics Data API".
3. **Property ID:** 
   - Open your [GA4 Property](https://analytics.google.com/).
   - Go to **Admin > Property Settings > Property Details**.
   - Copy the **Property ID**.

## 3. Configuration
Add the ID to [`.env.local`](file:///Users/abdulfatiraziz/Synpase/Synpase%20Agentic%20GTM%20System/synapse-app/.env.local):
```bash
GA4_PROPERTY_ID="123456789"
```

## 4. Core Actions
- **`get_traffic_sources`**: Returns a breakdown of users and conversions by channel (Source/Medium).

## 5. Agent Workflow
The agent cross-references this data with **PostHog** behavioral data to determine the **Return on Ad Spend (ROAS)** at a product-usage level, not just a signup level.
