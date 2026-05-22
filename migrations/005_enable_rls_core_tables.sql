-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 005: Enable Row-Level Security (RLS) on core tables
-- Tables: agents, leads, integrations, tasks, logs
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Enable RLS on all target tables
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- 2. Define Policies for "agents" table
CREATE POLICY "service_role_all_agents" ON public.agents
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "anon_read_agents" ON public.agents
  FOR SELECT USING (true);

-- 3. Define Policies for "leads" table
CREATE POLICY "service_role_all_leads" ON public.leads
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "anon_read_leads" ON public.leads
  FOR SELECT USING (true);

-- 4. Define Policies for "tasks" table
CREATE POLICY "service_role_all_tasks_core" ON public.tasks
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "anon_read_tasks_core" ON public.tasks
  FOR SELECT USING (true);

-- 5. Define Policies for "logs" table
CREATE POLICY "service_role_all_logs" ON public.logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "anon_read_logs" ON public.logs
  FOR SELECT USING (true);

-- 6. Define Policies for "integrations" table
-- Restrict all read/write/modify access exclusively to service_role (no anonymous read)
CREATE POLICY "service_role_all_integrations" ON public.integrations
  FOR ALL USING (auth.role() = 'service_role');
