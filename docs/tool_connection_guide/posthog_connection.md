# Tool Connection Guide: PostHog (Product Intelligence)

This guide details the integration of **PostHog** for autonomous behavioral tracking and PQL identification.

## 1. Overview
PostHog provides the "Usage Data" that allows the **Head of PLG (02b)** to identify which users are ready for a sales upgrade based on their real actions inside your app.

## 2. Setup
1. Log in to your [PostHog Instance](https://app.posthog.com/).
2. Go to **Project Settings**.
3. **Personal API Key:** Generate a new key in the "Personal API Keys" section.
4. **Project ID:** Copy your "Project API Key / Token" or the numeric Project ID from the URL.

## 3. Configuration
Add your credentials to [`.env.local`](file:///Users/abdulfatiraziz/Synpase/Synpase%20Agentic%20GTM%20System/synapse-app/.env.local):
```bash
POSTHOG_API_KEY="phx_your_personal_key_here"
POSTHOG_PROJECT_ID="12345"
```

## 4. Core Actions
- **`identify_pqls`**: Queries user events (e.g., `Team Invite`, `Data Export`) to score users for Sales triage.

## 5. Verification Mission
Run the alignment mission to verify the PostHog connection:
```bash
npx tsx --env-file=.env.local src/scripts/mission_plg_alignment.ts
```
