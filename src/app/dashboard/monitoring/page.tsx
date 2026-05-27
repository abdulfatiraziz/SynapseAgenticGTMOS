"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  Shield, 
  Zap, 
  Terminal, 
  RefreshCw, 
  Layers, 
  Check, 
  Play, 
  Settings, 
  AlertTriangle, 
  AlertCircle, 
  Clock, 
  ShieldAlert,
  BarChart3,
  Server
} from "lucide-react";

interface AgentMetric {
  agent_id: string;
  total_calls: number;
  total_errors: number;
  avg_duration_ms: number;
  avg_tokens: number;
}

interface HITLApproval {
  id: string;
  agent_id: string;
  tool_name: string;
  action: string;
  requested_at: string;
  status: "pending" | "approved" | "denied";
}

interface AgentTrace {
  agent_id: string;
  session_id: string;
  event_type: string;
  duration_ms: number | null;
  created_at: string;
}

const mockInitialMetrics: AgentMetric[] = [
  { agent_id: "SDR Manager (03a)", total_calls: 142, total_errors: 0, avg_duration_ms: 840, avg_tokens: 1240 },
  { agent_id: "Chief Marketing Officer (01)", total_calls: 28, total_errors: 1, avg_duration_ms: 1250, avg_tokens: 2890 },
  { agent_id: "Head of RevOps (03e)", total_calls: 94, total_errors: 0, avg_duration_ms: 450, avg_tokens: 880 },
  { agent_id: "Head of PLG (02b)", total_calls: 112, total_errors: 0, avg_duration_ms: 620, avg_tokens: 1420 },
  { agent_id: "Market Intelligence (01d)", total_calls: 54, total_errors: 2, avg_duration_ms: 1840, avg_tokens: 3450 },
  { agent_id: "VP Customer Success (04a)", total_calls: 32, total_errors: 0, avg_duration_ms: 710, avg_tokens: 1100 },
];

const mockInitialApprovals: HITLApproval[] = [
  { id: "h1", agent_id: "SDR Manager (03a)", tool_name: "Apollo Outreach", action: "Enroll CEO of Acme Corp in cold sequences", requested_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(), status: "pending" },
  { id: "h2", agent_id: "Head of RevOps (03e)", tool_name: "HubSpot Write", action: "Overwrite lead source from Inbound to Direct Event", requested_at: new Date(Date.now() - 9 * 60 * 1000).toISOString(), status: "pending" }
];

const getTraceWaterfallMetrics = (eventType: string, durationMs: number | null) => {
  const type = eventType.toLowerCase();
  let startOffset = 5;
  let width = 20;
  const duration = durationMs || Math.floor(100 + Math.random() * 200);

  if (type.includes("think") || type.includes("pricing") || type.includes("scoring")) {
    startOffset = 5;
    width = Math.min(30, (duration / 1200) * 100);
  } else if (type.includes("tool_call") || type.includes("enrichment") || type.includes("lookup")) {
    startOffset = 30;
    width = Math.min(45, (duration / 1200) * 100);
  } else if (type.includes("tool_response") || type.includes("retrieved") || type.includes("success")) {
    startOffset = 70;
    width = 10;
  } else if (type.includes("approved") || type.includes("gated") || type.includes("slack") || type.includes("notified")) {
    startOffset = 80;
    width = Math.min(20, (duration / 1200) * 100);
  } else {
    startOffset = 55;
    width = Math.min(35, (duration / 1200) * 100);
  }

  return { startOffset, width, duration };
};

const mockInitialTraces: AgentTrace[] = [
  { agent_id: "SDR Manager (03a)", session_id: "s-882", event_type: "agent_think: lead triage decision", duration_ms: null, created_at: new Date(Date.now() - 30 * 1000).toISOString() },
  { agent_id: "Tool Gateway", session_id: "s-882", event_type: "tool_call: Clay Enrichment", duration_ms: 420, created_at: new Date(Date.now() - 28 * 1000).toISOString() },
  { agent_id: "Tool Gateway", session_id: "s-882", event_type: "tool_response: clay_success", duration_ms: null, created_at: new Date(Date.now() - 27 * 1000).toISOString() },
  { agent_id: "SDR Manager (03a)", session_id: "s-882", event_type: "agent_act: enroll_outbound", duration_ms: 810, created_at: new Date(Date.now() - 25 * 1000).toISOString() },
  { agent_id: "CMO Agent (01)", session_id: "s-883", event_type: "agent_think: pricing strategy audit", duration_ms: null, created_at: new Date(Date.now() - 15 * 1000).toISOString() },
];

const simulatorEvents = [
  { agent: "SDR Manager (03a)", event: "agent_think: processing new lead signups", duration: null },
  { agent: "Tool Gateway", event: "tool_call: Clay enrichment active lookup", duration: 520 },
  { agent: "Tool Gateway", event: "tool_response: profile retrieved successfully", duration: null },
  { agent: "SDR Manager (03a)", event: "agent_think: scoring profile (enrichment score: 94%)", duration: null },
  { agent: "HITL Gateway", event: "hitl_gated: outreach trigger requires review", duration: 150 },
  { agent: "Slack Portal", event: "slack_notified: approval webhook triggered", duration: null },
  { agent: "Head of RevOps (03e)", event: "agent_think: matching routing rules", duration: null },
  { agent: "Tool Gateway", event: "tool_call: HubSpot write lead data", duration: 320 },
  { agent: "Head of PLG (02b)", event: "agent_think: user invites spiked (PQL)", duration: null },
  { agent: "Market Intelligence (01d)", event: "agent_think: competitor feature update scraped", duration: null }
];

export default function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<AgentMetric[]>(mockInitialMetrics);
  const [pendingApprovals, setPendingApprovals] = useState<HITLApproval[]>(mockInitialApprovals);
  const [traces, setTraces] = useState<AgentTrace[]>(mockInitialTraces);
  const [isOffline, setIsOffline] = useState(true);
  const [systemLogs, setSystemLogs] = useState<string[]>(["Monitoring interface initialized."]);
  const traceCounterRef = useRef(0);

  useEffect(() => {
    // Attempt database check
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/agents');
        if (res.ok) {
          setIsOffline(false);
          setSystemLogs(prev => ["Connected to live database observability logs.", ...prev]);
        } else {
          throw new Error();
        }
      } catch (e) {
        setIsOffline(true);
        setSystemLogs(prev => ["Supabase API down. Running premium local-first simulation stream.", ...prev]);
      }
    };

    checkStatus();

    // Stream trace events every 3.5 seconds
    const interval = setInterval(() => {
      const randomEvent = simulatorEvents[traceCounterRef.current % simulatorEvents.length];
      traceCounterRef.current++;

      // Create new trace entry
      const newTrace: AgentTrace = {
        agent_id: randomEvent.agent,
        session_id: `s-${800 + Math.floor(Math.random() * 199)}`,
        event_type: randomEvent.event,
        duration_ms: randomEvent.duration,
        created_at: new Date().toISOString()
      };

      setTraces(prev => [newTrace, ...prev.slice(0, 39)]);

      // Randomly update metrics
      setMetrics(prev => {
        return prev.map(m => {
          const isMatch = randomEvent.agent.includes(m.agent_id.split(' ')[0]);
          if (isMatch) {
            return {
              ...m,
              total_calls: m.total_calls + 1,
              avg_duration_ms: Math.round((m.avg_duration_ms * 9 + (randomEvent.duration || 600)) / 10)
            };
          }
          return m;
        });
      });

      // Periodic logs
      setSystemLogs(prev => {
        const newLog = `Observed trace sequence [${newTrace.session_id}] from ${newTrace.agent_id} → ${newTrace.event_type}`;
        return [newLog, ...prev.slice(0, 19)];
      });

    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleApprove = (id: string, agentName: string) => {
    setPendingApprovals(prev => prev.filter(p => p.id !== id));
    
    // Inject approved trace
    const newTrace: AgentTrace = {
      agent_id: "HITL Gateway",
      session_id: "s-hitl",
      event_type: `hitl_approved: approved action for ${agentName}`,
      duration_ms: 120,
      created_at: new Date().toISOString()
    };
    
    setTraces(prev => [newTrace, ...prev]);
    setSystemLogs(prev => [`Operator APPROVED gated action for ${agentName}`, ...prev]);
  };

  const handleDeny = (id: string, agentName: string) => {
    setPendingApprovals(prev => prev.filter(p => p.id !== id));

    // Inject denied trace
    const newTrace: AgentTrace = {
      agent_id: "HITL Gateway",
      session_id: "s-hitl",
      event_type: `hitl_denied: rejected action for ${agentName}`,
      duration_ms: 95,
      created_at: new Date().toISOString()
    };

    setTraces(prev => [newTrace, ...prev]);
    setSystemLogs(prev => [`Operator REJECTED gated action for ${agentName}`, ...prev]);
  };

  return (
    <div className="monitoring-container">
      {/* Header */}
      <header className="header-row">
        <div>
          <h1 className="title-glow">Live Observability</h1>
          <p className="subtitle">Real-time multi-agent tracing, latency waterfalls, and HITL gate tracking.</p>
        </div>
        <div className="status-badge">
          <span className="pulse"></span> 
          {isOffline ? "Sandbox Simulator Active" : "Supabase Linked"}
        </div>
      </header>

      {/* Main Grid */}
      <main className="grid-main">
        {/* LEFT COLUMN */}
        <div className="left-col">
          <section className="glass-card">
            <div className="card-header">
              <BarChart3 size={16} className="card-icon blue" />
              <h2>Active Agent Metrics</h2>
            </div>
            <div className="table-wrapper">
              <table className="table-data">
                <thead>
                  <tr>
                    <th>Agent Node</th>
                    <th>Calls</th>
                    <th>Errors</th>
                    <th>Avg Latency</th>
                    <th>Avg Tokens</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((m) => (
                    <tr key={m.agent_id}>
                      <td className="highlight-cell">{m.agent_id}</td>
                      <td>{m.total_calls}</td>
                      <td className={m.total_errors > 0 ? "error-cell" : ""}>
                        {m.total_errors}
                      </td>
                      <td>{m.avg_duration_ms}ms</td>
                      <td>{m.avg_tokens}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="glass-card">
            <div className="card-header">
              <Shield size={16} className="card-icon orange" />
              <h2>HITL Action Queue</h2>
            </div>
            {pendingApprovals.length > 0 ? (
              <div className="hitl-grid">
                {pendingApprovals.map((h) => (
                  <div key={h.id} className="hitl-card">
                    <div className="hitl-header">
                      <span className="hitl-agent">{h.agent_id}</span>
                      <span className="hitl-time">
                        {new Date(h.requested_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="hitl-action">
                      <strong>{h.tool_name}</strong>
                      <p>{h.action}</p>
                    </div>
                    <div className="hitl-footer">
                      <span className="hitl-status-badge">Awaiting operator approval</span>
                      <div className="hitl-actions-buttons">
                        <button className="hitl-btn deny" onClick={() => handleDeny(h.id, h.agent_id)}>Reject</button>
                        <button className="hitl-btn approve" onClick={() => handleApprove(h.id, h.agent_id)}>Approve</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Check size={28} className="check-icon" />
                <p>No actions pending human approval. Safe & autonomous.</p>
              </div>
            )}
          </section>

          {/* System logs console */}
          <section className="glass-card logs-card">
            <div className="card-header">
              <Terminal size={16} className="card-icon purple" />
              <h2>Observability System Logs</h2>
            </div>
            <div className="logs-console">
              {systemLogs.map((log, i) => (
                <div key={i} className="log-line">
                  <span className="log-arrow">→</span> {log}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="right-col">
          <section className="glass-card traces-card">
            <div className="card-header">
              <Server size={16} className="card-icon green" />
              <h2>Live Trace Waterfall</h2>
            </div>
            <div className="trace-stream">
              {traces.map((t, i) => {
                const isError = t.event_type.includes('error') || t.event_type.includes('block') || t.event_type.includes('denied');
                const isHitl = t.event_type.includes('hitl') || t.event_type.includes('slack') || t.event_type.includes('gated');
                const waterfall = getTraceWaterfallMetrics(t.event_type, t.duration_ms);
                
                return (
                  <div key={i} className={`trace-item ${isError ? 'trace-error' : ''} ${isHitl ? 'trace-hitl' : ''}`}>
                    <div className="trace-time">
                      {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                    <div className="trace-details">
                      <span className="trace-agent">{t.agent_id}</span>
                      <span className="trace-type">{t.event_type}</span>
                    </div>
                    <div className="trace-waterfall-container" style={{
                      height: '6px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '3px',
                      position: 'relative',
                      overflow: 'hidden',
                      width: '100%',
                      minWidth: '80px'
                    }}>
                      <div style={{
                        position: 'absolute',
                        left: `${waterfall.startOffset}%`,
                        width: `${waterfall.width}%`,
                        height: '100%',
                        borderRadius: '3px',
                        background: isError ? '#ef4444' : isHitl ? '#fb923c' : '#818cf8',
                        boxShadow: `0 0 8px ${isError ? '#ef4444' : isHitl ? '#fb923c' : '#818cf8'}`
                      }} />
                    </div>
                    <div className="trace-metric" style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                      {waterfall.duration}ms
                    </div>
                  </div>
                );
              })}
              {traces.length === 0 && (
                <div className="empty-msg">No recent events recorded.</div>
              )}
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        .monitoring-container {
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
        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
          padding: 0.45rem 1rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }
        .pulse {
          width: 8px;
          height: 8px;
          background-color: #818cf8;
          border-radius: 50%;
          box-shadow: 0 0 8px #818cf8;
          animation: pulse-glow 2s infinite;
        }
        @keyframes pulse-glow {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(99, 102, 241, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }

        .grid-main {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 1.5rem;
        }
        .left-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .right-col {
          display: flex;
          flex-direction: column;
        }

        .glass-card {
          background: rgba(30, 30, 36, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          padding-bottom: 0.75rem;
        }
        .card-icon {
          flex-shrink: 0;
        }
        .card-icon.blue { color: #60a5fa; }
        .card-icon.orange { color: #fb923c; }
        .card-icon.purple { color: #a5b4fc; }
        .card-icon.green { color: #34d399; }
        
        .card-header h2 {
          margin: 0;
          font-size: 0.95rem;
          color: #f4f4f5;
          font-weight: 600;
        }

        /* TABLE */
        .table-wrapper {
          overflow-x: auto;
        }
        .table-data {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
        }
        .table-data th {
          text-align: left;
          padding: 0.75rem 1rem;
          color: #71717a;
          font-weight: 500;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        .table-data td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          color: #e4e4e7;
        }
        .highlight-cell {
          color: #60a5fa !important;
          font-weight: 500;
          font-family: monospace;
        }
        .error-cell {
          color: #f87171 !important;
          font-weight: 600;
        }

        /* HITL ACTIONS */
        .hitl-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .hitl-card {
          background: rgba(251, 146, 60, 0.04);
          border: 1px solid rgba(251, 146, 60, 0.15);
          border-radius: 10px;
          padding: 1rem;
        }
        .hitl-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .hitl-agent {
          font-family: monospace;
          color: #fb923c;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .hitl-time {
          color: #71717a;
          font-size: 0.7rem;
        }
        .hitl-action strong {
          color: #f4f4f5;
          font-size: 0.85rem;
        }
        .hitl-action p {
          color: #a1a1aa;
          font-size: 0.8rem;
          margin: 0.2rem 0 0.75rem 0;
        }
        .hitl-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.02);
          padding-top: 0.65rem;
        }
        .hitl-status-badge {
          font-size: 0.7rem;
          color: #fb923c;
          background: rgba(251, 146, 60, 0.08);
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          font-weight: 500;
        }
        .hitl-actions-buttons {
          display: flex;
          gap: 0.4rem;
        }
        .hitl-btn {
          border: none;
          padding: 0.3rem 0.75rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .hitl-btn.deny {
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
        }
        .hitl-btn.deny:hover {
          background: rgba(239, 68, 68, 0.25);
        }
        .hitl-btn.approve {
          background: rgba(52, 211, 153, 0.15);
          color: #6ee7b7;
        }
        .hitl-btn.approve:hover {
          background: rgba(52, 211, 153, 0.25);
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: #71717a;
          text-align: center;
        }
        .check-icon {
          color: #34d399;
          margin-bottom: 0.5rem;
          box-shadow: 0 0 15px rgba(52, 211, 153, 0.1);
        }

        /* CONSOLE LOGS */
        .logs-console {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          max-height: 160px;
          overflow-y: auto;
          font-family: monospace;
          font-size: 0.72rem;
          color: #a1a1aa;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .log-line {
          line-height: 1.35;
        }
        .log-arrow {
          color: #a5b4fc;
        }

        /* WATERFALL TRACE STREAM */
        .traces-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          max-height: 680px;
        }
        .trace-stream {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          overflow-y: auto;
          flex: 1;
          padding-right: 0.25rem;
        }
        .trace-item {
          display: grid;
          grid-template-columns: 75px 1.5fr 1.2fr 60px;
          gap: 0.75rem;
          align-items: center;
          padding: 0.65rem 0.85rem;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          border-left: 2px solid transparent;
          font-size: 0.72rem;
          transition: all 0.2s;
        }
        .trace-item:hover {
          background: rgba(255, 255, 255, 0.02);
          border-color: rgba(255, 255, 255, 0.05);
        }
        .trace-time {
          color: #52525b;
          font-family: monospace;
        }
        .trace-details {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }
        .trace-agent {
          color: #71717a;
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 500;
        }
        .trace-type {
          color: #e4e4e7;
        }
        .trace-metric {
          text-align: right;
          color: #71717a;
          font-family: monospace;
        }
        .trace-error {
          border-left-color: #ef4444;
          background: rgba(239, 68, 68, 0.03);
          border-color: rgba(239, 68, 68, 0.08);
        }
        .trace-error .trace-type {
          color: #f87171;
        }
        .trace-hitl {
          border-left-color: #f59e0b;
          background: rgba(245, 158, 11, 0.03);
          border-color: rgba(245, 158, 11, 0.08);
        }
        .trace-hitl .trace-type {
          color: #fcd34d;
        }

        .empty-msg {
          text-align: center;
          color: #52525b;
          padding: 2rem;
          font-style: italic;
        }

        @media (max-width: 1024px) {
          .grid-main {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
