# Customizing Synapse for Your Company

> This guide is for teams adopting Synapse as an open-source foundation.
> You can have a fully working 17-agent GTM system running against **your** business context in under 30 minutes.

---

## The One File You Need to Edit

**`synapse.config.ts`** at the project root is the single entry point for all customization.
Everything else in the system reads from it.

```
synapse-app/
├── synapse.config.ts    ← Edit this first
├── src/data/knowledge_base/
│   ├── company_profile.md    ← Your company & product context
│   └── icp_personas.md       ← Your buyer personas
└── ...
```

---

## Step 1 — Set Your Company Context

Open `synapse.config.ts` and update the `company` block:

```typescript
company: {
  name: 'Acme Corp',
  website: 'https://acme.com',
  icp_summary: `
    Enterprise logistics companies, 500+ employees, operating across 3+ regions.
    Primary pain: manual shipment routing causing 15% margin leakage.
    Buying triggers: new VP of Operations hire, ISO certification requirement.
  `,
  target_personas: [
    'VP of Operations',
    'Head of Supply Chain',
    'Chief Logistics Officer',
  ],
  gtm_motion: 'slg',    // 'plg' | 'slg' | 'hybrid'
  vertical: 'Logistics',
},
```

Then update the two knowledge base files:
- `src/data/knowledge_base/company_profile.md` — your product, differentiators, pricing, case studies
- `src/data/knowledge_base/icp_personas.md` — your buyer personas in detail

Templates for both are included with `_template` suffix.

---

## Step 2 — Choose Which Agents to Activate

Not all 17 agents are relevant for every company. Comment out what you don't need:

```typescript
agents: {
  active: [
    '01',    // CMO Agent — always keep this
    '01d',   // Market Intel — keep for competitive monitoring
    '02b',   // PLG Agent — only if you have a product-led motion
    '03a',   // SDR Manager — only if you do outbound
    '03c',   // Content & SEO — keep for inbound
    // '02d',  // Field Events — comment out if no events program
    // '04a',  // Paid Media — comment out if no paid budget
  ],
}
```

---

## Step 3 — Connect Tools One at a Time

**Start in mock mode** — the system works out of the box without any API keys.

```typescript
tools: {
  default_mode: 'mock',   // ← All tools return realistic fixture data
  overrides: {},
}
```

**Go live one tool at a time** as you add API keys to `.env.local`:

```typescript
tools: {
  default_mode: 'mock',
  overrides: {
    'HubSpot': 'live',    // ← Only HubSpot hits the real API
    'Slack':   'live',    // ← Slack messages are real
  },
}
```

**Tool connection guides** are in `docs/tool_connection_guide/`:
| Tool | Guide |
|---|---|
| HubSpot | [hubspot_connection.md](./docs/tool_connection_guide/hubspot_connection.md) |
| Apollo | [apollo_connection.md](./docs/tool_connection_guide/apollo_connection.md) |
| Slack | [slack_connection.md](./docs/tool_connection_guide/slack_connection.md) |
| Clay | [clay_connection.md](./docs/tool_connection_guide/clay_connection.md) |
| Google Workspace | [google_connection.md](./docs/tool_connection_guide/google_connection.md) |
| Make.com | [make_connection.md](./docs/tool_connection_guide/make_connection.md) |
| Google Ads | [google_ads_connection.md](./docs/tool_connection_guide/google_ads_connection.md) |
| And 13 more... | `docs/tool_connection_guide/` |

---

## Step 4 — Enable HITL Before Going Live

Before switching any tool to `'live'` mode, enable Human-in-the-Loop so agents
can't take irreversible actions (send emails, create CRM records) without approval:

```typescript
hitl: {
  enabled: true,                     // ← Turn on
  gates: [
    'send_email',
    'create_deal',
    'publish_post',
    'send_message',
  ],
  slack_channel_id: 'C0123456789',   // ← Your #hitl-approvals channel ID
  timeout_minutes: 30,
  auto_approve_on_timeout: false,    // Safe default
},
```

When a gated tool is called, agents will:
1. Pause execution
2. Send a Slack message with **Approve / Deny** buttons
3. Resume or abort based on your decision

---

## Step 5 — Customize Agent System Prompts

Each agent's base system prompt lives in Supabase (`agents` table, `system_prompt` column).

For quick overrides without touching the DB:

```typescript
agents: {
  active: ['01', '01d', '03a'],
  prompt_overrides: {
    '01': `You are the CMO of Acme Corp, a B2B logistics automation company.
            Our positioning is "Autonomous Operations for Global Logistics."
            Always reference our core metric: 15% margin improvement in 90 days.`,
  },
},
```

---

## Step 6 — Customize the Golden Dataset

The evaluation suite (`src/lib/evaluation/goldenDataset.ts`) validates your agents
produce the right output structure. When you change your ICP or agent behavior,
update the golden cases to match your expectations:

```typescript
// src/lib/evaluation/goldenDataset.ts
{
  id: 'mi-001-acme',
  agentId: '01d',
  description: 'High-intent signal: logistics company hiring VP Operations',
  input: {
    company_name: 'FreightCo Global',
    industry: 'Logistics',
    employee_count: 800,
    source_type: 'job_posting',
    signal_details: 'Hiring VP of Operations and Director of Supply Chain Tech',
  },
  expected: {
    required_fields: ['intent_score', 'rationale', 'is_actionable'],
    value_constraints: [
      { field: 'intent_score', type: 'range', min: 70, max: 100 }, // Adjust for your ICP
    ],
    // ...
  },
}
```

Run the quality gate to verify:
```bash
npx dotenv-cli -e .env.local -- npx tsx src/scripts/run_eval_suite.ts
```

---

## Adding a New Agent

1. **Create the agent file** — copy any existing agent as a template:
   ```bash
   cp src/lib/agents/SdrManagerAgent.ts src/lib/agents/MyNewAgent.ts
   ```

2. **Update the class**:
   ```typescript
   export class MyNewAgent extends BaseAgent {
     constructor(sessionId?: string) {
       super('my_agent_id', sessionId); // ← Your unique agent ID
     }

     async myMethod(input: any) {
       const result = await this.think(prompt, schema); // ← Gets memory + tracing free
       await this.useTool('HubSpot', params);           // ← Gets HITL + config free
       return result;
     }
   }
   ```

3. **Register in `synapse.config.ts`**:
   ```typescript
   agents: { active: [..., 'my_agent_id'] }
   ```

4. **Register in the A2A endpoint** (`src/app/api/agents/[agentId]/run/route.ts`):
   ```typescript
   const AGENT_REGISTRY = {
     'my_agent_id': {
       importPath: '../../lib/agents/MyNewAgent',
       className: 'MyNewAgent',
       methods: ['myMethod'],
     },
   };
   ```

5. **Add golden test cases** in `goldenDataset.ts` for the new agent.

All Phase 1 observability (traces), Phase 2 quality gate, Phase 3 memory + HITL
are inherited automatically from `BaseAgent`.

---

## Running in Full Mock Mode (No API Keys)

```bash
# Install
npm install

# Copy and leave as-is (mock mode)
cp .env.example .env.local

# Run the quality gate to verify everything works
npx dotenv-cli -e .env.local -- npx tsx src/scripts/run_eval_suite.ts

# Start the dev server
npm run dev
```

The entire system will run with fixture data. Every agent `think()` and `useTool()` call
is traced to Supabase (requires Supabase keys in `.env.local`).

---

## Deploying to Production

### Recommended Stack
| Layer | Service | Why |
|---|---|---|
| App | Vercel | Zero-config Next.js, edge-ready |
| Database | Supabase | pgvector memory, auth, real-time |
| LLM | Google Vertex AI (Gemini 2.5) | Grounding, structured output |
| Observability | Supabase `agent_traces` | Real-time trace viewer |
| Quality Gate | GitHub Actions | Auto-runs on every PR |

### Checklist
- [ ] Run all 4 migrations in Supabase SQL editor
- [ ] Add all env vars to Vercel project settings
- [ ] Set `SynapseConfig.tools.default_mode = 'live'` (or per-tool overrides)
- [ ] Set `SynapseConfig.hitl.enabled = true` and configure Slack channel
- [ ] Push to GitHub → quality gate runs automatically
- [ ] Trigger first real mission from the dashboard or API

---

## Open-Source License

This project is licensed under the **Apache 2.0 License**.
You are free to use, modify, and distribute it commercially with attribution.

Attribution: Please keep the "Powered by Synapse" note in your deployment
or link to this repository in your documentation.

---

*Built with the Google Agent Engineering Guides as the quality benchmark.*
