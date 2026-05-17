-- Synapse Agentic GTM System - Unified Database Initialization

-- --------------------------------------------------------
-- File: supabase_setup.sql
-- --------------------------------------------------------
-- Supabase Schema for Synapse 17-Agent GTM System

-- 1. Agents Table: Tracks the status and configuration of your 17 specialized agents
DROP TABLE IF EXISTS logs;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS agents;

CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id TEXT UNIQUE NOT NULL, -- e.g., '01', '01b', '02a'
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    layer INTEGER NOT NULL, -- 1: Strategy, 2: Motions, 3: Channels, 4: CS & Expansion
    reports_to TEXT, -- references agent_id
    core_objective TEXT,
    system_prompt TEXT,
    knowledge_inputs TEXT[],
    tools_required TEXT[],
    kpis TEXT[],
    status TEXT DEFAULT 'idle', -- idle, thinking, acting, error
    last_action TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Leads Table: Your local CRM for tracking prospects
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    website TEXT,
    industry TEXT,
    tech_stack TEXT[],
    intent_score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'identified', -- identified, enriched, qualified, outreach_sent, demo_booked
    owner_agent_id UUID REFERENCES agents(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tasks Table: Manages the Agent-to-Agent (A2A) communication queue
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_agent_id UUID REFERENCES agents(id),
    receiver_agent_id UUID REFERENCES agents(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending', -- pending, in_progress, completed, failed
    priority TEXT DEFAULT 'medium',
    input_data JSONB DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    parent_task_id UUID REFERENCES tasks(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Logs Table: The "Medical Chart" (Agent Ops) for every decision
CREATE TABLE logs (
    id BIGSERIAL PRIMARY KEY,
    agent_id UUID REFERENCES agents(id),
    task_id UUID REFERENCES tasks(id),
    event_type TEXT NOT NULL, -- thought, action, observation, error
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Initial 17 Agents
INSERT INTO agents (agent_id, name, role, layer, reports_to, core_objective, system_prompt, tools_required, kpis) VALUES
('01', 'Chief Marketing Officer', 'CMO', 1, 'CEO', 'Own the unified GTM strategy. Ensure ICP, messaging, budget, and motion are locked.', 'You are the CMO agent of an enterprise B2B SaaS company. You define and maintain the overall GTM strategy. Reason from data before making recommendations.', ARRAY['Salesforce', 'Tableau', 'Notion', 'Klue', 'Gartner APIs'], ARRAY['Marketing-sourced pipeline', 'CAC', 'Brand SOV']),
('01b', 'VP Product Marketing', 'VP PMM', 1, '01', 'Own product positioning, competitive differentiation, and sales enablement content.', 'You are the VP Product Marketing agent. You translate product capabilities into buyer-facing narratives. Lead with pain, follow with proof.', ARRAY['Klue', 'Notion', 'Highspot', 'Gong', 'Figma', 'UserTesting'], ARRAY['Win rate vs named competitors', 'Sales cycle length reduction', 'Content utilization rate']),
('01c', 'Pricing & Packaging Manager', 'Pricing Manager', 1, '01', 'Design and maintain pricing tiers, packaging, and discount governance.', 'You are the Pricing & Packaging agent. You model LTV, CAC, and payback periods. You are data-driven and skeptical of intuition-based pricing decisions.', ARRAY['ProfitWell', 'Excel', 'Typeform', 'Stripe', 'Tableau'], ARRAY['ARR per customer by tier', 'Expansion MRR', 'Blended discount rate']),
('01d', 'Market Intelligence Analyst', 'Market Intel', 1, '01b', 'Research and maintain the ICP definition, TAM models, competitive landscape, and intent signals.', 'You are the Market Intelligence agent. You continuously monitor the market. Always cite your source and flag confidence levels.', ARRAY['Apollo.io', 'Bombora', 'G2', 'LinkedIn Sales Navigator', 'Crayon'], ARRAY['ICP match rate', 'Competitive win rate trend', 'Intent signal to opportunity conversion']),

('02a', 'VP Sales', 'VP Sales (SLG)', 2, 'CRO', 'Own the enterprise Sales-Led Growth motion. Drive pipeline coverage and quota attainment.', 'You are the VP Sales agent. You lead the SLG motion. You think in pipeline math: coverage ratios, conversion rates, and ACV.', ARRAY['Salesforce', 'Gong', 'Outreach', 'Clari', 'Highspot'], ARRAY['Quota attainment', 'Pipeline coverage ratio', 'Win rate']),
('02b', 'Head of PLG', 'Head of PLG', 2, '01', 'Own the product-led acquisition and expansion engine.', 'You are the Head of PLG agent. You own the product as a distribution channel. You think in funnels and experiments.', ARRAY['Amplitude', 'Pendo', 'Appcues', 'Segment', 'LaunchDarkly'], ARRAY['Activation rate', 'PQL to SQL conversion', 'Product-sourced revenue']),
('02c', 'Head of Community', 'Community Lead', 2, '01', 'Build the brand community as a revenue channel.', 'You are the Head of Community agent. You measure community as a revenue motion. Every activity should be tied to pipeline influence.', ARRAY['Circle.so', 'Slack', 'Influitive', 'Zapier', 'Tribe'], ARRAY['Community DAU/MAU', 'Community-sourced pipeline', 'Referral conversion rate']),
('02d', 'VP Partnerships', 'VP Partnerships', 2, 'CRO', 'Build and manage the partner ecosystem. Drive partner-sourced revenue.', 'You are the VP Partnerships agent. You own the partner-led GTM motion. Use Crossbeam for account mapping before any co-sell motion.', ARRAY['PartnerStack', 'Crossbeam', 'Salesforce', 'Impartner', 'Slack'], ARRAY['Partner-sourced revenue %', 'Partner attach rate', 'Partner NPS']),

('03a', 'SDR Manager', 'SDR Manager', 3, '02a', 'Own the outbound pipeline engine. Drive SQL generation.', 'You are the SDR Manager agent. You oversee a team of SDR agents. You think in conversion rates from open to meeting booked.', ARRAY['Outreach', 'Apollo.io', 'LinkedIn Sales Navigator', 'Gong', 'Salesforce', 'Clay'], ARRAY['SQLs per SDR', 'Meeting booked rate', 'Pipeline generated']),
('03b', 'Demand Generation Manager', 'Demand Gen', 3, '01', 'Own the inbound and paid acquisition funnel.', 'You are the Demand Gen agent. You generate MQLs at the right cost. Optimize for Cost per Opportunity.', ARRAY['HubSpot', '6sense', 'Google Ads', 'LinkedIn Campaign Manager', 'Triple Whale'], ARRAY['MQL volume', 'Cost per Opportunity', 'ROAS by channel']),
('03c', 'Content & SEO Lead', 'Content & SEO', 3, '01', 'Own organic search strategy and editorial content.', 'You are the Content & SEO Lead agent. You think in keyword clusters and buyer journey stages. Map content to ICP intent.', ARRAY['Ahrefs', 'Clearscope', 'Webflow', 'Contentful', 'Beehiiv'], ARRAY['Organic traffic growth', 'Keyword ranking', 'Organic-sourced MQLs']),
('03d', 'Field & Events Manager', 'Events Manager', 3, '01', 'Plan and execute field events, webinars, and conferences.', 'You are the Events Manager agent. Every event decision should be evaluated on pipeline ROI.', ARRAY['Splash', 'Goldcast', 'Cvent', 'Salesforce', 'Bizzabo'], ARRAY['Event-sourced pipeline', 'Cost per opportunity from events']),
('03e', 'Head of Revenue Operations', 'RevOps', 3, 'CRO', 'Own the GTM nervous system: CRM, lead routing, tech stack, and forecasting.', 'You are the RevOps agent. You are the operational backbone. You are the final authority on pipeline attribution.', ARRAY['Salesforce', 'Clay', 'LeanData', 'Clari', 'Zapier', 'Tableau'], ARRAY['CRM data accuracy', 'Lead routing speed', 'Forecast accuracy']),

('04a', 'VP Customer Success', 'VP CS', 4, 'CRO', 'Own NRR across all customer tiers. Define health score model.', 'You are the VP CS agent. Your north-star metric is NRR at 110%+. You manage CSM agents and run QBRs for strategic accounts.', ARRAY['Gainsight', 'Salesforce', 'Zendesk', 'Looker', 'Gong'], ARRAY['NRR', 'GRR', 'Churn rate']),
('04b', 'Customer Success Manager', 'CSM', 4, '04a', 'Own a book of 20-50 accounts. Drive onboarding and adoption.', 'You are a CSM agent. You ensure every customer reaches value. Flag expansion signals immediately.', ARRAY['Gainsight', 'Intercom', 'Loom', 'Notion', 'Salesforce'], ARRAY['Renewal rate', 'Customer health score', 'Time-to-value']),
('04c', 'Expansion Account Executive', 'Expansion AE', 4, '02a', 'Own the expansion pipeline across the existing customer base.', 'You are the Expansion AE agent. You partner with CSMs to identify growth signals. Open commercial conversations based on usage data.', ARRAY['Salesforce', 'Gong', 'Clari', 'Gainsight', 'DocuSign'], ARRAY['Expansion ARR booked', 'Upsell win rate', 'Average expansion deal size']),
('04d', 'Renewals Manager', 'Renewals Manager', 4, '04a', 'Own the renewal pipeline 90-180 days out. Defend NRR.', 'You are the Renewals Manager agent. You ensure accounts renew on time. Pull health scores and churn predictions daily.', ARRAY['ChurnZero', 'Gainsight', 'Salesforce', 'Clari', 'DocuSign'], ARRAY['Gross logo renewal rate', 'On-time renewal rate', 'Churn prevention save rate']);

-- 6. Integrations Table: Stores tokens and config for tools like HubSpot, Apollo, etc.
CREATE TABLE integrations (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- --------------------------------------------------------
-- File: migrations/001_agent_traces.sql
-- --------------------------------------------------------
-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: agent_traces table
-- Implements the "Logs" pillar from the Google Agent Quality guide.
-- Stores a structured trace event for every think() and useTool() call
-- made by any of the 17 Synapse agents.
-- Run this once in your Supabase SQL editor.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.agent_traces (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Linking identifiers
  trace_id      TEXT NOT NULL,          -- Unique ID per event (trc_xxx)
  session_id    TEXT NOT NULL,          -- Groups all events in one agent run (sess_xxx)
  agent_id      TEXT NOT NULL,          -- e.g. '01', '03a'

  -- Event classification
  event_type    TEXT NOT NULL CHECK (event_type IN (
                  'think_start', 'think_end', 'think_error',
                  'tool_start', 'tool_end', 'tool_denied', 'tool_error',
                  'session_start', 'session_end', 'security_block'
                )),

  -- Optional tool context
  tool_name     TEXT,                   -- e.g. 'HubSpot', 'Apollo', 'Slack'

  -- Summarized I/O (never raw PII — emails/phones are masked in TraceLogger)
  input_summary  TEXT,
  output_summary TEXT,

  -- Performance telemetry
  duration_ms   INTEGER,               -- Wall-clock ms for the operation
  token_count   INTEGER,               -- Estimated tokens consumed

  -- Outcome
  status        TEXT NOT NULL CHECK (status IN ('success', 'error', 'blocked')),
  error_message TEXT,

  -- Free-form JSON for extra context
  metadata      JSONB,

  timestamp     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- FK back to the agents registry (loose — agent_id is a short code not UUID)
  -- Index for the most common query patterns
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for the three most common query patterns:
-- 1. "Show me all events in this session"
CREATE INDEX IF NOT EXISTS idx_agent_traces_session  ON public.agent_traces (session_id);
-- 2. "Show me all events for this agent"
CREATE INDEX IF NOT EXISTS idx_agent_traces_agent    ON public.agent_traces (agent_id);
-- 3. "Show me all errors in the last 24h"
CREATE INDEX IF NOT EXISTS idx_agent_traces_status   ON public.agent_traces (status, timestamp DESC);
-- 4. "Show me all tool calls for a given tool"
CREATE INDEX IF NOT EXISTS idx_agent_traces_tool     ON public.agent_traces (tool_name, timestamp DESC);

-- RLS: Only service-role key can write; anon key can read for the dashboard
ALTER TABLE public.agent_traces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON public.agent_traces
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "anon_read" ON public.agent_traces
  FOR SELECT USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Convenience view: agent_metrics
-- Pre-aggregates the stats most useful for the dashboard
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW public.agent_metrics AS
SELECT
  agent_id,
  tool_name,
  COUNT(*)                                               AS total_calls,
  COUNT(*) FILTER (WHERE status = 'success')             AS success_count,
  COUNT(*) FILTER (WHERE status = 'error')               AS error_count,
  COUNT(*) FILTER (WHERE status = 'blocked')             AS blocked_count,
  ROUND(AVG(duration_ms))                                AS avg_duration_ms,
  MAX(duration_ms)                                       AS max_duration_ms,
  SUM(token_count)                                       AS total_tokens,
  MAX(timestamp)                                         AS last_seen
FROM public.agent_traces
WHERE event_type IN ('tool_end', 'tool_error', 'think_end', 'think_error')
GROUP BY agent_id, tool_name
ORDER BY agent_id, total_calls DESC;


-- --------------------------------------------------------
-- File: migrations/002_eval_results.sql
-- --------------------------------------------------------
-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 002: eval_results table
-- Stores quality gate results from every CriticAgent run.
-- Run this in your Supabase SQL editor after 001_agent_traces.sql.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.eval_results (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Run grouping
  run_id        TEXT NOT NULL,          -- Groups all cases in one eval run

  -- Case identity
  case_id       TEXT NOT NULL,          -- e.g. 'mi-001', 'plg-003'
  agent_id      TEXT NOT NULL,          -- e.g. '01d', '02b'
  agent_name    TEXT NOT NULL,

  -- Eval mode
  mode          TEXT NOT NULL CHECK (mode IN ('structural', 'llm_judge')),

  -- Scores
  passed        BOOLEAN NOT NULL,
  overall_score INTEGER NOT NULL,
  pass_threshold INTEGER NOT NULL,

  -- Detail
  verdict       TEXT,
  dimensions    JSONB,                  -- Array of DimensionScore objects

  evaluated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for dashboard queries
CREATE INDEX IF NOT EXISTS idx_eval_run    ON public.eval_results (run_id);
CREATE INDEX IF NOT EXISTS idx_eval_agent  ON public.eval_results (agent_id, evaluated_at DESC);
CREATE INDEX IF NOT EXISTS idx_eval_passed ON public.eval_results (passed, evaluated_at DESC);
CREATE INDEX IF NOT EXISTS idx_eval_case   ON public.eval_results (case_id, evaluated_at DESC);

-- RLS
ALTER TABLE public.eval_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_eval" ON public.eval_results
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "anon_read_eval" ON public.eval_results
  FOR SELECT USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- View: eval_trends
-- Shows quality score trends per agent over time (for dashboard charts)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW public.eval_trends AS
SELECT
  agent_id,
  agent_name,
  run_id,
  COUNT(*)                                              AS total_cases,
  COUNT(*) FILTER (WHERE passed = true)                 AS passed_cases,
  ROUND(AVG(overall_score))                             AS avg_score,
  MIN(overall_score)                                    AS min_score,
  ROUND(100.0 * COUNT(*) FILTER (WHERE passed = true)
        / NULLIF(COUNT(*), 0))                          AS pass_rate_pct,
  MAX(evaluated_at)                                     AS run_at
FROM public.eval_results
GROUP BY agent_id, agent_name, run_id
ORDER BY run_at DESC, agent_id;


-- --------------------------------------------------------
-- File: migrations/003_004_memory_and_tasks.sql
-- --------------------------------------------------------
-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 003: agent_memory table (pgvector RAG)
-- Run AFTER 001 and 002.
-- Requires the pgvector extension — enabled by default on Supabase.
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable pgvector (idempotent)
CREATE EXTENSION IF NOT EXISTS vector;

-- ── Memory table ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.agent_memory (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Scoping
  agent_id      TEXT NOT NULL,          -- Which agent stored this memory
  session_id    TEXT,                   -- Optional: links to a specific session

  -- Classification
  memory_type   TEXT NOT NULL CHECK (memory_type IN (
                  'lead_signal',        -- A lead or account signal observed
                  'agent_decision',     -- A decision the agent made
                  'icp_learning',       -- ICP refinement observation
                  'tool_result',        -- Interesting result from a tool call
                  'market_intel',       -- Market or competitor intelligence
                  'conversation'        -- Free-form conversation memory
                )),

  -- Content
  content       TEXT NOT NULL,          -- Raw text to store and embed
  embedding     vector(768),            -- Gemini text-embedding-004 (768-dim)

  -- Structured context
  metadata      JSONB,                  -- company_name, score, source, tags, etc.

  -- Lifecycle
  expires_at    TIMESTAMPTZ,            -- Optional TTL (NULL = never expires)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Vector similarity index ───────────────────────────────────────────────────
-- IVFFlat: fast approximate nearest-neighbour search
-- lists = 100 works well up to ~1M rows; increase for larger datasets
CREATE INDEX IF NOT EXISTS idx_memory_embedding
  ON public.agent_memory
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Standard indexes for metadata filtering
CREATE INDEX IF NOT EXISTS idx_memory_agent    ON public.agent_memory (agent_id);
CREATE INDEX IF NOT EXISTS idx_memory_type     ON public.agent_memory (memory_type);
CREATE INDEX IF NOT EXISTS idx_memory_session  ON public.agent_memory (session_id);
CREATE INDEX IF NOT EXISTS idx_memory_created  ON public.agent_memory (created_at DESC);

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE public.agent_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_memory" ON public.agent_memory
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "anon_read_memory" ON public.agent_memory
  FOR SELECT USING (true);

-- ── Similarity search function ────────────────────────────────────────────────
-- Called by MemoryManager.recall() — returns top-K most similar memories.
-- Usage: SELECT * FROM match_memories('[0.1, 0.2, ...]'::vector, 5, 0.75, 'TEST-01');

CREATE OR REPLACE FUNCTION public.match_memories(
  query_embedding  vector(768),
  match_count      INT    DEFAULT 5,
  match_threshold  FLOAT  DEFAULT 0.75,
  filter_agent_id  TEXT   DEFAULT NULL
)
RETURNS TABLE (
  id           UUID,
  agent_id     TEXT,
  memory_type  TEXT,
  content      TEXT,
  metadata     JSONB,
  similarity   FLOAT,
  created_at   TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.agent_id,
    m.memory_type,
    m.content,
    m.metadata,
    1 - (m.embedding <=> query_embedding) AS similarity,
    m.created_at
  FROM public.agent_memory m
  WHERE
    m.embedding IS NOT NULL
    AND (filter_agent_id IS NULL OR m.agent_id = filter_agent_id)
    AND (m.expires_at IS NULL OR m.expires_at > NOW())
    AND 1 - (m.embedding <=> query_embedding) >= match_threshold
  ORDER BY m.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 004: agent_tasks table (A2A task queue)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.agent_tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Routing
  session_id      TEXT NOT NULL,         -- Cross-agent session correlation
  from_agent_id   TEXT NOT NULL,         -- Sender agent short code
  to_agent_id     TEXT NOT NULL,         -- Receiver agent short code

  -- Task definition
  task_type       TEXT NOT NULL,         -- e.g. 'processAssignedAccount'
  title           TEXT NOT NULL,
  description     TEXT,
  priority        TEXT NOT NULL DEFAULT 'medium'
                  CHECK (priority IN ('high', 'medium', 'low')),
  input_data      JSONB,                 -- Data payload for the receiving agent

  -- Status lifecycle
  status          TEXT NOT NULL DEFAULT 'queued'
                  CHECK (status IN (
                    'queued',        -- Waiting to be picked up
                    'running',       -- Agent is actively executing
                    'done',          -- Completed successfully
                    'failed',        -- Execution error
                    'hitl_pending',  -- Waiting for human approval
                    'hitl_denied'    -- Human rejected the action
                  )),

  -- Output
  output_data     JSONB,                 -- Result from the receiving agent
  error_message   TEXT,                  -- Set on 'failed' status

  -- Timing
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tasks_session     ON public.agent_tasks (session_id);
CREATE INDEX IF NOT EXISTS idx_tasks_receiver    ON public.agent_tasks (to_agent_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_status      ON public.agent_tasks (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_priority    ON public.agent_tasks (priority, created_at ASC);

-- RLS
ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_tasks" ON public.agent_tasks
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "anon_read_tasks" ON public.agent_tasks
  FOR SELECT USING (true);

-- ── HITL approvals table ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.hitl_approvals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Linking
  task_id         UUID REFERENCES public.agent_tasks(id),
  agent_id        TEXT NOT NULL,
  session_id      TEXT NOT NULL,

  -- What needs approval
  tool_name       TEXT NOT NULL,
  action          TEXT NOT NULL,
  params_summary  TEXT,                  -- Sanitized summary (no PII)

  -- Decision
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'approved', 'denied', 'timed_out')),
  decided_by      TEXT,                  -- Slack user ID who approved/denied
  decision_note   TEXT,                  -- Optional reason

  -- Timing
  requested_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  decided_at      TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ NOT NULL   -- When the approval times out
);

CREATE INDEX IF NOT EXISTS idx_hitl_status    ON public.hitl_approvals (status, requested_at);
CREATE INDEX IF NOT EXISTS idx_hitl_agent     ON public.hitl_approvals (agent_id, status);

ALTER TABLE public.hitl_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_hitl" ON public.hitl_approvals
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "anon_read_hitl" ON public.hitl_approvals
  FOR SELECT USING (true);


