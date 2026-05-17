# Tool Connection Guide: SEO & Content Intelligence (Ahrefs/Semrush)

This guide explains how to connect the Synapse Agentic GTM system to professional SEO tools to power your **Content & SEO Lead (03c)**.

## 1. The "Liquid" SEO Strategy
To ensure zero friction during development, the system uses a **Dual-Mode** operation:
1. **Mock Mode (Development):** The system provides realistic keyword and site data without requiring a paid subscription.
2. **Live Mode (Enterprise):** The system automatically switches to live data as soon as an API key is provided in the environment.

## 2. Setup (Enterprise Live Mode)
If you have access to Ahrefs v3 or Semrush API:
1. **Ahrefs:**
   - Go to your Ahrefs Dashboard.
   - Navigate to **Account Settings > API**.
   - Create a **V3 API Key**.
2. **Semrush:**
   - Go to your Semrush Subscription page.
   - Ensure the "API" add-on is active.
   - Copy your **API Key**.

## 3. Environment Variables
Add the following to your [`.env.local`](file:///Users/abdulfatiraziz/Synpase/Synpase%20Agentic%20GTM%20System/synapse-app/.env.local):
```env
# SEO & Content Configuration
AHREFS_API_KEY=your_ahrefs_v3_key
SEMRUSH_API_KEY=your_semrush_api_key
```

## 4. Agent Mission: Keyword Research
The Content Lead uses the `Ahrefs` tool to perform the following:
- **`keyword_research`**: Fetches search volume, keyword difficulty (KD), and CPC.
- **`site_audit`**: Pulls Domain Rating (DR), backlink count, and organic traffic for competitors.

## 5. Verification
Run the SEO mission test to verify data retrieval:
```bash
npx tsx --env-file=.env.local src/scripts/mission_content_seo.ts
```

---

## 🛠️ Troubleshooting the "Mock" Warning
If you see the warning `[Gateway] SEO/Ahrefs Live Failed or Key Missing. Using Enterprise Mock Data`, it means the system is correctly falling back to its internal intelligence to save you credits. This is **normal** during the build phase.
