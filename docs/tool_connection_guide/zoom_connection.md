# Tool Connection Guide: Zoom (Webinar Intelligence)

This guide details the integration of **Zoom** for autonomous attendee tracking and post-event GTM orchestration.

## 1. Overview
The Zoom integration allows the **Field & Events Manager (03d)** to pull real-time engagement data (duration of stay, questions asked) to determine the "Intent Score" of a lead after a webinar.

## 2. API Setup
1. Go to the [Zoom App Marketplace](https://marketplace.zoom.us/).
2. Create a **Server-to-Server OAuth** app.
3. **Scopes Required:**
   - `webinar:read:admin`
   - `report:read:admin`
   - `user:read:admin`

## 3. Configuration
Add your credentials to [`.env.local`](file:///Users/abdulfatiraziz/Synpase/Synpase%20Agentic%20GTM%20System/synapse-app/.env.local):
```bash
ZOOM_API_KEY="your_client_id_here"
ZOOM_API_SECRET="your_client_secret_here"
```

## 4. Core Actions
- **`get_webinar_attendees`**: Pulls the list of people who actually joined the call and their duration in minutes.

## 5. Agentic Logic
If `duration_minutes` > 50% of the webinar length, the agent autonomously triggers a **High-Intent Lead** alert in Slack and creates a task in **HubSpot**.
