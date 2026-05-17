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
