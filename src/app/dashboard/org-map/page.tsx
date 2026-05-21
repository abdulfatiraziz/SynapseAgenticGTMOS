"use client";

import React, { useEffect, useState } from 'react';
import { 
  Shield, 
  Zap, 
  TrendingUp, 
  Cpu, 
  Database, 
  Mail, 
  Target, 
  Users, 
  BarChart3, 
  AlertCircle, 
  X, 
  CheckCircle,
  Network
} from 'lucide-react';

const localAgents = [
  { id: "01",  name: "Chief Marketing Officer",    layer: 1, role: "C-Suite", sub: "ICP · Messaging · Budget allocation", reports: "CEO", tools_required: ["HubSpot","MarketIntel","Notion","Slack"], responsibilities: ["Owns overall GTM strategy","Defines and locks ICP","Sets demand gen budget","Aligns all motions"], kpis: ["Pipeline from marketing","CAC","Win-rate uplift","Marketing-sourced revenue %"], logic: "IF MarketIntel shows competitor pivot → Trigger 03c rebuttal content", status: "active" },
  { id: "01b", name: "Chief Strategy Officer",     layer: 1, role: "C-Suite", sub: "Long-term roadmap · Ecosystem design", reports: "CEO", tools_required: ["HubSpot","MarketIntel","Make"], responsibilities: ["GTM architecture oversight","Partner strategy","Board reporting"], kpis: ["Strategic initiative completion","Partner revenue %"], logic: "IF PQL rate drops → Audit 02b onboarding flow", status: "idle" },
  { id: "01c", name: "GTM Engineer",               layer: 1, role: "IC / Builder", sub: "System integration · Workflow debugging", reports: "CSO", tools_required: ["Make","Gumloop","Supabase"], responsibilities: ["API bridge building","Agentic workflow debugging","Tool health monitoring"], kpis: ["Uptime %","Integration cycle time"], logic: "IF any Agent reports 'API Down' → Restart Make scenario", status: "active" },
  { id: "01d", name: "Market Intelligence Analyst", layer: 1, role: "IC / Analyst", sub: "Competitor tracking · ICP research", reports: "VP PMM", tools_required: ["MarketIntel","GoogleAnalytics","Notion"], responsibilities: ["Real-time grounded search","Competitor feature tracking","Industry trend synthesis"], kpis: ["ICP match rate","Competitive win-rate trend"], logic: "ALWAYS search 'Synapse competitors' EVERY 24 h", status: "active" },
  { id: "02a", name: "VP Sales (SLG)",              layer: 2, role: "Sales-Led", sub: "Enterprise deal cycles · Top-down", reports: "CRO", tools_required: ["Apollo","Clay","Slack","HubSpot"], responsibilities: ["Outbound sequence strategy","Lead triage management","SDR coaching"], kpis: ["SQLs per month","Pipeline from outbound","Meeting → Opp rate"], logic: "IF Clay enrichment score > 80 → Send to 03a", status: "idle" },
  { id: "02b", name: "Head of PLG",                 layer: 2, role: "Product-Led", sub: "Self-serve · PQL engine · Activation", reports: "CPO / CMO", tools_required: ["PostHog","HubSpot","Slack","Notion"], responsibilities: ["PQL scoring model","Activation tracking","Self-serve conversion"], kpis: ["Activation rate","Time-to-value","PQL → SQL rate","Product-sourced revenue %"], logic: "IF user invites 3 teammates → Flag PQL in HubSpot", status: "active" },
  { id: "02c", name: "Head of Community",            layer: 2, role: "Community-Led", sub: "Evangelist network · Peer trust", reports: "CMO", tools_required: ["Slack","LinkedIn","Notion"], responsibilities: ["Channel creation","Intent listening","Member sentiment analysis"], kpis: ["Community DAU","Community-sourced pipeline %","Referral rate"], logic: "IF keyword 'pricing' in Slack → Notify 03e", status: "idle" },
  { id: "02d", name: "VP Partnerships",              layer: 2, role: "Partner-Led", sub: "Co-sell · Resellers · Evangelist influence", reports: "CRO", tools_required: ["HubSpot","MarketIntel","Slack","LinkedIn"], responsibilities: ["Partner account mapping","Co-selling orchestration","Warm intro management"], kpis: ["Partner-sourced revenue %","Partner-influenced pipeline","Time-to-first-deal"], logic: "IF deal has 'evangelist' status → Request intro from partner", status: "idle" },
  { id: "03a", name: "SDR Manager",                 layer: 3, role: "Outbound", sub: "Outbound pipeline · Sequences", reports: "VP Sales", tools_required: ["Apollo","Clay","HubSpot","Slack"], responsibilities: ["Cold emailing at scale","Meeting booking","Personalized outreach"], kpis: ["Emails sent","Reply rate","Meetings booked","Pipeline $"], logic: "IF lead opens email 3× → Call via Zoom", status: "active" },
  { id: "03b", name: "Demand Gen Manager",           layer: 3, role: "Inbound + Paid", sub: "Paid ads · Inbound · Attribution", reports: "CMO", tools_required: ["GoogleAds","MetaAds","GoogleAnalytics","MarketIntel"], responsibilities: ["Ad spend optimization","Funnel analysis","ABM plays"], kpis: ["MQL volume","Cost per MQL","ROAS by channel","ABM engagement"], logic: "IF CAC > $500 → Pause LinkedIn campaign", status: "idle" },
  { id: "03c", name: "Content & SEO Lead",           layer: 3, role: "Organic", sub: "Organic traffic · Social voice", reports: "CMO", tools_required: ["LinkedIn","Instagram","MarketIntel"], responsibilities: ["Daily AI-powered posting","Engagement tracking","Keyword strategy"], kpis: ["Organic traffic growth","Content-influenced pipeline","Domain authority"], logic: "IF PostHog shows interest in 'Agents' → Post on LinkedIn", status: "active" },
  { id: "03d", name: "Field & Events Manager",       layer: 3, role: "Events", sub: "Webinars · Conferences · Lead triage", reports: "CMO / VP Sales", tools_required: ["Zoom","Google","HubSpot","Slack"], responsibilities: ["Webinar-to-pipeline triage","Post-event follow-up","Registration management"], kpis: ["Event-sourced pipeline $","Attendee → meeting rate","Cost per opp"], logic: "IF attendee stayed > 45 min → Flag high-intent for 03a", status: "idle" },
  { id: "03e", name: "Head of RevOps",               layer: 3, role: "Nervous System", sub: "CRM · Routing · Forecasting · Data", reports: "CRO / CFO", tools_required: ["Make","Gumloop","HubSpot","Clay"], responsibilities: ["Lead routing automation","CRM data hygiene","Tech stack governance"], kpis: ["Routing speed","Forecast accuracy","CRM completeness"], logic: "IF Lead Source = 'Webinar' → Route to 03d immediately", status: "active" },
  { id: "04a", name: "VP Customer Success",          layer: 4, role: "Retain", sub: "Health scores · QBRs · Churn prevention", reports: "CRO", tools_required: ["HubSpot","PostHog","Notion"], responsibilities: ["NRR oversight","QBR orchestration","Churn signal monitoring"], kpis: ["NRR — target 110%+","GRR","Churn rate","Time-to-onboard"], logic: "IF Health Score < 50 → Trigger churn task for 04b", status: "active" },
  { id: "04b", name: "Customer Success Manager",     layer: 4, role: "Retain", sub: "Onboarding · Activation · Renewals", reports: "VP CS", tools_required: ["HubSpot","Slack","Zoom"], responsibilities: ["Account health checks","Product adoption coaching","Structured onboarding"], kpis: ["Renewal rate","Health score distribution","CSAT / NPS"], logic: "IF product usage drops 20% → Schedule check-in call", status: "idle" },
  { id: "04c", name: "Expansion Account Executive",  layer: 4, role: "Grow", sub: "Upsell · Cross-sell · Seat expansion", reports: "VP Sales", tools_required: ["HubSpot","Apollo","LinkedIn"], responsibilities: ["Identifying expansion signals","Running upsell cycles","Contract amendments"], kpis: ["Expansion ARR","Upsell win rate","Avg expansion deal size"], logic: "IF customer at 90% seat limit → Send expansion proposal", status: "idle" },
  { id: "04d", name: "Renewals Manager",              layer: 4, role: "Grow", sub: "At-risk accounts · NRR defence", reports: "VP CS", tools_required: ["HubSpot","Notion","Slack"], responsibilities: ["Renewal pipeline management","Multi-year negotiation","NRR forecasting"], kpis: ["On-time renewal rate","Churn save rate","Multi-year attach rate"], logic: "IF renewal in 90 days → Notify 04a", status: "idle" }
];

const levelInfo: Record<number, { title: string, description: string, color: string }> = {
  1: { title: "Layer 1: Strategy Foundation", description: "Defines ICP, messaging, pricing, and market intelligence.", color: "#818cf8" },
  2: { title: "Layer 2: GTM Motions (Engines)", description: "Owns the core revenue engines: Sales, PLG, Community, Partners.", color: "#34d399" },
  3: { title: "Layer 3: Channels & Levers", description: "Executes day-to-day operations and pipeline generation.", color: "#60a5fa" },
  4: { title: "Layer 4: CS & Expansion (NRR)", description: "Protects and grows existing revenue through renewals and upsells.", color: "#fb7185" }
};

export default function OrgMap() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchAgents = async () => {
      try {
        const res = await fetch('/api/agents');
        if (!res.ok) {
          throw new Error('API server down');
        }
        const json = await res.json();
        
        if (json.data && json.data.length > 0) {
          if (isMounted) {
            // Merge status values into fetched agents or keep what they have
            const augmented = json.data.map((a: any) => {
              const localMatch = localAgents.find(la => la.name === a.name || la.id === a.id);
              return {
                ...a,
                status: a.status || localMatch?.status || 'idle',
                reports: a.reports || localMatch?.reports || 'CEO',
                logic: a.logic || localMatch?.logic || 'No logic loaded',
                kpis: a.kpis || localMatch?.kpis || ['Active task completion'],
                responsibilities: a.responsibilities || localMatch?.responsibilities || ['Coordinate operations']
              };
            });
            setAgents(augmented);
            setIsOffline(false);
          }
        } else {
          throw new Error("No database records");
        }
      } catch (err: any) {
        console.warn("API Offline, falling back to local GTM 17-agent registry:", err.message);
        if (isMounted) {
          setAgents(localAgents);
          setIsOffline(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAgents();
    
    // Poll every 10 seconds for updates in background
    const interval = setInterval(fetchAgents, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading GTM Autonomous Network...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
            color: #fafafa;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.05);
            border-top: 3px solid #6366f1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .loading-text {
            font-size: 0.95rem;
            color: #a1a1aa;
            font-family: monospace;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="org-map-container">
      <div className="header-row">
        <div>
          <h1 className="title-glow">Autonomous Organization Map</h1>
          <p className="subtitle">
            Dynamic structure of Synapse Level 3 Multi-Agent GTM System.
          </p>
        </div>
        <div className="header-controls">
          {isOffline ? (
            <div className="sandbox-badge">
              <span className="sandbox-dot"></span>
              Offline GTM Registry
            </div>
          ) : (
            <div className="live-badge">
              <span className="live-dot"></span>
              Live DB Synced
            </div>
          )}
          <div className="status-legend">
            <span className="legend-item"><span className="dot active"></span> Active</span>
            <span className="legend-item"><span className="dot idle"></span> Idle</span>
          </div>
        </div>
      </div>

      <div className="hierarchy-tree">
        {[1, 2, 3, 4].map((layer) => {
          const layerAgents = agents.filter(a => Number(a.layer) === layer);
          if (layerAgents.length === 0) return null;

          const layerMeta = levelInfo[layer];

          return (
            <div key={layer} className="hierarchy-level">
              <div className="level-info" style={{ borderLeft: `3px solid ${layerMeta.color}` }}>
                <h2>{layerMeta.title}</h2>
                <p>{layerMeta.description}</p>
              </div>
              <div className="agents-grid">
                {layerAgents.map((agent) => {
                  const tools = agent.tools_required || agent.tools || [];
                  return (
                    <div 
                      key={agent.id} 
                      className={`agent-node-card ${selectedAgent?.id === agent.id ? 'selected' : ''}`}
                      onClick={() => setSelectedAgent(agent)}
                    >
                      <div className="agent-status-indicator" data-status={agent.status || 'idle'}></div>
                      <div className="agent-header">
                        <h3>{agent.name}</h3>
                        <span className="agent-role-tag">{agent.role || 'GTM Officer'}</span>
                      </div>
                      <div className="agent-persona">
                        <p>"{agent.sub || 'Autonomous operational node.'}"</p>
                      </div>
                      <div className="agent-tools">
                        {tools.slice(0, 3).map((tool: string, i: number) => (
                          <span key={i} className="tool-tag">{tool}</span>
                        ))}
                        {tools.length > 3 && (
                          <span className="tool-tag-more">+{tools.length - 3}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {layer < 4 && <div className="level-connector"></div>}
            </div>
          );
        })}
      </div>

      {/* Sliding Details Drawer */}
      <div className={`drawer-overlay ${selectedAgent ? 'open' : ''}`} onClick={() => setSelectedAgent(null)}>
        <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
          {selectedAgent && (
            <>
              <div className="drawer-header">
                <div>
                  <div className="drawer-meta">
                    <span className="agent-id-badge">ID: {selectedAgent.id}</span>
                    <span className={`status-pill ${selectedAgent.status || 'idle'}`}>
                      {selectedAgent.status === 'active' ? 'Active Workflow' : 'Idle Standby'}
                    </span>
                  </div>
                  <h2>{selectedAgent.name}</h2>
                  <p className="drawer-role-desc">{selectedAgent.role || 'GTM Officer'} · Reports to {selectedAgent.reports || 'CEO'}</p>
                </div>
                <button className="close-btn" onClick={() => setSelectedAgent(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="drawer-body">
                <div className="drawer-section">
                  <h4>Core Objectives & Scope</h4>
                  <p className="drawer-subtext">"{selectedAgent.sub || 'Autonomous operational node.'}"</p>
                </div>

                <div className="drawer-section">
                  <h4>Key Performance Indicators (KPIs)</h4>
                  <ul className="kpi-list">
                    {(selectedAgent.kpis || []).map((k: string, i: number) => (
                      <li key={i}>
                        <CheckCircle size={14} className="kpi-icon" />
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="drawer-section">
                  <h4>Connected Integrations & Tools</h4>
                  <div className="drawer-tools-grid">
                    {(selectedAgent.tools_required || selectedAgent.tools || []).map((tool: string, i: number) => (
                      <span key={i} className="drawer-tool-badge">{tool}</span>
                    ))}
                  </div>
                </div>

                <div className="drawer-section">
                  <h4>Autonomous Decision Protocol</h4>
                  <pre className="decision-code">
                    <code>{`// System execution logic:\n${selectedAgent.logic || '// standby standard agent loops'}`}</code>
                  </pre>
                </div>

                <div className="drawer-section">
                  <h4>Workflow Responsibilities</h4>
                  <ul className="resp-list">
                    {(selectedAgent.responsibilities || []).map((r: string, i: number) => (
                      <li key={i}>• {r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .org-map-container {
          padding-bottom: 80px;
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
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
        .header-controls {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .sandbox-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
          padding: 0.4rem 0.85rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid rgba(99, 102, 241, 0.25);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .sandbox-dot {
          width: 6px;
          height: 6px;
          background-color: #818cf8;
          border-radius: 50%;
          box-shadow: 0 0 8px #818cf8;
        }
        .live-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(52, 211, 153, 0.1);
          color: #34d399;
          padding: 0.4rem 0.85rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid rgba(52, 211, 153, 0.25);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .live-dot {
          width: 6px;
          height: 6px;
          background-color: #34d399;
          border-radius: 50%;
          box-shadow: 0 0 8px #34d399;
        }
        .status-legend {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: #a1a1aa;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .dot.active { background: #34d399; box-shadow: 0 0 6px #34d399; }
        .dot.idle { background: #52525b; }

        .hierarchy-tree {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
        .hierarchy-level {
          position: relative;
        }
        .level-info {
          margin-bottom: 1.5rem;
          padding-left: 1rem;
        }
        .level-info h2 {
          font-size: 1.05rem;
          font-weight: 600;
          color: #f4f4f5;
          margin: 0;
        }
        .level-info p {
          color: #71717a;
          font-size: 0.85rem;
          margin: 0.2rem 0 0 0;
        }
        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        .agent-node-card {
          background: rgba(30, 30, 36, 0.4);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          padding: 1.25rem;
          position: relative;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .agent-node-card:hover {
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
          background: rgba(40, 40, 48, 0.5);
        }
        .agent-node-card.selected {
          border-color: rgba(99, 102, 241, 0.5);
          background: rgba(99, 102, 241, 0.04);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.15);
        }
        .agent-status-indicator {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .agent-status-indicator[data-status="active"] {
          background: #34d399;
          box-shadow: 0 0 8px #34d399;
        }
        .agent-status-indicator[data-status="idle"] {
          background: #52525b;
        }
        .agent-header h3 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: #f4f4f5;
        }
        .agent-role-tag {
          font-size: 0.7rem;
          background: rgba(255, 255, 255, 0.04);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          color: #a1a1aa;
          margin-top: 0.35rem;
          display: inline-block;
          border: 1px solid rgba(255, 255, 255, 0.02);
          font-family: monospace;
        }
        .agent-persona {
          margin: 1rem 0;
          font-style: italic;
          font-size: 0.8rem;
          color: #d4d4d8;
          border-left: 2px solid rgba(99, 102, 241, 0.4);
          padding-left: 0.75rem;
          line-height: 1.4;
          min-height: 36px;
        }
        .agent-tools {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          align-items: center;
        }
        .tool-tag {
          font-size: 0.65rem;
          background: rgba(99, 102, 241, 0.08);
          color: #a5b4fc;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          border: 1px solid rgba(99, 102, 241, 0.15);
        }
        .tool-tag-more {
          font-size: 0.65rem;
          color: #71717a;
          padding: 0.15rem 0.3rem;
          font-weight: 500;
        }
        .level-connector {
          height: 30px;
          width: 1px;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.08), transparent);
          margin: 1.5rem auto 0;
        }

        /* sliding drawer styles */
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .drawer-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        .drawer-container {
          position: fixed;
          top: 0;
          right: -460px;
          width: 440px;
          height: 100vh;
          background: rgba(18, 18, 22, 0.95);
          backdrop-filter: blur(25px);
          border-left: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.6);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 2.25rem 1.75rem;
          overflow-y: auto;
        }
        .drawer-overlay.open .drawer-container {
          right: 0;
        }
        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 1.5rem;
          margin-bottom: 1.75rem;
        }
        .drawer-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .agent-id-badge {
          font-family: monospace;
          font-size: 0.75rem;
          color: #818cf8;
          font-weight: 600;
          background: rgba(99, 102, 241, 0.1);
          padding: 0.1rem 0.5rem;
          border-radius: 4px;
        }
        .status-pill {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          padding: 0.1rem 0.45rem;
          border-radius: 4px;
        }
        .status-pill.active {
          background: rgba(52, 211, 153, 0.1);
          color: #34d399;
          border: 1px solid rgba(52, 211, 153, 0.2);
        }
        .status-pill.idle {
          background: rgba(255, 255, 255, 0.04);
          color: #a1a1aa;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .drawer-header h2 {
          font-size: 1.35rem;
          font-weight: 600;
          color: #f4f4f5;
          margin: 0.25rem 0 0 0;
        }
        .drawer-role-desc {
          margin: 0.25rem 0 0 0;
          font-size: 0.85rem;
          color: #71717a;
        }
        .close-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #a1a1aa;
          border-radius: 8px;
          padding: 0.35rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .close-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #f4f4f5;
        }
        .drawer-body {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .drawer-section h4 {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #71717a;
          margin: 0 0 0.65rem 0;
        }
        .drawer-subtext {
          font-size: 0.9rem;
          color: #e4e4e7;
          line-height: 1.5;
          font-style: italic;
          margin: 0;
        }
        .kpi-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .kpi-list li {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.85rem;
          color: #d4d4d8;
        }
        .kpi-icon {
          color: #34d399;
          flex-shrink: 0;
        }
        .drawer-tools-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .drawer-tool-badge {
          font-size: 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #e4e4e7;
          padding: 0.25rem 0.65rem;
          border-radius: 6px;
          font-weight: 500;
        }
        .decision-code {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          padding: 0.85rem 1rem;
          margin: 0;
          overflow-x: auto;
        }
        .decision-code code {
          font-family: monospace;
          font-size: 0.75rem;
          color: #fcd34d;
          line-height: 1.5;
        }
        .resp-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .resp-list li {
          font-size: 0.85rem;
          color: #d4d4d8;
          line-height: 1.45;
        }
      `}</style>
    </div>
  );
}
