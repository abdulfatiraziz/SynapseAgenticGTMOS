"use client";

import React, { useState } from "react";
import { 
  Database, 
  Server, 
  Cpu, 
  Activity, 
  Key, 
  Layers, 
  RefreshCw, 
  FileCode, 
  Check, 
  Zap, 
  HardDrive,
  Network
} from "lucide-react";

interface Agent {
  id: string; name: string; layer: number; sub: string; accent: string;
  tag: string; tagColor: string; reports: string; tools: string[];
  responsibilities: string[]; kpis: string[]; logic: string; motion: string;
}

const agents: Agent[] = [
  // Layer 1 — Strategy & Intelligence
  { id: "01",  name: "Chief Marketing Officer",    layer: 1, sub: "ICP · Messaging · Budget allocation",       accent: "#818cf8", tag: "C-Suite",     tagColor: "purple", reports: "CEO",          tools: ["HubSpot","MarketIntel","Notion","Slack"],              responsibilities: ["Owns overall GTM strategy","Defines and locks ICP","Sets demand gen budget","Aligns all motions"], kpis: ["Pipeline from marketing","CAC","Win-rate uplift","Marketing-sourced revenue %"], logic: "IF MarketIntel shows competitor pivot → Trigger 03c rebuttal content", motion: "Orchestrator" },
  { id: "01b", name: "Chief Strategy Officer",     layer: 1, sub: "Long-term roadmap · Ecosystem design",      accent: "#818cf8", tag: "C-Suite",     tagColor: "purple", reports: "CEO",          tools: ["HubSpot","MarketIntel","Make"],                        responsibilities: ["GTM architecture oversight","Partner strategy","Board reporting"], kpis: ["Strategic initiative completion","Partner revenue %"], logic: "IF PQL rate drops → Audit 02b onboarding flow", motion: "Strategist" },
  { id: "01c", name: "GTM Engineer",               layer: 1, sub: "System integration · Workflow debugging",   accent: "#818cf8", tag: "IC / Builder", tagColor: "purple", reports: "CSO",          tools: ["Make","Gumloop","Supabase"],                           responsibilities: ["API bridge building","Agentic workflow debugging","Tool health monitoring"], kpis: ["Uptime %","Integration cycle time"], logic: "IF any Agent reports 'API Down' → Restart Make scenario", motion: "Infrastructure" },
  { id: "01d", name: "Market Intelligence Analyst", layer: 1, sub: "Competitor tracking · ICP research",       accent: "#818cf8", tag: "IC / Analyst", tagColor: "purple", reports: "VP PMM",       tools: ["MarketIntel","GoogleAnalytics","Notion"],              responsibilities: ["Real-time grounded search","Competitor feature tracking","Industry trend synthesis"], kpis: ["ICP match rate","Competitive win-rate trend"], logic: "ALWAYS search 'Synapse competitors' EVERY 24 h", motion: "Intelligence" },

  // Layer 2 — GTM Motions (Management)
  { id: "02a", name: "VP Sales (SLG)",              layer: 2, sub: "Enterprise deal cycles · Top-down",        accent: "#34d399", tag: "Sales-Led",    tagColor: "teal",   reports: "CRO",         tools: ["Apollo","Clay","Slack","HubSpot"],                    responsibilities: ["Outbound sequence strategy","Lead triage management","SDR coaching"], kpis: ["SQLs per month","Pipeline from outbound","Meeting → Opp rate"], logic: "IF Clay enrichment score > 80 → Send to 03a", motion: "Sales-Led" },
  { id: "02b", name: "Head of PLG",                 layer: 2, sub: "Self-serve · PQL engine · Activation",     accent: "#60a5fa", tag: "Product-Led",  tagColor: "blue",   reports: "CPO / CMO",   tools: ["PostHog","HubSpot","Slack","Notion"],                 responsibilities: ["PQL scoring model","Activation tracking","Self-serve conversion"], kpis: ["Activation rate","Time-to-value","PQL → SQL rate","Product-sourced revenue %"], logic: "IF user invites 3 teammates → Flag PQL in HubSpot", motion: "Product-Led" },
  { id: "02c", name: "Head of Community",            layer: 2, sub: "Evangelist network · Peer trust",         accent: "#fb7185", tag: "Community-Led",tagColor: "pink",   reports: "CMO",         tools: ["Slack","LinkedIn","Notion"],                           responsibilities: ["Channel creation","Intent listening","Member sentiment analysis"], kpis: ["Community DAU","Community-sourced pipeline %","Referral rate"], logic: "IF keyword 'pricing' in Slack → Notify 03e", motion: "Community-Led" },
  { id: "02d", name: "VP Partnerships",              layer: 2, sub: "Co-sell · Resellers · Evangelist influence",accent: "#f97316",tag: "Partner-Led",  tagColor: "coral",  reports: "CRO",         tools: ["HubSpot","MarketIntel","Slack","LinkedIn"],           responsibilities: ["Partner account mapping","Co-selling orchestration","Warm intro management"], kpis: ["Partner-sourced revenue %","Partner-influenced pipeline","Time-to-first-deal"], logic: "IF deal has 'evangelist' status → Request intro from partner", motion: "Partner-Led" },

  // Layer 3 — Channels & Execution
  { id: "03a", name: "SDR Manager",                 layer: 3, sub: "Outbound pipeline · Sequences",            accent: "#34d399", tag: "Outbound",     tagColor: "teal",   reports: "VP Sales",    tools: ["Apollo","Clay","HubSpot","Slack"],                     responsibilities: ["Cold emailing at scale","Meeting booking","Personalized outreach"], kpis: ["Emails sent","Reply rate","Meetings booked","Pipeline $"], logic: "IF lead opens email 3× → Call via Zoom", motion: "Sales-Led" },
  { id: "03b", name: "Demand Gen Manager",           layer: 3, sub: "Paid ads · Inbound · Attribution",        accent: "#60a5fa", tag: "Inbound + Paid",tagColor: "blue",  reports: "CMO",         tools: ["GoogleAds","MetaAds","GoogleAnalytics","MarketIntel"], responsibilities: ["Ad spend optimization","Funnel analysis","ABM plays"], kpis: ["MQL volume","Cost per MQL","ROAS by channel","ABM engagement"], logic: "IF CAC > $500 → Pause LinkedIn campaign", motion: "Performance" },
  { id: "03c", name: "Content & SEO Lead",           layer: 3, sub: "Organic traffic · Social voice",          accent: "#a3e635", tag: "Organic",       tagColor: "green",  reports: "CMO",         tools: ["LinkedIn","Instagram","MarketIntel"],                  responsibilities: ["Daily AI-powered posting","Engagement tracking","Keyword strategy"], kpis: ["Organic traffic growth","Content-influenced pipeline","Domain authority"], logic: "IF PostHog shows interest in 'Agents' → Post on LinkedIn", motion: "Content" },
  { id: "03d", name: "Field & Events Manager",       layer: 3, sub: "Webinars · Conferences · Lead triage",    accent: "#fbbf24", tag: "Events",        tagColor: "amber",  reports: "CMO / VP Sales",tools: ["Zoom","Google","HubSpot","Slack"],                    responsibilities: ["Webinar-to-pipeline triage","Post-event follow-up","Registration management"], kpis: ["Event-sourced pipeline $","Attendee → meeting rate","Cost per opp"], logic: "IF attendee stayed > 45 min → Flag high-intent for 03a", motion: "Event-Led" },
  { id: "03e", name: "Head of RevOps",               layer: 3, sub: "CRM · Routing · Forecasting · Data",      accent: "#f97316", tag: "Nervous System",tagColor: "coral", reports: "CRO / CFO",   tools: ["Make","Gumloop","HubSpot","Clay"],                    responsibilities: ["Lead routing automation","CRM data hygiene","Tech stack governance"], kpis: ["Routing speed","Forecast accuracy","CRM completeness"], logic: "IF Lead Source = 'Webinar' → Route to 03d immediately", motion: "Operations" },

  // Layer 4 — CS & Expansion (NRR)
  { id: "04a", name: "VP Customer Success",          layer: 4, sub: "Health scores · QBRs · Churn prevention", accent: "#a3e635", tag: "Retain",        tagColor: "green",  reports: "CRO",         tools: ["HubSpot","PostHog","Notion"],                         responsibilities: ["NRR oversight","QBR orchestration","Churn signal monitoring"], kpis: ["NRR — target 110%+","GRR","Churn rate","Time-to-onboard"], logic: "IF Health Score < 50 → Trigger churn task for 04b", motion: "Retention" },
  { id: "04b", name: "Customer Success Manager",     layer: 4, sub: "Onboarding · Activation · Renewals",      accent: "#a3e635", tag: "Retain",        tagColor: "green",  reports: "VP CS",       tools: ["HubSpot","Slack","Zoom"],                             responsibilities: ["Account health checks","Product adoption coaching","Structured onboarding"], kpis: ["Renewal rate","Health score distribution","CSAT / NPS"], logic: "IF product usage drops 20% → Schedule check-in call", motion: "Retention" },
  { id: "04c", name: "Expansion Account Executive",  layer: 4, sub: "Upsell · Cross-sell · Seat expansion",    accent: "#34d399", tag: "Grow",          tagColor: "teal",   reports: "VP Sales",    tools: ["HubSpot","Apollo","LinkedIn"],                         responsibilities: ["Identifying expansion signals","Running upsell cycles","Contract amendments"], kpis: ["Expansion ARR","Upsell win rate","Avg expansion deal size"], logic: "IF customer at 90% seat limit → Send expansion proposal", motion: "Expansion" },
  { id: "04d", name: "Renewals Manager",              layer: 4, sub: "At-risk accounts · NRR defence",          accent: "#34d399", tag: "Grow",          tagColor: "teal",   reports: "VP CS",       tools: ["HubSpot","Notion","Slack"],                            responsibilities: ["Renewal pipeline management","Multi-year negotiation","NRR forecasting"], kpis: ["On-time renewal rate","Churn save rate","Multi-year attach rate"], logic: "IF renewal in 90 days → Notify 04a", motion: "Expansion" },
];

const layerMeta = [
  { id: 1, label: "Layer 1 — Strategy & intelligence foundation", icon: "🧠", color: "#818cf8" },
  { id: 2, label: "Layer 2 — GTM motions (engines)",              icon: "⚙️", color: "#34d399" },
  { id: 3, label: "Layer 3 — Channels & execution levers",        icon: "🚀", color: "#60a5fa" },
  { id: 4, label: "Layer 4 — Customer success & expansion (NRR)", icon: "🔄", color: "#fb7185" },
];

const tagStyle: Record<string, { bg: string; fg: string }> = {
  purple: { bg: "rgba(129, 140, 248, 0.15)", fg: "#a5b4fc" },
  teal:   { bg: "rgba(52, 211, 153, 0.15)", fg: "#6ee7b7" },
  blue:   { bg: "rgba(96, 165, 250, 0.15)", fg: "#93c5fd" },
  pink:   { bg: "rgba(251, 113, 133, 0.15)", fg: "#fda4af" },
  coral:  { bg: "rgba(249, 115, 22, 0.15)", fg: "#ffedd5" },
  amber:  { bg: "rgba(251, 191, 36, 0.15)", fg: "#fde68a" },
  green:  { bg: "rgba(163, 230, 53, 0.15)", fg: "#bef264" },
  gray:   { bg: "rgba(255, 255, 255, 0.05)", fg: "#d4d4d8" },
};

interface VectorMemory {
  id: string;
  agentId: string;
  agentName: string;
  query: string;
  recallContent: string;
  similarity: number;
  timestamp: string;
  tags: string[];
}

const initialMemories: VectorMemory[] = [
  {
    id: "mem-1",
    agentId: "01",
    agentName: "Chief Marketing Officer",
    query: "competitor pricing drop strategy",
    recallContent: "Competitor 'Warmly' announced a 20% discount on their platform tier. Strategy: target high-intent accounts with custom organic battlecards and adjust ad budgets.",
    similarity: 0.89,
    timestamp: "2026-05-26 14:20:05",
    tags: ["Competitor", "Pricing"]
  },
  {
    id: "mem-2",
    agentId: "01b",
    agentName: "Chief Strategy Officer",
    query: "ecosystem co-selling partnership plan",
    recallContent: "Crossbeam match identified 14 target overlaps with referral partners. Joint co-selling briefs committed to shared Notion workspace.",
    similarity: 0.92,
    timestamp: "2026-05-26 11:45:12",
    tags: ["Ecosystem", "Partners"]
  },
  {
    id: "mem-3",
    agentId: "03a",
    agentName: "SDR Manager",
    query: "outbound sequence personalization template",
    recallContent: "Acme Corp target lead profile retrieved from Apollo. ICP check score: 94%. Action: enroll high-priority decision makers in custom sequence.",
    similarity: 0.85,
    timestamp: "2026-05-25 17:10:43",
    tags: ["Outbound", "Prospecting"]
  },
  {
    id: "mem-4",
    agentId: "04a",
    agentName: "VP Customer Success",
    query: "TechFlow health score drop",
    recallContent: "TechFlow seat activity dropped 20% post QBR (satisfaction score 6/10). Action: trigger emergency customer check-in task.",
    similarity: 0.88,
    timestamp: "2026-05-26 09:30:19",
    tags: ["Retention", "Churn"]
  },
  {
    id: "mem-5",
    agentId: "02b",
    agentName: "Head of PLG",
    query: "PQL qualification criteria rules",
    recallContent: "Flag PQL in HubSpot when user invites more than 3 teammates within 7 days. Metric check: activation rate up by 12%.",
    similarity: 0.94,
    timestamp: "2026-05-26 16:04:55",
    tags: ["PLG", "PQL"]
  }
];

export default function InfrastructurePage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeTab, setActiveTab] = useState<"telemetry" | "registry" | "memories">("telemetry");
  const [isCompacting, setIsCompacting] = useState(false);
  const [totalMemories, setTotalMemories] = useState(2482);
  const [redundantCount, setRedundantCount] = useState(42);
  const [compactionLogs, setCompactionLogs] = useState<string[]>([
    "System standby. Next compaction scheduled in 1h 42m."
  ]);

  // Vector memory states
  const [memories, setMemories] = useState<VectorMemory[]>(initialMemories);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMemories, setFilteredMemories] = useState<VectorMemory[]>(initialMemories);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredMemories(memories);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results = memories.map(m => {
      const matches = m.query.toLowerCase().includes(q) || 
                      m.recallContent.toLowerCase().includes(q) || 
                      m.tags.some(t => t.toLowerCase().includes(q));
      return {
        ...m,
        similarity: matches ? parseFloat((0.80 + Math.random() * 0.18).toFixed(2)) : parseFloat((0.20 + Math.random() * 0.35).toFixed(2))
      };
    }).sort((a, b) => b.similarity - a.similarity);
    
    setFilteredMemories(results);
  };

  const handleDeleteMemory = (id: string) => {
    const updated = memories.filter(m => m.id !== id);
    setMemories(updated);
    setFilteredMemories(prev => prev.filter(m => m.id !== id));
    setTotalMemories(prev => Math.max(0, prev - 1));
  };

  const runCompaction = () => {
    if (isCompacting) return;
    setIsCompacting(true);
    setCompactionLogs(prev => ["Compaction triggered manually by operator.", ...prev]);

    setTimeout(() => {
      setCompactionLogs(prev => ["Scanning long-term relational vector tables...", ...prev]);
    }, 600);

    setTimeout(() => {
      setCompactionLogs(prev => ["Identifying memories below cosine similarity score of 0.65...", ...prev]);
    }, 1200);

    setTimeout(() => {
      setCompactionLogs(prev => ["Synthesizing 42 redundant client touchpoints into 3 structured knowledge graphs...", ...prev]);
    }, 2000);

    setTimeout(() => {
      setCompactionLogs(prev => ["Optimizing indexes. PGVector storage freed: 14.2 MB. Dynamic retrieval speed upgraded (+18%).", ...prev]);
      setRedundantCount(0);
      setTotalMemories(2440);
      setIsCompacting(false);
    }, 2800);
  };

  return (
    <div className="infrastructure-container">
      {/* Header */}
      <header className="header-row">
        <div>
          <h1 className="title-glow">Agentic Infrastructure</h1>
          <p className="subtitle">
            Orchestration, database gateways, vector memory layers, and 17-agent registry.
          </p>
        </div>
        <div className="tab-control">
          <button 
            className={`tab-btn ${activeTab === "telemetry" ? "active" : ""}`}
            onClick={() => setActiveTab("telemetry")}
          >
            <Layers size={14} /> Telemetry & Gateway
          </button>
          <button 
            className={`tab-btn ${activeTab === "memories" ? "active" : ""}`}
            onClick={() => setActiveTab("memories")}
          >
            <Database size={14} /> Vector Memory Search
          </button>
          <button 
            className={`tab-btn ${activeTab === "registry" ? "active" : ""}`}
            onClick={() => setActiveTab("registry")}
          >
            <FileCode size={14} /> System Registry
          </button>
        </div>
      </header>

      {activeTab === "telemetry" ? (
        <div className="telemetry-grid animated-fade">
          {/* Top Status Indicators */}
          <div className="status-grid">
            <div className="status-card">
              <div className="status-card-header">
                <span className="icon-wrapper green"><Database size={16} /></span>
                <div>
                  <h3>Primary Database</h3>
                  <p className="status-text green">Connected</p>
                </div>
              </div>
              <div className="status-card-body">
                <div className="metric-row">
                  <span>Engine</span>
                  <strong>PostgreSQL 16.2</strong>
                </div>
                <div className="metric-row">
                  <span>Schema Version</span>
                  <strong>v2.8.4 (Active)</strong>
                </div>
                <div className="metric-row">
                  <span>Connection Pool</span>
                  <strong>14 / 50 active</strong>
                </div>
              </div>
            </div>

            <div className="status-card">
              <div className="status-card-header">
                <span className="icon-wrapper blue"><Zap size={16} /></span>
                <div>
                  <h3>Tool Gateway</h3>
                  <p className="status-text blue">Operational</p>
                </div>
              </div>
              <div className="status-card-body">
                <div className="metric-row">
                  <span>Connected APIs</span>
                  <strong>14 Integrations</strong>
                </div>
                <div className="metric-row">
                  <span>Daily API Calls</span>
                  <strong>2,482 calls</strong>
                </div>
                <div className="metric-row">
                  <span>Gateway Latency</span>
                  <strong>24ms (avg)</strong>
                </div>
              </div>
            </div>

            <div className="status-card">
              <div className="status-card-header">
                <span className="icon-wrapper purple"><HardDrive size={16} /></span>
                <div>
                  <h3>Vector Database</h3>
                  <p className="status-text purple">Optimized</p>
                </div>
              </div>
              <div className="status-card-body">
                <div className="metric-row">
                  <span>Memory Indexes</span>
                  <strong>PGVector Index</strong>
                </div>
                <div className="metric-row">
                  <span>Recall Accuracy</span>
                  <strong>{(memories.length > 0 ? (memories.reduce((acc, m) => acc + m.similarity, 0) / memories.length * 100) : 87.2).toFixed(1)}% Cosine</strong>
                </div>
                <div className="metric-row">
                  <span>Storage Used</span>
                  <strong>{(totalMemories * 0.066).toFixed(1)} MB</strong>
                </div>
              </div>
            </div>

            <div className="status-card">
              <div className="status-card-header">
                <span className="icon-wrapper orange"><Activity size={16} /></span>
                <div>
                  <h3>HITL Gateway</h3>
                  <p className="status-text orange">Listening</p>
                </div>
              </div>
              <div className="status-card-body">
                <div className="metric-row">
                  <span>Approval Channel</span>
                  <strong>Slack Webhook</strong>
                </div>
                <div className="metric-row">
                  <span>HITL Gates Configured</span>
                  <strong>SDR, CS, CMO Deals</strong>
                </div>
                <div className="metric-row">
                  <span>Average HITL TTL</span>
                  <strong>12 min SLA</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Row: Token Costs and Connection Latency */}
          <div className="grid-two-col" style={{ marginBottom: '2rem' }}>
            <section className="dashboard-section glass-panel">
              <div className="section-header">
                <div className="flex-align">
                  <Activity className="header-icon" size={18} style={{ color: '#818cf8' }} />
                  <h2>GTM Agent Token & Cost Tracker</h2>
                </div>
              </div>
              <div className="analytics-token-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { agent: "🤖 Chief Marketing Officer (01)", tokens: 28900, cost: 0.58, limit: 50000, color: '#818cf8' },
                  { agent: "🤖 Chief Strategy Officer (01b)", tokens: 18400, cost: 0.37, limit: 50000, color: '#a5b4fc' },
                  { agent: "🤖 SDR Manager (03a)", tokens: 34200, cost: 0.68, limit: 50000, color: '#34d399' },
                  { agent: "🤖 Head of PLG (02b)", tokens: 22800, cost: 0.46, limit: 50000, color: '#60a5fa' },
                  { agent: "🤖 VP Customer Success (04a)", tokens: 14200, cost: 0.28, limit: 50000, color: '#bef264' }
                ].map((a, i) => (
                  <div key={i} className="token-row" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#e4e4e7' }}>
                      <strong>{a.agent}</strong>
                      <span style={{ color: '#a1a1aa' }}>
                        {a.tokens.toLocaleString()} tokens / <span style={{ color: '#34d399', fontWeight: 600 }}>${a.cost.toFixed(2)}</span>
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{
                        width: `${(a.tokens / a.limit) * 100}%`,
                        height: '100%',
                        background: `linear-gradient(to right, ${a.color}, rgba(255,255,255,0.2))`,
                        borderRadius: '3px',
                        boxShadow: `0 0 8px ${a.color}`
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-section glass-panel">
              <div className="section-header">
                <div className="flex-align">
                  <Network className="header-icon" size={18} style={{ color: '#34d399' }} />
                  <h2>Gateway API Connection Latencies</h2>
                </div>
              </div>
              <div className="latency-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                {[
                  { name: "HubSpot CRM write/sync", latency: 45, max: 150, color: '#34d399' },
                  { name: "Apollo sequence enrollment", latency: 98, max: 150, color: '#60a5fa' },
                  { name: "Clay data lookup & scoring", latency: 124, max: 150, color: '#fb923c' },
                  { name: "Slack approval gateway", latency: 24, max: 150, color: '#818cf8' },
                  { name: "Notion wiki retrieval", latency: 56, max: 150, color: '#fda4af' }
                ].map((l, i) => (
                  <div key={i} className="latency-row" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#e4e4e7' }}>
                      <strong>{l.name}</strong>
                      <span style={{ fontFamily: 'monospace', color: l.latency > 100 ? '#fb923c' : '#a1a1aa' }}>
                        {l.latency}ms
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${(l.latency / l.max) * 100}%`,
                        height: '100%',
                        background: `linear-gradient(to right, ${l.color}, rgba(255,255,255,0.2))`,
                        borderRadius: '3px',
                        boxShadow: `0 0 8px ${l.color}`
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Bottom Columns: Memory and active tools */}
          <div className="grid-two-col">
            <section className="dashboard-section glass-panel">
              <div className="section-header">
                <div className="flex-align">
                  <Cpu className="header-icon" size={18} />
                  <h2>Long-Term Memory Compactor</h2>
                </div>
                <button 
                  className={`compaction-btn ${isCompacting ? 'loading' : ''}`}
                  onClick={runCompaction}
                  disabled={isCompacting}
                >
                  <RefreshCw size={14} className={isCompacting ? "spin" : ""} />
                  {isCompacting ? "Compacting..." : "Compact Memory"}
                </button>
              </div>

              <div className="compactor-metrics">
                <div className="metric-box">
                  <span className="metric-lbl">Total Memories</span>
                  <span className="metric-val">{totalMemories.toLocaleString()}</span>
                </div>
                <div className="metric-box">
                  <span className="metric-lbl">Average Cosine</span>
                  <span className="metric-val">{(memories.length > 0 ? (memories.reduce((acc, m) => acc + m.similarity, 0) / memories.length) : 0.87).toFixed(2)}</span>
                </div>
                <div className="metric-box">
                  <span className="metric-lbl">Redundant Items</span>
                  <span className="metric-val">{redundantCount} flagged</span>
                </div>
                <div className="metric-box">
                  <span className="metric-lbl">Compactor Status</span>
                  <span className="metric-val text-green">Standby</span>
                </div>
              </div>

              <div className="console-panel">
                <div className="console-header">
                  <span className="console-dot red"></span>
                  <span className="console-dot yellow"></span>
                  <span className="console-dot green"></span>
                  <span className="console-title">Compaction Telemetry Console</span>
                </div>
                <div className="console-body">
                  {compactionLogs.map((log, i) => (
                    <div key={i} className="console-line">
                      <span className="console-time">[{new Date().toLocaleTimeString()}]</span> {log}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="dashboard-section glass-panel">
              <div className="section-header">
                <div className="flex-align">
                  <Key className="header-icon" size={18} />
                  <h2>Authorized Integrations & RBAC Keyring</h2>
                </div>
              </div>

              <div className="keyring-list">
                {[
                  { name: "Salesforce", type: "CRM / Customer Records", permissions: "Read / Write", status: "authorized" },
                  { name: "HubSpot", type: "GTM Orchestrator Database", permissions: "Read / Write / Delete", status: "authorized" },
                  { name: "Slack Link", type: "HITL Notifications Gateway", permissions: "Read / Publish", status: "authorized" },
                  { name: "Apollo.io", type: "B2B Contact Databases", permissions: "Query / Export", status: "authorized" },
                  { name: "Clay.com", type: "Enrichment & Scraping Engine", permissions: "Execute Workflow", status: "authorized" },
                  { name: "Make.com (n8n)", type: "Workflow Automations Engine", permissions: "Webhook / Trigger", status: "authorized" },
                  { name: "PostHog", type: "Product Usage Analytics Engine", permissions: "Read Events", status: "authorized" }
                ].map((k, i) => (
                  <div key={i} className="keyring-item">
                    <div className="keyring-info">
                      <strong>{k.name}</strong>
                      <span className="keyring-sub">{k.type}</span>
                    </div>
                    <div className="keyring-details">
                      <span className="keyring-permissions">{k.permissions}</span>
                      <span className="keyring-status-badge">
                        <Check size={10} className="check-icon" /> Approved
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      ) : activeTab === "memories" ? (
        <div className="memories-layout animated-fade">
          <div className="glass-panel">
            <div className="section-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <div className="flex-align">
                <Database className="header-icon" size={18} />
                <h2>Long-Term Vector Memory Registry</h2>
              </div>
              <div className="memories-search-bar">
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Search query embeddings (e.g. competitor pricing)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '0.45rem 1rem',
                      color: '#f4f4f5',
                      fontSize: '0.8rem',
                      width: '320px',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: '#a5b4fc',
                      padding: '0.45rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    Search Memories
                  </button>
                </form>
              </div>
            </div>

            <div className="table-wrapper" style={{ marginTop: '1.5rem' }}>
              {filteredMemories.length > 0 ? (
                <table className="table-data" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '180px' }}>Agent Owner</th>
                      <th style={{ width: '200px' }}>Semantic Query</th>
                      <th>Recalled Context</th>
                      <th style={{ width: '140px', textAlign: 'center' }}>Cosine Similarity</th>
                      <th style={{ width: '140px' }}>Timestamp</th>
                      <th style={{ width: '60px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMemories.map((m) => (
                      <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <td className="highlight-cell" style={{ verticalAlign: 'top', paddingTop: '1rem' }}>
                          <span style={{ fontWeight: 600, color: '#93c5fd' }}>{m.agentName}</span>
                          <div style={{ fontSize: '0.65rem', color: '#71717a', fontFamily: 'monospace', marginTop: '0.1rem' }}>AGENT_{m.agentId}</div>
                        </td>
                        <td style={{ verticalAlign: 'top', paddingTop: '1rem', color: '#e4e4e7', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          "{m.query}"
                        </td>
                        <td style={{ verticalAlign: 'top', paddingTop: '1rem', color: '#a1a1aa', fontSize: '0.75rem', lineHeight: '1.4' }}>
                          {m.recallContent}
                          <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem' }}>
                            {m.tags.map(t => (
                              <span key={t} style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                color: '#a1a1aa',
                                fontSize: '0.6rem',
                                padding: '0.1rem 0.35rem',
                                borderRadius: '4px'
                              }}>{t}</span>
                            ))}
                          </div>
                        </td>
                        <td style={{ verticalAlign: 'top', paddingTop: '1rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                            <span style={{
                              fontWeight: 'bold',
                              color: m.similarity >= 0.85 ? '#34d399' : '#818cf8',
                              fontSize: '0.8rem',
                              fontFamily: 'monospace'
                            }}>{m.similarity.toFixed(2)}</span>
                            <div style={{
                              width: '60px',
                              height: '4px',
                              background: 'rgba(255,255,255,0.05)',
                              borderRadius: '2px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${m.similarity * 100}%`,
                                height: '100%',
                                background: m.similarity >= 0.85 ? '#34d399' : '#818cf8',
                                boxShadow: `0 0 8px ${m.similarity >= 0.85 ? '#34d399' : '#818cf8'}`
                              }} />
                            </div>
                          </div>
                        </td>
                        <td style={{ verticalAlign: 'top', paddingTop: '1rem', color: '#71717a', fontSize: '0.7rem', fontFamily: 'monospace' }}>
                          {m.timestamp}
                        </td>
                        <td style={{ verticalAlign: 'top', paddingTop: '0.85rem', textAlign: 'center' }}>
                          <button
                            onClick={() => handleDeleteMemory(m.id)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              color: '#fca5a5',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.65rem',
                              transition: 'all 0.2s'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#71717a' }}>
                  <Database size={40} style={{ color: '#27272a', marginBottom: '1rem' }} />
                  <h3 style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>No Matching Memories Found</h3>
                  <p style={{ fontSize: '0.8rem', maxWidth: '360px', margin: '0 auto' }}>Try adjusting your search terms or verify that your memory compactor has indexed the desired knowledge graphs.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="registry-layout animated-fade">
          <div className="registry-sidebar">
            <div className="registry-sidebar-header">
              <h3>System Agents ({agents.length})</h3>
              <p>Click an agent to inspect JSON protocol schema</p>
            </div>
            <div className="registry-list">
              {agents.map((a) => (
                <div 
                  key={a.id} 
                  className={`registry-item-btn ${selectedAgent?.id === a.id ? "selected" : ""}`}
                  onClick={() => setSelectedAgent(a)}
                >
                  <div className="registry-item-color" style={{ backgroundColor: a.accent }}></div>
                  <div className="registry-item-meta">
                    <strong>{a.name}</strong>
                    <span>AGENT-{a.id} · {a.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="registry-viewer">
            {selectedAgent ? (
              <div className="viewer-panel">
                <div className="viewer-header">
                  <div>
                    <div className="viewer-agent-id">ID SCHEMA: synapse.agent.protocol.v2://agent_{selectedAgent.id}</div>
                    <h2>{selectedAgent.name} System Instructions</h2>
                  </div>
                  <span className="layer-pill" style={{ borderColor: selectedAgent.accent, color: selectedAgent.accent }}>
                    {selectedAgent.motion} Layer
                  </span>
                </div>

                <div className="viewer-section">
                  <h4>Underlying JSON System Configuration</h4>
                  <pre className="json-code">
                    <code>
                      {JSON.stringify({
                        agent_id: selectedAgent.id,
                        name: selectedAgent.name,
                        role: selectedAgent.tag,
                        reporting_chain: { reports_to: selectedAgent.reports },
                        authorized_tools: selectedAgent.tools,
                        kpis_tracked: selectedAgent.kpis,
                        responsibilities: selectedAgent.responsibilities,
                        autonomous_logic_condition: selectedAgent.logic,
                        system_prompt_template: `You are the ${selectedAgent.name} agent operating autonomously within Layer ${selectedAgent.layer} of the Synapse agentic ecosystem. Your core objective is ${selectedAgent.sub}. Follow your decision rules exactly. Do not exceed authorized tool limits: [${selectedAgent.tools.join(', ')}].`
                      }, null, 2)}
                    </code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="viewer-empty">
                <FileCode size={40} className="empty-icon" />
                <h3>No Agent Schema Selected</h3>
                <p>Click any agent in the left column registry list to view their underlying technical prompt template, authorized integrations, and state rules.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .infrastructure-container {
          padding-bottom: 80px;
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animated-fade {
          animation: fadeIn 0.3s ease-out;
        }
        .title-glow {
          margin: 0;
          font-size: 1.85rem;
          font-weight: 600;
          letter-spacing: -0.025em;
          background: linear-gradient(to right, #ffffff, #a1a1aa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtitle {
          margin: 0.35rem 0 0 0;
          color: #a1a1aa;
          font-size: 0.875rem;
        }
        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 1.5rem;
        }
        .tab-control {
          display: flex;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 0.25rem;
          border-radius: 10px;
          gap: 0.25rem;
        }
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: transparent;
          border: none;
          color: #71717a;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab-btn:hover {
          color: #e4e4e7;
        }
        .tab-btn.active {
          background: rgba(255, 255, 255, 0.06);
          color: #f4f4f5;
        }

        /* Telemetry grid styling */
        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .status-card {
          background: rgba(30, 30, 36, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          padding: 1.25rem;
          backdrop-filter: blur(10px);
        }
        .status-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .status-card-header h3 {
          margin: 0;
          font-size: 0.85rem;
          color: #a1a1aa;
          font-weight: 500;
        }
        .status-text {
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0.1rem 0 0 0;
        }
        .status-text.green { color: #34d399; }
        .status-text.blue { color: #60a5fa; }
        .status-text.purple { color: #818cf8; }
        .status-text.orange { color: #fb923c; }

        .icon-wrapper {
          padding: 0.45rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-wrapper.green { background: rgba(52, 211, 153, 0.1); color: #34d399; }
        .icon-wrapper.blue { background: rgba(96, 165, 250, 0.1); color: #60a5fa; }
        .icon-wrapper.purple { background: rgba(129, 140, 248, 0.1); color: #818cf8; }
        .icon-wrapper.orange { background: rgba(251, 146, 60, 0.1); color: #fb923c; }

        .status-card-body {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          padding-top: 0.75rem;
        }
        .metric-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
        }
        .metric-row span { color: #71717a; }
        .metric-row strong { color: #e4e4e7; font-weight: 500; }

        .grid-two-col {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 1.5rem;
        }
        .glass-panel {
          background: rgba(30, 30, 36, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          padding-bottom: 0.75rem;
        }
        .flex-align {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .header-icon {
          color: #818cf8;
        }
        .section-header h2 {
          margin: 0;
          font-size: 0.95rem;
          color: #f4f4f5;
          font-weight: 600;
        }
        .compaction-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(99, 102, 241, 0.15);
          border: 1px solid rgba(99, 102, 241, 0.3);
          color: #a5b4fc;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .compaction-btn:hover {
          background: rgba(99, 102, 241, 0.25);
          border-color: rgba(99, 102, 241, 0.4);
        }
        .compaction-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .spin {
          animation: spin-anim 1s linear infinite;
        }
        @keyframes spin-anim {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .compactor-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .metric-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          padding: 0.75rem;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .metric-lbl {
          font-size: 0.65rem;
          color: #71717a;
        }
        .metric-val {
          font-size: 0.85rem;
          font-weight: 600;
          color: #e4e4e7;
        }
        .metric-val.text-green {
          color: #34d399;
        }

        .console-panel {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          overflow: hidden;
        }
        .console-header {
          background: rgba(255, 255, 255, 0.03);
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        .console-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .console-dot.red { background-color: #ef4444; }
        .console-dot.yellow { background-color: #f59e0b; }
        .console-dot.green { background-color: #10b981; }
        .console-title {
          font-size: 0.65rem;
          font-family: monospace;
          color: #71717a;
          margin-left: 0.5rem;
        }
        .console-body {
          padding: 0.85rem 1rem;
          font-family: monospace;
          font-size: 0.7rem;
          color: #a1a1aa;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          max-height: 180px;
          overflow-y: auto;
          line-height: 1.4;
        }
        .console-line {
          white-space: pre-wrap;
          word-break: break-all;
        }
        .console-time {
          color: #52525b;
        }

        .keyring-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 380px;
          overflow-y: auto;
          padding-right: 0.25rem;
        }
        .keyring-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          padding: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .keyring-info {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .keyring-info strong {
          font-size: 0.8rem;
          color: #e4e4e7;
        }
        .keyring-sub {
          font-size: 0.65rem;
          color: #71717a;
        }
        .keyring-details {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }
        .keyring-permissions {
          font-size: 0.65rem;
          color: #a1a1aa;
          font-family: monospace;
        }
        .keyring-status-badge {
          font-size: 0.6rem;
          color: #34d399;
          background: rgba(52, 211, 153, 0.08);
          border: 1px solid rgba(52, 211, 153, 0.15);
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-weight: 500;
        }

        /* Registry Layout styling */
        .registry-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 1.5rem;
          min-height: 580px;
        }
        .registry-sidebar {
          background: rgba(30, 30, 36, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.25rem;
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
        }
        .registry-sidebar-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          padding-bottom: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .registry-sidebar-header h3 {
          margin: 0;
          font-size: 0.9rem;
          color: #f4f4f5;
        }
        .registry-sidebar-header p {
          margin: 0.2rem 0 0 0;
          font-size: 0.7rem;
          color: #71717a;
        }
        .registry-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          overflow-y: auto;
          flex: 1;
          max-height: 480px;
        }
        .registry-item-btn {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.65rem;
          border-radius: 8px;
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .registry-item-btn:hover {
          background: rgba(255, 255, 255, 0.02);
        }
        .registry-item-btn.selected {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.06);
        }
        .registry-item-color {
          width: 4px;
          height: 24px;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .registry-item-meta {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }
        .registry-item-meta strong {
          font-size: 0.78rem;
          color: #e4e4e7;
          font-weight: 500;
        }
        .registry-item-meta span {
          font-size: 0.62rem;
          color: #71717a;
        }

        .registry-viewer {
          background: rgba(30, 30, 36, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .viewer-panel {
          height: 100%;
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.25s ease-out;
        }
        .viewer-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          padding-bottom: 1rem;
          margin-bottom: 1.25rem;
        }
        .viewer-agent-id {
          font-family: monospace;
          font-size: 0.65rem;
          color: #71717a;
          margin-bottom: 0.2rem;
        }
        .viewer-header h2 {
          font-size: 1.15rem;
          color: #f4f4f5;
          margin: 0;
          font-weight: 600;
        }
        .layer-pill {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          border: 1px solid;
          background: rgba(255, 255, 255, 0.01);
        }
        .viewer-section h4 {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #71717a;
          margin: 0 0 0.5rem 0;
        }
        .json-code {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          padding: 1rem;
          margin: 0;
          overflow-y: auto;
          max-height: 400px;
        }
        .json-code code {
          font-family: monospace;
          font-size: 0.75rem;
          color: #a5b4fc;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-all;
        }

        .viewer-empty {
          text-align: center;
          padding: 3rem;
          color: #71717a;
          max-width: 440px;
          margin: 0 auto;
        }
        .empty-icon {
          color: #27272a;
          margin-bottom: 1rem;
        }
        .viewer-empty h3 {
          color: #a1a1aa;
          font-size: 0.95rem;
          margin: 0 0 0.5rem 0;
        }
        .viewer-empty p {
          font-size: 0.8rem;
          line-height: 1.45;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .grid-two-col {
            grid-template-columns: 1fr;
          }
          .registry-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
