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
