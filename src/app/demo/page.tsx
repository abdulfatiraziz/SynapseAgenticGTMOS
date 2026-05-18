'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import s from './page.module.css';

// ─── Mock Data Definitions ────────────────────────────────────────────────────

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
  id: number;
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
  id: number;
  from: string;
  to: string;
  msg: string;
  time: string;
}

interface MemRecall {
  id: number;
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

const METRICS = [
  { label: 'Agent Decisions Today', value: '247',   delta: '+34 vs yesterday' },
  { label: 'Tool Calls Executed',   value: '1,089', delta: '+12% this week'   },
  { label: 'Memories Recalled',     value: '412',   delta: 'pgvector queries' },
  { label: 'HITL Approvals Pending',value: '3',     delta: '2 high-priority'  },
  { label: 'Leads Triaged',         value: '68',    delta: '9 Tier 1 signals' },
  { label: 'Avg Token Budget Used', value: '61%',   delta: 'within budget'    },
];

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>({});
  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>([]);
  const [a2aMsgs, setA2aMsgs] = useState<A2AMsg[]>([]);
  const [memRecalls, setMemRecalls] = useState<MemRecall[]>([]);
  const [hitlQueue, setHitlQueue] = useState(HITL_QUEUE);
  const [eventId, setEventId] = useState(0);

  // Initialize statuses
  useEffect(() => {
    const init: Record<string, AgentStatus> = {};
    AGENTS.forEach(a => { init[a.id] = randomStatus(); });
    setAgentStatuses(init);

    // Seed initial feed
    const seedFeed = FEED_TEMPLATES.slice(0, 5).map((t, i) => ({
      ...t, id: i, time: nowTime(),
    }));
    setFeedEvents(seedFeed);

    const seedA2a = A2A_TEMPLATES.slice(0, 4).map((t, i) => ({
      ...t, id: i, time: nowTime(),
    }));
    setA2aMsgs(seedA2a);

    setMemRecalls(MEM_RECALLS.map((m, i) => ({ ...m, id: i })));
    setEventId(100);
  }, []);

  // Rotate agent statuses
  useEffect(() => {
    const iv = setInterval(() => {
      setAgentStatuses(prev => {
        const next = { ...prev };
        const ids = AGENTS.map(a => a.id);
        const pick = ids[Math.floor(Math.random() * ids.length)];
        next[pick] = randomStatus();
        return next;
      });
    }, 2200);
    return () => clearInterval(iv);
  }, []);

  // Stream new feed events
  useEffect(() => {
    const iv = setInterval(() => {
      const template = FEED_TEMPLATES[Math.floor(Math.random() * FEED_TEMPLATES.length)];
      setEventId(id => {
        const newId = id + 1;
        setFeedEvents(prev => [{ ...template, id: newId, time: nowTime() }, ...prev.slice(0, 19)]);
        return newId;
      });
    }, 3500);
    return () => clearInterval(iv);
  }, []);

  // Stream A2A messages
  useEffect(() => {
    const iv = setInterval(() => {
      const template = A2A_TEMPLATES[Math.floor(Math.random() * A2A_TEMPLATES.length)];
      setEventId(id => {
        const newId = id + 1;
        setA2aMsgs(prev => [{ ...template, id: newId, time: nowTime() }, ...prev.slice(0, 9)]);
        return newId;
      });
    }, 4500);
    return () => clearInterval(iv);
  }, []);

  const handleApprove = useCallback((id: number) => {
    setHitlQueue(q => q.filter(x => x.id !== id));
  }, []);

  const handleDeny = useCallback((id: number) => {
    setHitlQueue(q => q.filter(x => x.id !== id));
  }, []);

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
            Live Demo — Mock Data
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
          This is a live simulation of the Synapse Agentic GTM OS. All data is mock — deploy the open-source system and connect your own tools to see real results.
        </p>
        <div className={s.disclaimer}>⚠️ Simulated data — no real API calls in demo mode</div>
      </section>

      {/* ── Metrics Row ── */}
      <div className={s.metricsRow}>
        {METRICS.map((m, i) => (
          <div key={i} className={s.metricCard}>
            <div className={s.metricLabel}>{m.label}</div>
            <div className={s.metricValue}>{m.value}</div>
            <div className={s.metricDelta}>↑ {m.delta}</div>
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
              <span className={`${s.panelBadge} ${s.badgeGreen}`}>Live</span>
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
              <span className={`${s.panelBadge} ${s.badgeBlue}`}>Streaming</span>
            </div>
            <div className={s.feed}>
              {feedEvents.map(ev => (
                <div key={ev.id} className={s.feedItem}>
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
              <span className={`${s.panelBadge} ${s.badgePurple}`}>Live</span>
            </div>
            <div className={s.a2aList}>
              {a2aMsgs.map(m => (
                <div key={m.id} className={s.a2aItem}>
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
              <span className={`${s.panelBadge} ${s.badgeGreen}`}>Supabase</span>
            </div>
            <div className={s.memList}>
              {memRecalls.map(m => (
                <div key={m.id} className={s.memItem}>
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
            {TOKEN_DATA.map((t, i) => (
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
