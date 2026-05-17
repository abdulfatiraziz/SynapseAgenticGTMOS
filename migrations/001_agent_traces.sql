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
