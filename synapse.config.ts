/**
 * synapse.config.ts — The Single Customization Entry Point
 * ──────────────────────────────────────────────────────────
 * This is THE file to edit when adopting this system for your company.
 *
 * Open-source users: copy this file, update the values, and the entire
 * 17-agent system will adapt to your business context, tools, and workflows.
 *
 * Everything in here is type-safe. TypeScript will catch typos at compile time.
 */

// ─── Type Definitions ─────────────────────────────────────────────────────────

export type ToolMode = 'live' | 'mock';

export interface CompanyConfig {
  name: string;
  website: string;
  /** One-paragraph ICP summary injected into every agent's context */
  icp_summary: string;
  /** Target buyer personas — used by SDR + Content agents */
  target_personas: string[];
  /** Your primary GTM motion */
  gtm_motion: 'plg' | 'slg' | 'hybrid';
  /** Industry vertical */
  vertical: string;
}

export interface AgentConfig {
  /**
   * Agent IDs to activate — inactive agents won't be reachable via A2A.
   * Registered Agents:
   * - Strategy Layer:
   *   '01'  : Chief Marketing Officer
   *   '01b' : VP Product Marketing
   *   '01c' : Pricing & Packaging Manager
   *   '01d' : Market Intelligence Analyst
   * - Motions Layer:
   *   '02a' : VP Sales
   *   '02b' : Head of PLG
   *   '02c' : Head of Community
   *   '02d' : VP Partnerships
   * - Channels Layer:
   *   '03a' : SDR Manager
   *   '03b' : Demand Generation Manager
   *   '03c' : Content & SEO Lead
   *   '03d' : Field & Events Manager
   *   '03e' : Head of Revenue Operations
   * - Customer Success Layer:
   *   '04a' : VP Customer Success
   *   '04b' : Customer Success Manager
   *   '04c' : Expansion Account Executive
   *   '04d' : Renewals Manager
   */
  active: string[];
  /** Per-agent system prompt overrides (merge with DB value) */
  prompt_overrides?: Record<string, string>;
}

export interface ToolsConfig {
  /**
   * Global default: 'mock' returns fixture data, no real API calls.
   * Set to 'live' when you've connected all integrations.
   */
  default_mode: ToolMode;
  /**
   * Per-tool overrides — takes priority over default_mode.
   * Use this to go live one tool at a time as you connect integrations.
   * Tool names must match gateway.ts registry keys exactly.
   */
  overrides: Partial<Record<string, ToolMode>>;
}

export interface HitlConfig {
  /**
   * Master switch for Human-in-the-Loop.
   * Default: false (off) — so new users can run the full system immediately.
   * Set to true when connecting live tools to prevent accidental data writes.
   */
  enabled: boolean;
  /**
   * Tool calls that require human approval before executing.
   * Only enforced when enabled = true.
   */
  gates: string[];
  /** Slack channel ID (not name) to send approval requests to */
  slack_channel_id: string;
  /** Minutes to wait for approval before auto-denying */
  timeout_minutes: number;
  /** If true, timed-out requests auto-approve instead of auto-deny */
  auto_approve_on_timeout: boolean;
}

export interface MemoryConfig {
  /** Enable long-term RAG memory for agents */
  enabled: boolean;
  /** Number of similar memories to retrieve per agent call */
  top_k: number;
  /** Minimum cosine similarity (0–1) to include a memory */
  min_similarity: number;
  /**
   * Which event types to auto-store as memories.
   * Reduce this list to lower Gemini embedding costs.
   */
  auto_store_events: Array<'think_end' | 'tool_end' | 'agent_decision'>;
  /** Number of memories to accumulate before triggering asynchronous compaction */
  compaction_threshold?: number;
}

export interface A2AConfig {
  /**
   * 'internal' = Next.js API routes (recommended, zero infra)
   * 'http'     = external agent URLs (for microservice architectures)
   */
  transport: 'internal' | 'http';
  /** Base URL for 'http' transport. Ignored for 'internal'. */
  base_url?: string;
  /** Retry attempts for failed A2A calls */
  max_retries: number;
  /** Initial backoff in ms (doubles on each retry) */
  retry_backoff_ms: number;
}

export interface BudgetsConfig {
  /** Maximum number of tokens an agent can consume per session/mission before throwing an error */
  max_tokens_per_session: number;
}

export interface CanaryConfig {
  /** Enables traffic splitting to canary versions */
  enabled: boolean;
  /**
   * Routing configuration: map agent ID to a new agent ID and traffic percentage
   * Example: { '03a': { v2_id: '03a_v2', traffic_percentage: 10 } }
   */
  routing: Record<string, { v2_id: string; traffic_percentage: number }>;
}

export interface SynapseConfiguration {
  company: CompanyConfig;
  agents: AgentConfig;
  tools: ToolsConfig;
  hitl: HitlConfig;
  memory: MemoryConfig;
  a2a: A2AConfig;
  budgets: BudgetsConfig;
  canary: CanaryConfig;
}

// ─── Default Configuration ────────────────────────────────────────────────────
// This is the Synapse GTM System default config.
// Fork this and replace with your company's details.

export const SynapseConfig: SynapseConfiguration = {
  "company": {
    "name": "Synapse",
    "website": "https://synapse.ai",
    "icp_summary": "\n      B2B SaaS companies, 50–500 employees, scaling go-to-market with lean teams.\n      They have a CRM (HubSpot or Salesforce) but their RevOps workflows are mostly\n      manual. They are evaluating AI automation after outgrowing spreadsheet-based\n      processes. Primary buying triggers: hiring a RevOps lead, Series A/B funding,\n      or a competitive threat displacing their current GTM stack.\n    ",
    "target_personas": [
      "VP of Sales",
      "Head of Revenue Operations",
      "Chief Marketing Officer",
      "Growth Lead",
      "Founder / CEO (early stage)"
    ],
    "gtm_motion": "hybrid",
    "vertical": "B2B SaaS"
  },
  "agents": {
    "active": [
      "01",
      "01b",
      "01c",
      "01d",
      "02a",
      "02b",
      "02c",
      "02d",
      "03a",
      "03b",
      "03c",
      "03d",
      "03e",
      "04a",
      "04b",
      "04c",
      "04d"
    ],
    "prompt_overrides": {}
  },
  "tools": {
    "default_mode": "mock",
    "overrides": {
      "HubSpot": "live",
      "Apollo": "live",
      "Slack": "live",
      "Notion": "live",
      "Clay": "live",
      "Make": "live",
      "GoogleAds": "live",
      "MetaAds": "live"
    }
  },
  "hitl": {
    "enabled": false,
    "gates": [
      "send_email",
      "create_deal",
      "publish_post",
      "send_message",
      "create_campaign"
    ],
    "slack_channel_id": "C0000000000",
    "timeout_minutes": 30,
    "auto_approve_on_timeout": false
  },
  "memory": {
    "enabled": true,
    "top_k": 5,
    "min_similarity": 0.75,
    "auto_store_events": [
      "think_end",
      "agent_decision"
    ],
    "compaction_threshold": 80
  },
  "a2a": {
    "transport": "internal",
    "max_retries": 3,
    "retry_backoff_ms": 500
  },
  "budgets": {
    "max_tokens_per_session": 15000
  },
  "canary": {
    "enabled": true,
    "routing": {}
  }
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

/** Returns the effective tool mode for a given tool name */
export function getToolMode(toolName: string): ToolMode {
  return SynapseConfig.tools.overrides[toolName] ?? SynapseConfig.tools.default_mode;
}

/** Returns true if this tool call should be HITL-gated */
export function isHitlGated(action: string): boolean {
  if (!SynapseConfig.hitl.enabled) return false;
  return SynapseConfig.hitl.gates.some(gate =>
    action.toLowerCase().includes(gate.toLowerCase())
  );
}

/** Returns true if the given agent ID is active */
export function isAgentActive(agentId: string): boolean {
  return SynapseConfig.agents.active.includes(agentId);
}
