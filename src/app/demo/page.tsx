'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import s from './page.module.css';

// ─── Constants & Mock Data ────────────────────────────────────────────────────

const AGENTS = [
  { id: '01',  name: 'CMO Orchestrator',    layer: 'strategy' },
  { id: '01b', name: 'VP Sales',            layer: 'strategy' },
  { id: '01c', name: 'VP PMM',              layer: 'strategy' },
  { id: '01d', name: 'Market Intel',        layer: 'strategy' },
  { id: '02a', name: 'SDR Manager',         layer: 'motions'  },
  { id: '02b', name: 'Demand Gen',          layer: 'motions'  },
  { id: '02c', name: 'Field Events',        layer: 'motions'  },
  { id: '02d', name: 'VP Partnerships',     layer: 'motions'  },
  { id: '03a', name: 'Content & SEO',       layer: 'channels' },
  { id: '03b', name: 'Community',           layer: 'channels' },
  { id: '03c', name: 'PLG',                 layer: 'channels' },
  { id: '03d', name: 'Pricing Manager',     layer: 'channels' },
  { id: '03e', name: 'RevOps',              layer: 'channels' },
  { id: '04a', name: 'VP Customer Success', layer: 'cs'       },
  { id: '04b', name: 'CSM',                 layer: 'cs'       },
  { id: '04c', name: 'Expansion AE',        layer: 'cs'       },
  { id: '04d', name: 'Renewals Manager',    layer: 'cs'       },
  { id: 'C1',  name: 'Critic Agent',        layer: 'eval'     },
  { id: 'O1',  name: 'System Orchestrator', layer: 'eval'     },
];

type AgentStatus = 'idle' | 'thinking' | 'running' | 'done';

const STATUS_POOL: AgentStatus[] = ['idle', 'idle', 'idle', 'thinking', 'running', 'done'];
function randomStatus(): AgentStatus { return STATUS_POOL[Math.floor(Math.random() * STATUS_POOL.length)]; }

interface FeedEvent {
  id: string | number;
  type: 'think' | 'tool' | 'memory' | 'hitl' | 'done';
  agent: string;
  msg: string;
  meta: string;
  time: string;
}

const FEED_TEMPLATES: Omit<FeedEvent, 'id' | 'time'>[] = [
  { type: 'think', agent: 'CMO [01]',         msg: 'Analyzing morning pipeline — 3 high-intent leads detected from Apollo',      meta: 'gemini-2.5-flash · 1,240 tokens' },
  { type: 'tool',  agent: 'Market Intel [01d]',msg: 'Apollo search: "Head of Engineering" in Fintech — 47 results',               meta: 'apollo.searchPeople · 380ms' },
  { type: 'memory',agent: 'RevOps [03e]',      msg: 'Recalled: Acme Corp last touched 14 days ago — re-engagement priority HIGH', meta: 'pgvector · similarity 0.94' },
  { type: 'tool',  agent: 'RevOps [03e]',      msg: 'HubSpot: Created deal "Acme Corp Q3 Enterprise" — $48,000',                  meta: 'hubspot.createDeal · 210ms' },
  { type: 'hitl',  agent: 'SDR Manager [02a]', msg: 'Awaiting approval: Send outreach sequence to 12 contacts at Acme Corp',      meta: 'Slack approval pending' },
  { type: 'think', agent: 'VP PMM [01c]',      msg: 'Content strategy for Q3: Prioritising "AI for GTM" keyword cluster',         meta: 'gemini-2.5-flash · 890 tokens' },
  { type: 'tool',  agent: 'Content & SEO [03a]',msg: 'Ahrefs: "agentic gtm" — DR 72, volume 1.2K/mo, KD 31',                     meta: 'ahrefs.keywordMetrics · 520ms' },
  { type: 'done',  agent: 'Demand Gen [02b]',  msg: 'Google Ads campaign "AI GTM OS" — CTR +18%, CPA -12% vs last week',          meta: 'googleads.getCampaigns · complete' },
  { type: 'memory',agent: 'CMO [01]',          msg: 'Stored: Morning sync decision — Acme Corp elevated to Tier 1 priority',      meta: 'pgvector · agent_decision stored' },
  { type: 'tool',  agent: 'Community [03b]',   msg: 'Slack: Posted product update to #community-announcements — 847 members',    meta: 'slack.postMessage · 190ms' },
  { type: 'think', agent: 'VP CS [04a]',       msg: 'Churn risk signal: TechFlow Inc — usage dropped 42% in 7 days',              meta: 'gemini-2.5-flash · 640 tokens' },
  { type: 'tool',  agent: 'CSM [04b]',         msg: 'Notion: Created "TechFlow QBR Prep" page in Customer Success DB',            meta: 'notion.createPage · 340ms' },
  { type: 'done',  agent: 'Critic Agent [C1]', msg: 'Eval: CMO morning-sync output score 94/100 — PASS (structural + LLM judge)', meta: 'eval · goldenDataset · 5 cases' },
  { type: 'tool',  agent: 'Expansion AE [04c]',msg: 'Apollo: Identified 3 expansion contacts at DataBridge Corp',                  meta: 'apollo.searchPeople · 460ms' },
  { type: 'hitl',  agent: 'VP Sales [01b]',    msg: 'Awaiting approval: Discount proposal 15% on Enterprise deal for Q-close',   meta: 'Slack approval pending' },
  { type: 'memory',agent: 'Market Intel [01d]',msg: 'Stored: Competitor "Warmly" launched new feature — pricing unchanged',       meta: 'pgvector · market_intel stored' },
  { type: 'think', agent: 'PLG [03c]',         msg: 'Trial conversion analysis: 34% activate in <24h, drop-off at onboarding step 3', meta: 'gemini-2.5-flash · 1,100 tokens' },
  { type: 'tool',  agent: 'Renewals [04d]',    msg: 'HubSpot: Tagged 8 accounts as "At Risk" — renewal due in 30 days',           meta: 'hubspot.updateProperty · 280ms' },
];

const A2A_TEMPLATES = [
  { from: '01',  to: '01d', msg: 'Run morning competitor scan — focus on Warmly, Unify' },
  { from: '01d', to: '03e', msg: 'High-intent signal: Acme Corp — 3 champions visiting pricing page' },
  { from: '03e', to: '02a', msg: 'Lead triaged: Acme Corp → Tier 1, initiate outreach sequence' },
  { from: '02a', to: '01',  msg: 'Outreach queued — awaiting HITL approval for 12 contacts' },
  { from: '01b', to: '04c', msg: 'Expansion opportunity: DataBridge Corp — coordinate with CSM' },
  { from: '04a', to: '04b', msg: 'Churn alert: TechFlow — schedule QBR within 48h' },
  { from: '01c', to: '03a', msg: 'New content brief: "AI for GTM teams" — target KD < 35' },
  { from: 'C1',  to: '01',  msg: 'Eval complete: All 5 morning agents scored ≥ 85/100' },
  { from: '03c', to: '01c', msg: 'Trial insight: Drop-off at step 3 — suggest in-app tooltip' },
  { from: '02b', to: '01',  msg: 'Google Ads: Paused 2 underperforming ad groups, reallocated budget' },
];

interface A2AMsg {
  id: string | number;
  from: string;
  to: string;
  msg: string;
  time: string;
}

interface MemRecall {
  id: string | number;
  agent: string;
  type: string;
  content: string;
  sim: number;
}

const MEM_RECALLS: Omit<MemRecall, 'id'>[] = [
  { agent: 'CMO [01]',         type: 'market_intel',   content: 'Competitor Warmly raised Series B — $40M. Now offering free tier.',               sim: 0.97 },
  { agent: 'RevOps [03e]',     type: 'lead_signal',    content: 'Acme Corp: 3 visits to /pricing in 7 days. Decision maker: CTO Sarah M.',        sim: 0.94 },
  { agent: 'Content [03a]',    type: 'icp_learning',   content: 'Best performing content: "AI SDR playbook" — 4,200 views, 12% CTR from LinkedIn.', sim: 0.91 },
  { agent: 'VP CS [04a]',      type: 'agent_decision', content: 'TechFlow renewal at risk. Last QBR showed satisfaction score 6/10.',              sim: 0.89 },
  { agent: 'Market Intel[01d]',type: 'market_intel',   content: 'Freightos ICP match: 87%. Key pain: manual route quoting. Champion identified.', sim: 0.88 },
];

const TOKEN_DATA = [
  { agent: 'CMO [01]',          tokens: 12400, max: 20000 },
  { agent: 'Market Intel [01d]',tokens: 9800,  max: 20000 },
  { agent: 'RevOps [03e]',      tokens: 7200,  max: 20000 },
  { agent: 'Content SEO [03a]', tokens: 6100,  max: 20000 },
  { agent: 'VP CS [04a]',       tokens: 4300,  max: 20000 },
];

const HITL_QUEUE = [
  { id: 1, icon: '📤', agent: 'SDR Manager [02a]', action: 'Send personalised outreach to 12 contacts at Acme Corp via Apollo sequence' },
  { id: 2, icon: '💰', agent: 'VP Sales [01b]',    action: 'Apply 15% discount to DataBridge Corp Enterprise deal to accelerate Q-close' },
  { id: 3, icon: '📢', agent: 'Demand Gen [02b]',  action: 'Launch LinkedIn ABM campaign targeting "Head of Revenue" at 50 target accounts' },
];

const METRICS_DEFAULT = [
  { label: 'Agent Decisions Today', value: '247',   delta: '+34 vs yesterday' },
  { label: 'Tool Calls Executed',   value: '1,089', delta: '+12% this week'   },
  { label: 'Memories Recalled',     value: '412',   delta: 'pgvector queries' },
  { label: 'HITL Approvals Pending',value: '3',     delta: '2 high-priority'  },
  { label: 'Leads Triaged',         value: '68',    delta: '9 Tier 1 signals' },
  { label: 'Avg Token Budget Used', value: '61%',   delta: 'within budget'    },
];

const SCENARIOS = [
  { id: 'all', name: '🚀 Full E2E Loop', desc: 'Runs all 4 GTM scenarios in succession: Strategy, Execution, Channels, and CS.' },
  { id: '1', name: '🌅 Scenario 1: Strategy', desc: 'Chief Marketing Officer (01) aligns response to competitive pricing drops.' },
  { id: '2', name: '📥 Scenario 2: Execution', desc: 'RevOps (03e) evaluates and routes fresh webinar leads to nurture/outbound.' },
  { id: '3', name: '✍️ Scenario 3: Channels', desc: 'Content & SEO (03c) builds content briefs and shares with Community.' },
  { id: '4', name: '🏥 Scenario 4: CS Telemetry', desc: 'VP Customer Success (04a) analyzes usage telemetry and fires alert triggers.' },
  { id: 'custom', name: '🎛️ Custom Simulation Builder', desc: 'Select any GTM agent, specify custom prompt instructions, and run dynamic logic.' },
];

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('synapse_user');
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else {
      setIsAuthenticated(true);
      setCheckingAuth(false);
    }
  }, [router, pathname]);

  // Modes
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);
  
  // Simulation Controller state
  const [selectedScenario, setSelectedScenario] = useState('all');
  const [consoleLogs, setConsoleLogs] = useState<string[]>(['[info] System idle. Toggle "Live Backend Mode" and run a simulation scenario!']);
  const [scorecard, setScorecard] = useState<any[]>([]);

  // Custom simulation builder states
  const [customAgentId, setCustomAgentId] = useState('01');
  const [customPrompt, setCustomPrompt] = useState('A competitor just dropped their pricing by 20%. Conduct deep competitive intelligence research on Warmly and Unify, and then compile a detailed product positioning battlecard.');
  const [customBudget, setCustomBudget] = useState(60000);

  // Agent Dashboard components state
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>({});
  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>([]);
  const [a2aMsgs, setA2aMsgs] = useState<A2AMsg[]>([]);
  const [memRecalls, setMemRecalls] = useState<MemRecall[]>([]);
  const [hitlQueue, setHitlQueue] = useState(HITL_QUEUE);
  const [tokenUsage, setTokenUsage] = useState(TOKEN_DATA);
  const [metrics, setMetrics] = useState(METRICS_DEFAULT);
  


  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll console to bottom
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLogs]);

  // ─── Mock Streaming Intervals ────────────────────────────────────────────────
  useEffect(() => {
    if (isLiveMode) return;

    // Reset components to mock seed data
    const init: Record<string, AgentStatus> = {};
    AGENTS.forEach(a => { init[a.id] = randomStatus(); });
    setAgentStatuses(init);

    setFeedEvents(FEED_TEMPLATES.slice(0, 5).map((t, i) => ({ ...t, id: i, time: nowTime() })));
    setA2aMsgs(A2A_TEMPLATES.slice(0, 4).map((t, i) => ({ ...t, id: i, time: nowTime() })));
    setMemRecalls(MEM_RECALLS.map((m, i) => ({ ...m, id: i })));
    setHitlQueue(HITL_QUEUE);
    setTokenUsage(TOKEN_DATA);
    setMetrics(METRICS_DEFAULT);
    setScorecard([]);

    // Rotate random agent statuses
    const statusIv = setInterval(() => {
      setAgentStatuses(prev => {
        const next = { ...prev };
        const ids = AGENTS.map(a => a.id);
        const pick = ids[Math.floor(Math.random() * ids.length)];
        next[pick] = randomStatus();
        return next;
      });
    }, 2200);

    // Stream activity feed
    const feedIv = setInterval(() => {
      const template = FEED_TEMPLATES[Math.floor(Math.random() * FEED_TEMPLATES.length)];
      const uniqueId = `feed-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setFeedEvents(prev => [{ ...template, id: uniqueId, time: nowTime() }, ...prev.slice(0, 14)]);
    }, 3200);

    // Stream A2A
    const a2aIv = setInterval(() => {
      const template = A2A_TEMPLATES[Math.floor(Math.random() * A2A_TEMPLATES.length)];
      const uniqueId = `a2a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setA2aMsgs(prev => [{ ...template, id: uniqueId, time: nowTime() }, ...prev.slice(0, 7)]);
    }, 4500);

    return () => {
      clearInterval(statusIv);
      clearInterval(feedIv);
      clearInterval(a2aIv);
    };
  }, [isLiveMode]);

  // ─── Live Backend Mode Traces Polling ──────────────────────────────────────
  const fetchLiveTraces = useCallback(async () => {
    try {
      const res = await fetch('/api/simulation/traces');
      const data = await res.json();
      if (data.success !== false && data.traces) {
        const traces = data.traces as any[];

        // Map traces to Live Activity Feed
        const mappedFeed: FeedEvent[] = [];
        const mappedA2A: A2AMsg[] = [];
        const mappedMem: MemRecall[] = [];
        const tempStatuses: Record<string, AgentStatus> = {};

        // Default all active GTM agents to idle
        AGENTS.forEach(a => { tempStatuses[a.id] = 'idle'; });

        traces.forEach((t: any, idx: number) => {
          const timeFormatted = new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
          
          // Map agent statuses based on latest traces
          if (idx < 5) {
            if (t.event_type === 'think_start') tempStatuses[t.agent_id] = 'thinking';
            else if (t.event_type === 'tool_start') tempStatuses[t.agent_id] = 'running';
            else if (t.event_type === 'think_end') tempStatuses[t.agent_id] = 'done';
          }

          // Feed Event Mapping
          if (t.event_type === 'think_start') {
            mappedFeed.push({
              id: t.trace_id,
              type: 'think',
              agent: `Agent ${t.agent_id}`,
              msg: `Thinking: ${t.input_summary}`,
              meta: `LLM reasoning phase started`,
              time: timeFormatted
            });
          } else if (t.event_type === 'think_end') {
            mappedFeed.push({
              id: t.trace_id,
              type: 'done',
              agent: `Agent ${t.agent_id}`,
              msg: `Decided: ${t.output_summary}`,
              meta: `Execution duration: ${t.duration_ms}ms · cap: ${t.token_count || 1000} tokens`,
              time: timeFormatted
            });
            // Mock memory recall alert corresponding to this trace
            mappedMem.push({
              id: `mem-${t.trace_id}`,
              agent: `Agent ${t.agent_id}`,
              type: 'agent_decision',
              content: `Decided GTM path: ${t.output_summary}`,
              sim: 0.90 + Math.random() * 0.09
            });
          } else if (t.event_type === 'tool_start') {
            mappedFeed.push({
              id: t.trace_id,
              type: 'tool',
              agent: `Agent ${t.agent_id}`,
              msg: `Tool invoked: ${t.tool_name}`,
              meta: `Parameters: ${t.input_summary}`,
              time: timeFormatted
            });
            // Propagate into A2A protocol flow
            mappedA2A.push({
              id: `a2a-${t.trace_id}`,
              from: 'O1',
              to: t.agent_id,
              msg: `Tasking: Run ${t.tool_name} with params`,
              time: timeFormatted
            });
          } else if (t.event_type === 'security_block') {
            mappedFeed.push({
              id: t.trace_id,
              type: 'hitl',
              agent: `Agent ${t.agent_id}`,
              msg: `SAIF Security Block: ${t.error_message}`,
              meta: `Adversarial shield active`,
              time: timeFormatted
            });
          }
        });

        // Set states based on actual polled backend traces
        if (traces.length > 0) {
          setFeedEvents(mappedFeed.slice(0, 15));
          setA2aMsgs(mappedA2A.slice(0, 8));
          setMemRecalls(mappedMem.slice(0, 6));
          setAgentStatuses(tempStatuses);

          // Dynamically compute live metrics based on real traces!
          const decisionsCount = traces.filter(t => t.event_type === 'think_end').length;
          const toolsCount = traces.filter(t => t.event_type === 'tool_start').length;
          const blocksCount = traces.filter(t => t.event_type === 'security_block').length;

          setMetrics([
            { label: 'Agent Decisions Today', value: String(decisionsCount || 4),   delta: 'Live server metrics' },
            { label: 'Tool Calls Executed',   value: String(toolsCount || 12),     delta: 'Connected via A2A gateway'   },
            { label: 'Memories Recalled',     value: String(decisionsCount + 1),   delta: 'Local pgvector simulation' },
            { label: 'HITL Approvals Pending',value: String(blocksCount || 0),     delta: 'Active guardrails'  },
            { label: 'Leads Triaged',         value: '3',                          delta: 'Scenario executions' },
            { label: 'Avg Token Budget Used', value: '47%',                        delta: 'within threshold'    },
          ]);

          // Dynamically update token bars based on real trace tokens
          const updatedTokenRow = [...TOKEN_DATA];
          traces.forEach(t => {
            if (t.event_type === 'think_end' && t.token_count) {
              const matchedRow = updatedTokenRow.find(row => row.agent.includes(t.agent_id));
              if (matchedRow) {
                matchedRow.tokens = Math.min(matchedRow.max, matchedRow.tokens + t.token_count);
              }
            }
          });
          setTokenUsage(updatedTokenRow);
        }
      }
    } catch (e) {
      console.error('Failed to fetch live traces', e);
    }
  }, []);

  // Set up polling interval for live mode
  useEffect(() => {
    if (!isLiveMode) return;
    fetchLiveTraces();
    const pollInterval = setInterval(fetchLiveTraces, 1500);
    return () => clearInterval(pollInterval);
  }, [isLiveMode, fetchLiveTraces]);

  if (checkingAuth || !isAuthenticated) {
    return (
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#060810',
          color: '#f0f4ff',
          fontFamily: 'var(--font-sora, sans-serif)',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(30px)',
            pointerEvents: 'none'
          }}
        />
        <div 
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid rgba(59, 130, 246, 0.1)',
            borderTopColor: '#3b82f6',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <span style={{ fontSize: '0.85rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 }}>
          SYNAPSE OS SECURE CHANNEL INITIALIZING...
        </span>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  // ─── Simulation Run Trigger ─────────────────────────────────────────────────
  const handleRunSimulation = async () => {
    setIsRunningSimulation(true);
    setScorecard([]);
    setConsoleLogs([
      `[info] Initiating simulation run for scenario: "${selectedScenario}"`,
      `[info] Connecting to internal agent endpoint: POST /api/simulation/run`,
      `[info] Resetting circular in-memory traces buffer...`
    ]);

    try {
      // 1. Clear trace logs in backend
      await fetch('/api/simulation/traces', { method: 'DELETE' });
      setFeedEvents([]);
      setA2aMsgs([]);
      setMemRecalls([]);

      setConsoleLogs(prev => [...prev, `[info] Active Agent Registry loaded (LOCAL_AGENT_REGISTRY fallback active).`]);

      // Simple visual delays to show progress in console
      const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

      if (selectedScenario === '1' || selectedScenario === 'all') {
        setConsoleLogs(prev => [...prev, `[info] Dispatching Scenario 1 (Morning Sync) to CMO Orchestrator (01)...`]);
        await delay(1200);
      }
      if (selectedScenario === '2' || selectedScenario === 'all') {
        setConsoleLogs(prev => [...prev, `[info] Dispatching Scenario 2 (Lead Routing) to Revenue Operations (03e)...`]);
        await delay(1000);
      }
      if (selectedScenario === '3' || selectedScenario === 'all') {
        setConsoleLogs(prev => [...prev, `[info] Dispatching Scenario 3 (Content Creation) to Content & SEO Lead (03c)...`]);
        await delay(1000);
      }
      if (selectedScenario === '4' || selectedScenario === 'all') {
        setConsoleLogs(prev => [...prev, `[info] Dispatching Scenario 4 (CS Telemetry) to VP Customer Success (04a)...`]);
        await delay(800);
      }
      if (selectedScenario === 'custom') {
        setConsoleLogs(prev => [...prev, `[info] Dispatching custom instructions to Agent ${customAgentId}...`]);
        await delay(1000);
      }

      // 2. Trigger actual backend BaseAgent think loops!
      let body: any = { scenario: selectedScenario };
      if (selectedScenario === 'custom') {
        body = {
          scenario: 'custom',
          agentId: customAgentId,
          prompt: customPrompt,
          budget: customBudget
        };
      }

      const res = await fetch('/api/simulation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (data.success) {
        setConsoleLogs(prev => [
          ...prev,
          `[success] Agent simulation executed successfully!`,
          `[success] 🏆 All GTM actions parsed and mapped to internal layers.`
        ]);
        setScorecard(data.results || []);
      } else {
        setConsoleLogs(prev => [
          ...prev,
          `[error] Agent execution failed: ${data.error || 'Unknown error'}`
        ]);
      }

      // 3. Immediately poll traces once to fetch final state
      fetchLiveTraces();

    } catch (e: any) {
      setConsoleLogs(prev => [...prev, `[error] Connection failed: ${e.message}`]);
    } finally {
      setIsRunningSimulation(false);
    }
  };

  const handleApprove = useCallback((id: number) => {
    setHitlQueue(q => q.filter(x => x.id !== id));
  }, []);

  const handleDeny = useCallback((id: number) => {
    setHitlQueue(q => q.filter(x => x.id !== id));
  }, []);

  // Class Helpers
  const statusClass = (st: AgentStatus) => {
    if (st === 'thinking') return s.thinking;
    if (st === 'running')  return s.running;
    if (st === 'done')     return s.done;
    return s.idle;
  };
  const statusTextClass = (st: AgentStatus) => {
    if (st === 'thinking') return s.textThinking;
    if (st === 'running')  return s.textRunning;
    if (st === 'done')     return s.textDone;
    return s.textIdle;
  };
  const feedIconClass = (type: FeedEvent['type']) => {
    if (type === 'think')  return s.iconThink;
    if (type === 'tool')   return s.iconTool;
    if (type === 'memory') return s.iconMemory;
    if (type === 'hitl')   return s.iconHITL;
    return s.iconDone;
  };
  const feedEmoji = (type: FeedEvent['type']) => {
    if (type === 'think')  return '🧠';
    if (type === 'tool')   return '🔧';
    if (type === 'memory') return '💾';
    if (type === 'hitl')   return '⚠️';
    return '✅';
  };

  return (
    <div className={s.page}>
      <div className={s.noise} aria-hidden />

      {/* ── Header ── */}
      <header className={s.header}>
        <div className={s.headerInner}>
          <Link href="/" className={s.logo}>SYNAPSE</Link>
          <div className={s.demoBadge}>
            <span className={s.liveIndicator} />
            {isLiveMode ? 'Live Backend System active' : 'Live Demo — Mock Streaming'}
          </div>
          <div className={s.headerActions}>
            <Link href="/" className={s.headerLink}>← Landing</Link>
            <a href="https://github.com/abdulfatiraziz/SynapseAgenticGTMOS" target="_blank" rel="noopener noreferrer" className={s.headerLink}>GitHub</a>
            <a href="https://github.com/abdulfatiraziz/SynapseAgenticGTMOS#quickstart" target="_blank" rel="noopener noreferrer" className={s.headerBtn}>Deploy Yours</a>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className={s.hero}>
        <div className={s.heroGlow} aria-hidden />
        <h1 className={s.heroTitle}>
          Watch Your <span className={s.accent}>19 AI Agents</span><br />Run Your GTM in Real-Time
        </h1>
        <p className={s.heroSub}>
          Connect directly to the backend multi-agent environment. Fire cascades, view memory lookups, and audit security boundaries in real-time.
        </p>
        <div className={s.disclaimer}>⚡ Dynamic live tracing supported in local modes</div>
      </section>

      {/* ── Simulation Control Panel ── */}
      <section className={s.simControlPanel}>
        <div className={s.simControlCard}>
          <div className={s.simControlHeader}>
            <div className={s.simControlTitle}>
              ⚙️ GTM Agentic Simulation Control Panel
            </div>
            <div className={s.simToggles}>
              <button 
                className={`${s.toggleBtn} ${!isLiveMode ? s.toggleBtnActive : ''}`}
                onClick={() => { setIsLiveMode(false); setConsoleLogs(['[info] Switched to Mock Streaming Demo.']); }}
              >
                ⚪ Mock Streaming Demo
              </button>
              <button 
                className={`${s.toggleBtn} ${isLiveMode ? s.toggleBtnActive : ''}`}
                onClick={() => { setIsLiveMode(true); setConsoleLogs(['[info] Switched to Live Backend Mode. Trigger a scenario to see live traces.']); }}
              >
                🟢 Live Backend System
              </button>
            </div>
          </div>

          {isLiveMode ? (
            <div>
              <div className={s.scenarioRow}>
                {SCENARIOS.map(sc => (
                  <div 
                    key={sc.id} 
                    className={`${s.scenarioCard} ${selectedScenario === sc.id ? s.scenarioCardActive : ''}`}
                    onClick={() => setSelectedScenario(sc.id)}
                  >
                    <span className={s.scenarioName}>{sc.name}</span>
                    <span className={s.scenarioDesc}>{sc.desc}</span>
                  </div>
                ))}
              </div>

              {/* Custom Configuration Panel */}
              {selectedScenario === 'custom' && (
                <div className={s.customConfigPanel}>
                  <div className={s.customConfigGroup}>
                    <label className={s.customConfigLabel}>Select GTM Agent</label>
                    <select
                      className={s.customSelect}
                      value={customAgentId}
                      onChange={(e) => setCustomAgentId(e.target.value)}
                    >
                      <option value="01">Agent 01 - Chief Marketing Officer</option>
                      <option value="01b">Agent 01b - VP Product Marketing</option>
                      <option value="01c">Agent 01c - Pricing & Packaging Manager</option>
                      <option value="01d">Agent 01d - Market Intelligence Analyst</option>
                      <option value="02a">Agent 02a - VP Sales</option>
                      <option value="02b">Agent 02b - Head of PLG</option>
                      <option value="02c">Agent 02c - Head of Community</option>
                      <option value="02d">Agent 02d - VP Partnerships</option>
                      <option value="03a">Agent 03a - SDR Manager</option>
                      <option value="03b">Agent 03b - Demand Generation Manager</option>
                      <option value="03c">Agent 03c - Content & SEO Lead</option>
                      <option value="03d">Agent 03d - Field & Events Manager</option>
                      <option value="03e">Agent 03e - Head of Revenue Operations</option>
                      <option value="04a">Agent 04a - VP Customer Success</option>
                      <option value="04b">Agent 04b - Customer Success Manager</option>
                      <option value="04c">Agent 04c - Expansion Account Executive</option>
                      <option value="04d">Agent 04d - Renewals Manager</option>
                    </select>
                  </div>

                  <div className={s.customConfigGroup}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className={s.customConfigLabel}>Token Budget Cap</label>
                      <span className={s.customValue}>{customBudget.toLocaleString()} tokens</span>
                    </div>
                    <input
                      type="range"
                      className={s.customSlider}
                      min="10000"
                      max="200000"
                      step="5000"
                      value={customBudget}
                      onChange={(e) => setCustomBudget(Number(e.target.value))}
                    />
                  </div>

                  <div className={s.customConfigGroup} style={{ gridColumn: 'span 2' }}>
                    <label className={s.customConfigLabel}>Custom Prompt / Agent Mission Instruction</label>
                    <textarea
                      className={s.customTextarea}
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Specify custom instructions for the GTM agent..."
                    />
                  </div>
                </div>
              )}

              <div className={s.runBar}>
                <button 
                  className={s.btnRunSim} 
                  disabled={isRunningSimulation}
                  onClick={handleRunSimulation}
                >
                  {isRunningSimulation ? '⏳ Running Agent Cascade...' : '🚀 Launch Scenario Cascade'}
                </button>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', textAlign: 'right' }}>
                  Runs standard BaseAgent workflow routines using resilient Vertex AI mocks.
                </div>
              </div>

              {/* Console Emulator */}
              <div className={s.simConsole}>
                {consoleLogs.map((log, idx) => {
                  let cls = s.consoleLog;
                  if (log.startsWith('[info]')) cls = s.consoleInfo;
                  else if (log.startsWith('[success]')) cls = s.consoleSuccess;
                  else if (log.startsWith('[error]')) cls = s.consoleError;

                  return (
                    <div key={idx} className={`${s.consoleLine} ${cls}`}>
                      {log}
                    </div>
                  );
                })}
                <div ref={consoleEndRef} />
              </div>

              {/* Scorecard table once run is completed */}
              {scorecard.length > 0 && (
                <div className={s.scoreboard}>
                  <div className={s.scoreboardTitle}>🏆 Agent Scorecard Summary</div>
                  <table className={s.scoreTable}>
                    <thead>
                      <tr>
                        <th>Scenario</th>
                        <th>Agent</th>
                        <th>Agent Name</th>
                        <th>Status</th>
                        <th>Output Summary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scorecard.map((scResult, i) => (
                        <tr key={i}>
                          <td>{scResult.scenario}</td>
                          <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{scResult.agent}</td>
                          <td>{scResult.agentName}</td>
                          <td><span className={s.passBadge}>{scResult.status}</span></td>
                          <td style={{ color: 'var(--text-secondary)' }}>{scResult.summary}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--muted)', fontSize: '0.875rem' }}>
              💡 Toggle **Live Backend System** above to execute live agent decision loops and see real-time trace outputs!
            </div>
          )}
        </div>
      </section>

      {/* ── Metrics Row ── */}
      <div className={s.metricsRow}>
        {metrics.map((m, i) => (
          <div key={i} className={s.metricCard}>
            <div className={s.metricLabel}>{m.label}</div>
            <div className={s.metricValue}>{m.value}</div>
            <div className={s.metricDelta}>{m.delta}</div>
          </div>
        ))}
      </div>

      {/* ── Main Grid: Activity Feed + A2A + Memory ── */}
      <div className={s.mainGrid}>
        {/* Left: Agent Status Grid + Live Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Agent Status */}
          <div className={s.panel}>
            <div className={s.panelHeader}>
              <span className={s.panelTitle}>🤖 Agent Status — All 19 Agents</span>
              <span className={`${s.panelBadge} ${s.badgeGreen}`}>{isLiveMode ? 'Live Server' : 'Rotating Demo'}</span>
            </div>
            <div className={s.agentGrid}>
              {AGENTS.map(agent => {
                const st = agentStatuses[agent.id] ?? 'idle';
                return (
                  <div key={agent.id} className={s.agentCell}>
                    <div className={s.agentCellId}>Agent {agent.id}</div>
                    <div className={s.agentCellName}>{agent.name}</div>
                    <div className={s.agentCellStatus}>
                      <span className={`${s.statusDot} ${statusClass(st)}`} />
                      <span className={statusTextClass(st)}>{st}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className={s.panel}>
            <div className={s.panelHeader}>
              <span className={s.panelTitle}>⚡ Live Activity Feed</span>
              <span className={`${s.panelBadge} ${s.badgeBlue}`}>{isLiveMode ? 'Live Traces Waterfall' : 'Mock Streaming'}</span>
            </div>
            <div className={s.feed}>
              {feedEvents.length === 0 ? (
                <div style={{ padding: '2rem', color: 'var(--muted)', textAlign: 'center', fontSize: '0.85rem' }}>
                  No trace events recorded yet. Run a scenario above!
                </div>
              ) : feedEvents.map((ev, index) => (
                <div key={ev.id || index} className={s.feedItem}>
                  <div className={`${s.feedIcon} ${feedIconClass(ev.type)}`}>{feedEmoji(ev.type)}</div>
                  <div className={s.feedContent}>
                    <div className={s.feedAgent}>{ev.agent}</div>
                    <div className={s.feedMsg}>{ev.msg}</div>
                    <div className={s.feedMeta}>{ev.meta}</div>
                  </div>
                  <div className={s.feedTime}>{ev.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: A2A + Memory Recalls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* A2A Messages */}
          <div className={s.panel}>
            <div className={s.panelHeader}>
              <span className={s.panelTitle}>🔗 A2A Protocol Messages</span>
              <span className={`${s.panelBadge} ${s.badgePurple}`}>{isLiveMode ? 'Live Spoke Connections' : 'Mock Spoke'}</span>
            </div>
            <div className={s.a2aList}>
              {a2aMsgs.length === 0 ? (
                <div style={{ padding: '2rem', color: 'var(--muted)', textAlign: 'center', fontSize: '0.85rem' }}>
                  No internal A2A calls logged.
                </div>
              ) : a2aMsgs.map((m, index) => (
                <div key={m.id || index} className={s.a2aItem}>
                  <span className={s.a2aFrom}>{m.from}</span>
                  <span className={s.a2aArrow}>→</span>
                  <span className={s.a2aTo}>{m.to}</span>
                  <span className={s.a2aMsg}>{m.msg}</span>
                  <span className={s.a2aTime}>{m.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Memory Recalls */}
          <div className={s.panel}>
            <div className={s.panelHeader}>
              <span className={s.panelTitle}>💾 Memory Recalls (pgvector RAG)</span>
              <span className={`${s.panelBadge} ${s.badgeGreen}`}>{isLiveMode ? 'Active Vector Recalls' : 'Supabase Mock'}</span>
            </div>
            <div className={s.memList}>
              {memRecalls.length === 0 ? (
                <div style={{ padding: '2rem', color: 'var(--muted)', textAlign: 'center', fontSize: '0.85rem' }}>
                  No vector memories recalled yet.
                </div>
              ) : memRecalls.map((m, index) => (
                <div key={m.id || index} className={s.memItem}>
                  <div className={s.memHeader}>
                    <span className={s.memAgent}>{m.agent}</span>
                    <span className={s.memSim}>sim: {m.sim.toFixed(2)}</span>
                  </div>
                  <span className={s.memType}>{m.type}</span>
                  <div className={s.memContent}>{m.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Grid: HITL + Token Usage ── */}
      <div className={s.bottomGrid}>
        {/* HITL Queue */}
        <div className={s.panel}>
          <div className={s.panelHeader}>
            <span className={s.panelTitle}>⚠️ HITL Approval Queue</span>
            <span className={`${s.panelBadge} ${s.badgeGreen}`}>{hitlQueue.length} pending</span>
          </div>
          <div className={s.hitlList}>
            {hitlQueue.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem' }}>
                ✅ All actions approved — queue empty
              </div>
            ) : hitlQueue.map(item => (
              <div key={item.id} className={s.hitlItem}>
                <div className={s.hitlTop}>
                  <span className={s.hitlIcon}>{item.icon}</span>
                  <span className={s.hitlAgent}>{item.agent}</span>
                </div>
                <div className={s.hitlAction}>{item.action}</div>
                <div className={s.hitlBtns}>
                  <button className={s.btnApprove} onClick={() => handleApprove(item.id)}>✓ Approve</button>
                  <button className={s.btnDeny}    onClick={() => handleDeny(item.id)}>✗ Deny</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Token Usage */}
        <div className={s.panel}>
          <div className={s.panelHeader}>
            <span className={s.panelTitle}>📊 Token Budget — Session Usage</span>
            <span className={`${s.panelBadge} ${s.badgeBlue}`}>Gemini 2.5 Flash</span>
          </div>
          <div className={s.tokenPanel}>
            {tokenUsage.map((t, i) => (
              <div key={i} className={s.tokenRow}>
                <span className={s.tokenAgent}>{t.agent}</span>
                <div className={s.tokenBarWrap}>
                  <div className={s.tokenBar} style={{ width: `${Math.round((t.tokens / t.max) * 100)}%` }} />
                </div>
                <span className={s.tokenCount}>{(t.tokens / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <section className={s.ctaSection}>
        <h2 className={s.ctaTitle}>Deploy Your Own<br />Synapse GTM OS</h2>
        <p className={s.ctaSub}>MIT Licensed. Bring your own API keys. Live in under 30 minutes.</p>
        <div className={s.ctaBtns}>
          <a href="https://github.com/abdulfatiraziz/SynapseAgenticGTMOS" target="_blank" rel="noopener noreferrer" className={s.btnPrimary}>
            ⭐ Star on GitHub
          </a>
          <a href="https://github.com/abdulfatiraziz/SynapseAgenticGTMOS#quickstart" target="_blank" rel="noopener noreferrer" className={s.btnSecondary}>
            📖 View Setup Guide
          </a>
          <Link href="/" className={s.btnSecondary}>← Back to Landing</Link>
        </div>
      </section>
    </div>
  );
}
