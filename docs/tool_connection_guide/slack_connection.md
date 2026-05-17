# Tool Connection Guide: Slack (Unified GTM Hub)

This guide details the integration of **Slack** as the central "Nervous System" for both internal operations and external community management.

## 1. Overview
The Slack integration serves two distinct purposes in the 17-agent ecosystem:
- **Internal Operations:** Real-time alerts for the Sales, RevOps, and Marketing teams.
- **Community Management:** Autonomous monitoring and engagement in customer-facing communities.

## 2. Core Actions & Use Cases

### A. Internal Notifications (Operational)
| Action | Purpose | Agent Use Case |
| :--- | :--- | :--- |
| `send_message` | Team Alerts | **RevOps (03e):** "New high-intent lead enriched in Clay." |
| `send_message` | Mission Updates | **CMO (01):** "Performance report for Q2 is ready in Notion." |

### B. Community Management (Growth)
| Action | Purpose | Agent Use Case |
| :--- | :--- | :--- |
| `list_channels` | Audit | **Community Lead (02c):** "Identify all active customer Slack channels." |
| `create_channel` | Expansion | **Community Lead (02c):** "Provision a new Slack hub for a Tier 1 account." |
| `monitor_intent` | Listening | **Community Lead (02c):** "Flag messages mentioning 'competitor' or 'help'." |

## 3. Required Bot Scopes
Ensure your Slack App has the following scopes granted:
- `chat:write`: For all internal and community messaging.
- `channels:read` & `groups:read`: For channel auditing.
- `channels:manage` & `groups:manage`: For channel creation.
- `channels:history`: For monitoring intent in public channels.

## 4. Configuration
Token location: [`.env.local`](file:///Users/abdulfatiraziz/Synpase/Synpase%20Agentic%20GTM%20System/synapse-app/.env.local)
```bash
SLACK_BOT_TOKEN="xoxb-your-token-here"
```

## 5. Verification
- **Test Internal Alerts:** `npx tsx src/scripts/test_slack_alerts.ts`
- **Test Community Mission:** `npx tsx src/scripts/mission_slack_community.ts`
