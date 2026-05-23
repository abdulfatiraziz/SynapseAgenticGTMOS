-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 006: Create Custom Playbooks Table
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.playbooks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
  connections JSONB NOT NULL DEFAULT '[]'::jsonb,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;

-- Define Policies
CREATE POLICY "service_role_all_playbooks" ON public.playbooks
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "anon_read_playbooks" ON public.playbooks
  FOR SELECT USING (true);
