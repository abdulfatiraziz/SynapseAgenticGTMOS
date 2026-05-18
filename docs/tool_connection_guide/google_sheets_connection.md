# Tool Connection Guide: Google Sheets (Lead Ingestion)

This guide details how to use **Google Sheets** as a live database for lead ingestion and event registrations.

## 1. Overview
The **Field & Events Manager (03d)** uses this tool to "listen" for new signups. Instead of manual exports, the agent reads your registration sheet directly.

## 2. Setup (Service Account)
1. Ensure your **Google Service Account JSON** is in the root directory.
2. **CRITICAL:** You must **Share** your Google Sheet with the `client_email` found inside your JSON file (e.g., `gtm-service-account@...gserviceaccount.com`).
3. Set the permission to **"Editor"** or **"Viewer"**.

## 3. Configuration
Add the Spreadsheet ID (found in the URL) to [`.env.local`](`.env.local`):
```bash
WEBINAR_REGISTRATION_SHEET_ID="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
```

## 4. Core Actions
- **`read_spreadsheet`**: Pulls raw data from a specific range (e.g., `Sheet1!A:Z`).
- **`append_row`**: Allows the agent to write back "Status" updates (e.g., "Enriched", "Sales Notified").

## 5. Verification
Run the event mission to verify the agent can read your data:
```bash
npx tsx --env-file=.env.local src/scripts/mission_event_triage.ts
```
