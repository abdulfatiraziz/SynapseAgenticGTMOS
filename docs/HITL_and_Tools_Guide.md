# HITL & Tool Configuration Guide

> **For Everyone** — Whether you're a founder, a RevOps manager, or a developer, this guide walks you through exactly how to control what the Synapse agents can do autonomously and when they must ask for your permission first.

---

## Part 1 — For Non-Technical Users

### What Is HITL (Human-in-the-Loop)?

When you connect Synapse to your real tools (HubSpot, email, Slack, etc.), agents can take real actions — like sending emails, creating deals, or publishing posts. That's powerful. But it's also risky if an agent makes a mistake.

**HITL is your safety net.**

When HITL is turned on, an agent will:
1. Decide it wants to take an action (e.g., "send this prospect an email")
2. **Stop** — and send you a Slack message first
3. Wait for your **Approve ✅** or **Deny ❌**
4. Only then take the action — or cancel it

Think of it like a payment authorization on your credit card. The purchase only goes through after you confirm.

---

### What Does It Look Like in Slack?

When an agent wants to do something that needs approval, you'll get a message like this in your `#hitl-approvals` Slack channel:

```
⚠️ Human Approval Required

Agent:   SDR Manager (03a)
Tool:    HubSpot
Action:  create_deal
Session: sess_1779012198205_refar

Details: Creating a deal for TechNova Inc ($22K ARR, 
         Stage: Discovery) based on PLG signal from 
         account acc_plg_001.

Expires at 3:45 PM (30 min)

[ ✅ Approve ]    [ ❌ Deny ]
```

Click **Approve** and the agent creates the deal. Click **Deny** and nothing happens — the agent logs the block and moves on.

---

### Which Actions Need Approval?

By default (when HITL is on), the following actions are gated:

| Action | What It Does |
|---|---|
| `send_email` | Sends an outbound email to a prospect |
| `create_deal` | Creates a deal record in HubSpot/Salesforce |
| `publish_post` | Posts to LinkedIn, Instagram, or your blog |
| `send_message` | Sends a Slack message to someone outside the system |
| `create_campaign` | Creates or launches a paid ad campaign |

> **Everything else runs automatically** — research, scoring, internal logging, reporting — no approval needed.

---

### How to Turn HITL On or Off

Find this section in `synapse.config.ts`:

```typescript
hitl: {
  enabled: false,  // ← Change to true to turn HITL on
  slack_channel_id: 'C0123456789',  // ← Your Slack channel ID (see below)
  timeout_minutes: 30,
}
```

**Change `false` to `true`** — that's it. Save the file and restart the app.

---

### How to Find Your Slack Channel ID

1. Open Slack
2. Right-click on your `#hitl-approvals` channel (create it if it doesn't exist)
3. Click **Copy link**
4. The link looks like: `https://yourworkspace.slack.com/archives/C0123456789`
5. The `C0123456789` part is your Channel ID — paste that into the config

---

### What Happens If Nobody Approves in Time?

By default, requests **expire after 30 minutes** and are automatically **denied** (safe default — nothing happens).

You can change this:
```typescript
hitl: {
  timeout_minutes: 60,              // Wait longer
  auto_approve_on_timeout: false,   // false = deny, true = approve on timeout
}
```

> 🔒 **Recommendation:** Keep `auto_approve_on_timeout: false`. Auto-approving timed-out actions is risky.

---

## Part 2 — For Technical Users

### The Full HITL Flow (Architecture)

```
Agent.useTool('HubSpot', { action: 'create_deal', ... })
  │
  ▼
ToolGateway.executeTool()
  │
  ├─ isHitlGated('create_deal')? → YES (in SynapseConfig.hitl.gates)
  │
  ▼
HitlGateway.requestApproval({
  agentId, sessionId, toolName: 'HubSpot', action: 'create_deal',
  paramsSummary: '...'           ← PII-scrubbed summary
})
  │
  ├─ Writes row to: hitl_approvals (Supabase)
  ├─ Sends: Slack block message with approve/deny button URLs
  │
  ▼
Polling loop (every 3s, up to timeout_minutes)
  │
  ├─ User clicks Approve → GET /api/hitl/approve?id=xxx&decision=approved
  │   → HitlGateway.recordDecision() → updates hitl_approvals.status
  │   → Poll detects 'approved' → returns { decision: 'approved' }
  │   → ToolGateway proceeds with the real API call
  │
  └─ User clicks Deny → status='denied' → HitlDeniedError thrown
      → TraceLogger logs 'tool_denied' event to agent_traces
```

---

### Customizing HITL Gates

Add or remove any `action` string from the gates array:

```typescript
hitl: {
  enabled: true,
  gates: [
    'send_email',          // Any tool call with action containing 'send_email'
    'create_deal',
    'publish_post',
    'send_message',
    'create_campaign',
    // Add your own:
    'delete_contact',      // Destructive action — always gate this
    'update_pricing',      // High-stakes CRM field
    'book_meeting',        // External calendar invite
  ],
}
```

> Gate matching is **case-insensitive substring** — `'send_email'` matches `SEND_EMAIL`, `send_email_campaign`, etc.

---

### Bypassing HITL for Specific Environments

In your `.env.local` or `.env.test`:
```bash
# This env var makes HitlGateway auto-approve everything in test environments
HITL_BYPASS=true
```

Or in code during tests:
```typescript
// In test setup
process.env.HITL_BYPASS = 'true';
```

> Never set `HITL_BYPASS=true` in production.

---

## Part 3 — Tool Configuration (Mock → Live)

### 🧠 Core Architecture Setup (Vertex AI & GCP)

Synapse is built strictly adhering to the **Google/Kaggle Agent Engineering Guidelines**. As an enterprise-grade Multi-Agent System, it requires a secure AI backend. 

Instead of consumer API keys, Synapse uses the official **Google Gen AI SDK (Agent Development Kit)** pointing to your Google Cloud Platform (GCP) tenant. This ensures zero data training, enterprise scaling, and IAM security.

**How to set up the core AI layer:**
1. Create a project on [Google Cloud Console](https://console.cloud.google.com).
2. Enable the **Vertex AI API**.
3. Create a Service Account and download the JSON key.
4. Set the environment variables in `.env.local`:
   ```bash
   GCP_PROJECT_ID=your-gcp-project-id
   GCP_LOCATION=us-central1
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account.json
   ```
*(Note: If you run locally with `gcloud auth application-default login`, the JSON key is not strictly required).*

---

### The Mental Model

```
default_mode: 'mock'
     │
     │  All tools → return realistic fixture data
     │  No API keys needed, no real actions taken
     │
     ▼
Flip one tool to 'live'
     │
     │  That tool → hits the real API (needs API key in .env.local)
     │  All other tools → still mock
     │
     ▼
default_mode: 'live'
     │
     │  All tools → hit real APIs
     │  Only use this in production with HITL enabled
```

---

### Connecting Tools: Step-by-Step Checklist

Follow this order. Each step is independent — you can stop at any point.

#### ✅ Step 1 — Slack (do this first — needed for HITL)

1. Go to [api.slack.com/apps](https://api.slack.com/apps) → Create New App
2. Add these OAuth scopes: `chat:write`, `channels:read`
3. Install to workspace → copy **Bot User OAuth Token**
4. In `.env.local`:
   ```
   SLACK_BOT_TOKEN=xoxb-your-token-here
   ```
5. In `synapse.config.ts`:
   ```typescript
   tools: { overrides: { 'Slack': 'live' } }
   hitl: { enabled: true, slack_channel_id: 'C...' }
   ```
6. Test: run the app and trigger a HITL gate — you should get a Slack message

---

#### ✅ Step 2 — HubSpot

1. In HubSpot: Settings → Integrations → Private Apps → Create
2. Scopes needed: `crm.objects.contacts.read`, `crm.objects.contacts.write`, `crm.objects.deals.write`
3. Copy the **Private App Token**
4. In `.env.local`:
   ```
   HUBSPOT_API_KEY=pat-na1-your-token
   ```
5. In `synapse.config.ts`:
   ```typescript
   tools: { overrides: { 'HubSpot': 'live' } }
   ```
6. Full guide: `docs/tool_connection_guide/hubspot_connection.md`

---

#### ✅ Step 3 — Apollo (lead enrichment)

1. Go to [app.apollo.io](https://app.apollo.io) → Settings → API
2. Copy your API key
3. In `.env.local`:
   ```
   APOLLO_API_KEY=your-key
   ```
4. In `synapse.config.ts`:
   ```typescript
   tools: { overrides: { 'Apollo': 'live' } }
   ```
5. Full guide: `docs/tool_connection_guide/apollo_connection.md`

---

#### ✅ Step 4 — Google Workspace (Sheets, Docs, Drive)

1. Create a Service Account in Google Cloud Console
2. Download the JSON key file
3. Share your Google Drive folder with the service account email
4. In `.env.local`:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
   ```
5. In `synapse.config.ts`:
   ```typescript
   tools: { overrides: { 'Google': 'live' } }
   ```
6. Full guide: `docs/tool_connection_guide/google_connection.md`

---

#### ✅ Step 5 — Going Fully Live

Once all tools are connected and HITL is enabled:

```typescript
// synapse.config.ts
tools: {
  default_mode: 'live',   // ← All tools live
  overrides: {},           // ← No exceptions needed
},
hitl: {
  enabled: true,           // ← Required before going fully live
}
```

> **Rule:** Never set `default_mode: 'live'` without `hitl.enabled: true`

---

### Environment Variables Reference

| Variable | Required For | Where to Get It |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Everything | Supabase Project Settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Everything | Supabase Project Settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Traces, Memory, HITL | Supabase Project Settings |
| `GOOGLE_GENERATIVE_AI_API_KEY` | LLM (Gemini) | Google AI Studio |
| `GCP_PROJECT_ID` | Vertex AI | Google Cloud Console |
| `GCP_LOCATION` | Vertex AI | e.g., `us-central1` |
| `SLACK_BOT_TOKEN` | Slack + HITL | Slack API Apps page |
| `HUBSPOT_API_KEY` | HubSpot live | HubSpot Private Apps |
| `APOLLO_API_KEY` | Apollo live | Apollo Settings |
| `CLAY_API_KEY` | Clay live | Clay Settings |
| `MAKE_API_KEY` | Make.com live | Make API Keys |
| `GOOGLE_APPLICATION_CREDENTIALS` | Google Workspace | GCP Service Account JSON |
| `NEXT_PUBLIC_APP_URL` | HITL webhooks | Your deployed URL |

Copy `.env.example` → `.env.local` and fill in what you need. Leave the rest blank — those tools will run in mock mode.

---

## Quick Reference Card

```
SITUATION                          → WHAT TO SET
─────────────────────────────────────────────────────────
First time, just exploring         → default_mode: 'mock', hitl.enabled: false
Testing one real integration       → overrides: { 'HubSpot': 'live' }, hitl.enabled: true
Production (all tools live)        → default_mode: 'live', hitl.enabled: true
CI / automated tests               → default_mode: 'mock', hitl.enabled: false
Staging environment                → default_mode: 'live' (staging keys), hitl.enabled: true
```
