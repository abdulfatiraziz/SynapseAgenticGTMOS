"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  MessageSquare,
  FileText,
  Terminal, 
  Check, 
  X, 
  CheckCircle, 
  Database, 
  Network, 
  GitBranch, 
  RefreshCw, 
  Layers, 
  AlertCircle,
  HelpCircle,
  Activity,
  Zap,
  Cpu,
  Mail,
  TrendingUp
} from "lucide-react";

interface VisualNode {
  id: string;
  label: string;
  type: "trigger" | "agent" | "tool" | "gate" | "db";
  icon: any;
  x: number; // percentage or px
  y: number; // percentage or px
  subText?: string;
}

interface Connection {
  from: string;
  to: string;
}

interface Playbook {
  id: string;
  name: string;
  description: string;
  nodes: VisualNode[];
  connections: Connection[];
  steps: {
    nodeId: string;
    log: string;
    actionType: "think" | "call_tool" | "hitl" | "done";
  }[];
}

const playbooks: Playbook[] = [
  {
    id: "inbound_triage",
    name: "Strategic Lead Inbound Triage",
    description: "Lead Webhook ──► RevOps Lead ──► Clay Enrichment ──► SDR Personalization ──► HITL Slack Gate ──► HubSpot",
    nodes: [
      { id: "lead_in", label: "Lead Webhook", type: "trigger", icon: Zap, x: 50, y: 180, subText: "Inbound Hook" },
      { id: "revops_lead", label: "RevOps Lead (03e)", type: "agent", icon: Cpu, x: 220, y: 180, subText: "Routing Protocol" },
      { id: "clay_enrich", label: "Clay enrichment", type: "tool", icon: Network, x: 390, y: 80, subText: "Data Scraping" },
      { id: "sdr_manager", label: "SDR Manager (03a)", type: "agent", icon: Mail, x: 560, y: 180, subText: "Outbound Logic" },
      { id: "slack_gate", label: "HITL Slack Gate", type: "gate", icon: MessageSquare, x: 730, y: 180, subText: "Manual Approve" },
      { id: "hubspot_db", label: "HubSpot CRM", type: "db", icon: Database, x: 900, y: 180, subText: "Synapse Records" },
    ],
    connections: [
      { from: "lead_in", to: "revops_lead" },
      { from: "revops_lead", to: "clay_enrich" },
      { from: "clay_enrich", to: "sdr_manager" },
      { from: "sdr_manager", to: "slack_gate" },
      { from: "slack_gate", to: "hubspot_db" },
    ],
    steps: [
      { nodeId: "lead_in", log: "Inbound webhook triggered: New signup from 'Arise Tech' (Annual Revenue $12M, CEO name: Sarah Jenkins).", actionType: "think" },
      { nodeId: "revops_lead", log: "RevOps Lead Agent assessing lead metadata. Route selected: Enterprise Outbound Path.", actionType: "think" },
      { nodeId: "clay_enrich", log: "Tool Gateway call: Querying Clay API to extract LinkedIn profile & corporate emails for Sarah Jenkins.", actionType: "call_tool" },
      { nodeId: "clay_enrich", log: "Tool Gateway return: LinkedIn verified, corporate email matched: sjenkins@arisetech.io (Cosine similarity: 0.94)", actionType: "done" },
      { nodeId: "sdr_manager", log: "SDR Manager Agent compiling custom outreach template using Clay corporate context.", actionType: "think" },
      { nodeId: "sdr_manager", log: "SDR Manager generated proposal: 'Arise Tech + Synapse Multi-Agent GTM System proposal'. Triggering Slack gate...", actionType: "call_tool" },
      { nodeId: "slack_gate", log: "HITL GATEWAY: Paused. Awaiting manual operator approval in Slack channel...", actionType: "hitl" },
      { nodeId: "hubspot_db", log: "Operator approved outreach. Synapse enrolling Sarah Jenkins in Apollo Sequence 4; HubSpot CRM Deal created ($45k forecast).", actionType: "done" }
    ]
  },
  {
    id: "competitor_pivot",
    name: "Competitor Pricing Shift Response",
    description: "Competitor Alert ──► Market Intel ──► VP PMM ──► Demand Gen Ads ──► Content Lead SEO",
    nodes: [
      { id: "alert_in", label: "Competitor Alert", type: "trigger", icon: Zap, x: 50, y: 180, subText: "Pricing drop" },
      { id: "market_analyst", label: "Market Intel (01d)", type: "agent", icon: Cpu, x: 220, y: 180, subText: "Grounded Search" },
      { id: "vp_pmm", label: "VP PMM Agent", type: "agent", icon: Layers, x: 420, y: 180, subText: "Battlecard Builder" },
      { id: "demand_ads", label: "Demand Gen Ads", type: "tool", icon: TrendingUp, x: 620, y: 80, subText: "LinkedIn campaigns" },
      { id: "content_lead", label: "Content Lead (03c)", type: "agent", icon: FileText, x: 620, y: 280, subText: "SEO brief" },
      { id: "slack_notif", label: "Slack Notify", type: "gate", icon: MessageSquare, x: 820, y: 180, subText: "HITL Report" },
    ],
    connections: [
      { from: "alert_in", to: "market_analyst" },
      { from: "market_analyst", to: "vp_pmm" },
      { from: "vp_pmm", to: "demand_ads" },
      { from: "vp_pmm", to: "content_lead" },
      { from: "demand_ads", to: "slack_notif" },
      { from: "content_lead", to: "slack_notif" },
    ],
    steps: [
      { nodeId: "alert_in", log: "Competitor alert triggered: Competitor 'Helix.ai' dropped pricing for Enterprise by 25%.", actionType: "think" },
      { nodeId: "market_analyst", log: "Market Intelligence Analyst running web research on Helix.ai. Re-synthesizing battlecards.", actionType: "think" },
      { nodeId: "vp_pmm", log: "VP Product Marketing building competitive response battlecard for sales teams: 'Helix pricing rebuttal'.", actionType: "think" },
      { nodeId: "demand_ads", log: "Tool Gateway call: Launching custom search-term campaign on Google Ads targeting 'Helix pricing comparison'.", actionType: "call_tool" },
      { nodeId: "content_lead", log: "Content Lead Agent generating SEO brief: 'True cost of cheap AI GTM tools: Synapse vs Helix'.", actionType: "think" },
      { nodeId: "slack_notif", log: "HITL Gate: Competitive pricing shift playbook completed. Slack digest notification posted to CMO channel.", actionType: "done" }
    ]
  },
  {
    id: "churn_guard",
    name: "Customer Health Churn Guard",
    description: "Renewals Alert ──► VP CS ──► CSM Action ──► Slack CS alert ──► Expansion AE deal",
    nodes: [
      { id: "renew_alert", label: "Renewals Alert", type: "trigger", icon: Zap, x: 50, y: 180, subText: "Usage drop" },
      { id: "vp_cs", label: "VP CS Agent (04a)", type: "agent", icon: Cpu, x: 240, y: 180, subText: "Health score < 50" },
      { id: "csm_agent", label: "CSM Agent (04b)", type: "agent", icon: Mail, x: 440, y: 180, subText: "Onboarding audit" },
      { id: "slack_cs", label: "Slack CS alert", type: "gate", icon: MessageSquare, x: 640, y: 80, subText: "HITL ping" },
      { id: "expansion_ae", label: "Expansion AE (04c)", type: "agent", icon: Cpu, x: 640, y: 280, subText: "Upsell pitch" },
      { id: "hubspot_deal", label: "HubSpot Deal", type: "db", icon: Database, x: 840, y: 180, subText: "Renewal Contract" }
    ],
    connections: [
      { from: "renew_alert", to: "vp_cs" },
      { from: "vp_cs", to: "csm_agent" },
      { from: "csm_agent", to: "slack_cs" },
      { from: "csm_agent", to: "expansion_ae" },
      { from: "slack_cs", to: "hubspot_deal" },
      { from: "expansion_ae", to: "hubspot_deal" }
    ],
    steps: [
      { nodeId: "renew_alert", log: "Renewals Alert triggered: Acme Corp product usage dropped 35% in last 14 days.", actionType: "think" },
      { nodeId: "vp_cs", log: "VP Customer Success Agent recalculating customer health score. New Health Score: 42 (At-Risk Churn).", actionType: "think" },
      { nodeId: "csm_agent", log: "Customer Success Manager Agent auditing onboarding records. Action selected: Book premium QBR.", actionType: "think" },
      { nodeId: "slack_cs", log: "HITL Gateway alert sent to CSM Lead on Slack to request a premium check-in call with Sarah Jenkins.", actionType: "hitl" },
      { nodeId: "expansion_ae", log: "Expansion AE Agent preparing competitive battlecard and expansion proposal based on new team seat requests.", actionType: "think" },
      { nodeId: "hubspot_deal", log: "Acme Corp QBR booked successfully. Renewal proposal drafted. Contract status updated in HubSpot.", actionType: "done" }
    ]
  }
];

export default function SimulationPage() {
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook>(playbooks[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [currentNodeGlow, setCurrentNodeGlow] = useState<string | null>(null);
  const [awaitingApproval, setAwaitingApproval] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll console to bottom
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [consoleLogs]);

  // Reset simulation when changing playbooks
  const handlePlaybookChange = (pb: Playbook) => {
    if (isRunning) return;
    setSelectedPlaybook(pb);
    setCurrentStepIndex(-1);
    setConsoleLogs([`Playbook '${pb.name}' selected. Ready for simulation.`]);
    setCurrentNodeGlow(null);
    setAwaitingApproval(false);
  };

  const triggerSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStepIndex(0);
    setConsoleLogs([`Initializing Playbook Pipeline: ${selectedPlaybook.name}...`]);
    setAwaitingApproval(false);
  };

  useEffect(() => {
    if (!isRunning || currentStepIndex < 0) return;

    const currentStep = selectedPlaybook.steps[currentStepIndex];
    if (!currentStep) {
      // Completed!
      setConsoleLogs(prev => [...prev, "✔ Playbook Pipeline completed successfully."]);
      setIsRunning(false);
      setCurrentNodeGlow(null);
      return;
    }

    setCurrentNodeGlow(currentStep.nodeId);
    
    // Log write delay
    const timer = setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[${currentStep.nodeId.toUpperCase()}] ${currentStep.log}`]);
      
      if (currentStep.actionType === "hitl") {
        setAwaitingApproval(true);
      } else {
        // Proceed automatically
        setCurrentStepIndex(prev => prev + 1);
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [isRunning, currentStepIndex, selectedPlaybook]);

  const handleSlackApprove = () => {
    setAwaitingApproval(false);
    setConsoleLogs(prev => [...prev, "💬 [OPERATOR Slack Approval Received] - GTM Motion resumed by admin action."]);
    setCurrentStepIndex(prev => prev + 1);
  };

  const handleSlackDeny = () => {
    setAwaitingApproval(false);
    setConsoleLogs(prev => [...prev, "❌ [OPERATOR Slack Rejected] - Pipeline execution cancelled by operator."]);
    setIsRunning(false);
    setCurrentNodeGlow(null);
  };

  // Helper to draw visual connection paths reactively
  const getPathCoords = (fromNodeId: string, toNodeId: string) => {
    const fromNode = selectedPlaybook.nodes.find(n => n.id === fromNodeId);
    const toNode = selectedPlaybook.nodes.find(n => n.id === toNodeId);
    if (!fromNode || !toNode) return "";

    // Nodes are in a grid with coords: fromNode.x and fromNode.y relative positions
    // Node width/height is ~160px x 68px.
    // Connect center right of 'from' to center left of 'to'
    const x1 = fromNode.x + 80;
    const y1 = fromNode.y + 34;
    const x2 = toNode.x + 80;
    const y2 = toNode.y + 34;

    // Curved Bezier horizontal connection
    const dx = Math.abs(x2 - x1) * 0.5;
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  };

  return (
    <div className="simulator-container">
      {/* Header */}
      <header className="header-row">
        <div>
          <h1 className="title-glow">GTM Flow Simulator</h1>
          <p className="subtitle">Interactive visual multi-agent workflow testing canvas (n8n & Make-style).</p>
        </div>
        <div className="status-badge">
          <Activity size={14} className="active-icon" />
          <span>Interactive Sandbox</span>
        </div>
      </header>

      {/* Main Grid */}
      <div className="simulator-grid">
        {/* Left Side: Playbooks & triggers */}
        <section className="side-panel glass-panel">
          <div className="section-header">
            <h3>Active Playbooks</h3>
            <p>Select a playbook flow below to simulate</p>
          </div>

          <div className="playbook-list">
            {playbooks.map(pb => (
              <button 
                key={pb.id}
                className={`playbook-btn ${selectedPlaybook.id === pb.id ? "active" : ""}`}
                onClick={() => handlePlaybookChange(pb)}
                disabled={isRunning}
              >
                <strong>{pb.name}</strong>
                <p>{pb.description.slice(0, 75)}...</p>
              </button>
            ))}
          </div>

          <div className="trigger-container">
            <button 
              className={`trigger-action-btn ${isRunning ? 'running' : ''}`}
              onClick={triggerSimulation}
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <RefreshCw size={16} className="spin-icon" /> Running Simulation...
                </>
              ) : (
                <>
                  <Play size={16} fill="currentColor" /> Trigger GTM Playbook
                </>
              )}
            </button>
          </div>
        </section>

        {/* Center: Node Canvas */}
        <section className="canvas-panel glass-panel">
          <div className="canvas-grid-bg"></div>
          <div className="canvas-wrapper">
            {/* SVG Connections overlay behind nodes */}
            <svg className="connections-svg" width="1000" height="400">
              <defs>
                <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
              {selectedPlaybook.connections.map((c, i) => {
                const isPathActive = isRunning && 
                  selectedPlaybook.steps.findIndex(s => s.nodeId === c.from) <= currentStepIndex && 
                  selectedPlaybook.steps.findIndex(s => s.nodeId === c.to) <= currentStepIndex &&
                  currentStepIndex !== -1;
                
                return (
                  <g key={i}>
                    {/* Background path line */}
                    <path 
                      d={getPathCoords(c.from, c.to)}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.05)"
                      strokeWidth="3"
                    />
                    {/* Glowing active path line */}
                    {isPathActive && (
                      <path 
                        d={getPathCoords(c.from, c.to)}
                        fill="none"
                        stroke="url(#neonGrad)"
                        strokeWidth="3"
                        className="active-connector-pulse"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Render Nodes absolute positioned */}
            {selectedPlaybook.nodes.map(node => {
              const IconComponent = node.icon;
              const isGlow = currentNodeGlow === node.id;
              const isStepDone = isRunning && 
                selectedPlaybook.steps.findIndex(s => s.nodeId === node.id) < currentStepIndex &&
                currentStepIndex !== -1;
              
              let typeClass = "";
              if (node.type === "trigger") typeClass = "node-trigger";
              if (node.type === "agent") typeClass = "node-agent";
              if (node.type === "tool") typeClass = "node-tool";
              if (node.type === "gate") typeClass = "node-gate";
              if (node.type === "db") typeClass = "node-db";

              return (
                <div 
                  key={node.id}
                  className={`node-card ${typeClass} ${isGlow ? 'glow' : ''} ${isStepDone ? 'done' : ''}`}
                  style={{ left: node.x, top: node.y }}
                >
                  <div className="node-icon-wrap">
                    <IconComponent size={16} />
                  </div>
                  <div className="node-content">
                    <span className="node-lbl">{node.label}</span>
                    <span className="node-sub">{node.subText}</span>
                  </div>
                  {isGlow && <span className="node-active-pulse"></span>}
                  {isStepDone && <span className="node-check-done">✓</span>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Side: Execution Console / Slack HITL card */}
        <section className="console-panel glass-panel">
          <div className="section-header">
            <div className="flex-align">
              <Terminal size={14} className="console-header-icon" />
              <h3>System Execution Logs</h3>
            </div>
            <span className="console-status-label">{isRunning ? "EXECUTION RUNNING" : "STANDBY"}</span>
          </div>

          <div className="console-logs-container">
            {consoleLogs.map((log, i) => (
              <div key={i} className="console-log-line">
                <span className="line-prefix">▶</span> {log}
              </div>
            ))}
            <div ref={consoleEndRef} />
          </div>

          {/* Interactive Slack human approval Gate overlay */}
          {awaitingApproval && (
            <div className="slack-approval-overlay animated-fade">
              <div className="slack-card">
                <div className="slack-card-header">
                  <div className="slack-team">
                    <MessageSquare className="slack-logo" size={16} />
                    <span>Slack Gate: <strong>#gtm-hitl-approvals</strong></span>
                  </div>
                  <span className="slack-alert-badge">Action Gated</span>
                </div>
                <div className="slack-card-body">
                  <p className="slack-warn"><strong>SDR Agent Requesting Action:</strong></p>
                  <p className="slack-desc">"Apollo sequence enrollment requested for CEO of Acme Corp: <strong>Sarah Jenkins (sjenkins@arisetech.io)</strong>. Enrichment match score is 94%."</p>
                </div>
                <div className="slack-card-footer">
                  <button className="slack-action-btn reject" onClick={handleSlackDeny}>
                    <X size={14} /> Reject Execution
                  </button>
                  <button className="slack-action-btn approve" onClick={handleSlackApprove}>
                    <Check size={14} /> Approve Action
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        .simulator-container {
          padding-bottom: 80px;
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animated-fade {
          animation: fadeIn 0.25s ease-out;
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
        .active-icon {
          animation: pulse-glow 2s infinite;
        }
        @keyframes pulse-glow {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }

        .simulator-grid {
          display: grid;
          grid-template-columns: 280px 1fr 340px;
          gap: 1.25rem;
          min-height: 520px;
        }
        .glass-panel {
          background: rgba(30, 30, 36, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.25rem;
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
        }
        .section-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          padding-bottom: 0.75rem;
          margin-bottom: 1rem;
        }
        .section-header h3 {
          margin: 0;
          font-size: 0.9rem;
          color: #f4f4f5;
          font-weight: 600;
        }
        .section-header p {
          margin: 0.2rem 0 0 0;
          font-size: 0.7rem;
          color: #71717a;
        }

        /* PLAYBOOKS LIST */
        .playbook-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }
        .playbook-btn {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.25s;
        }
        .playbook-btn:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.06);
        }
        .playbook-btn.active {
          background: rgba(99, 102, 241, 0.08);
          border-color: rgba(99, 102, 241, 0.25);
        }
        .playbook-btn strong {
          display: block;
          font-size: 0.78rem;
          color: #e4e4e7;
          margin-bottom: 0.15rem;
        }
        .playbook-btn p {
          margin: 0;
          font-size: 0.65rem;
          color: #71717a;
          line-height: 1.35;
        }
        .playbook-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .trigger-container {
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          padding-top: 1rem;
          margin-top: 1rem;
        }
        .trigger-action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          border: 1px solid rgba(99, 102, 241, 0.4);
          color: #ffffff;
          border-radius: 10px;
          padding: 0.75rem;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25);
        }
        .trigger-action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
        }
        .trigger-action-btn:disabled {
          opacity: 0.5;
          transform: none;
          box-shadow: none;
          cursor: not-allowed;
        }
        .spin-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* CANVAS PANEL */
        .canvas-panel {
          flex: 1;
          position: relative;
          min-height: 480px;
          overflow: hidden;
          background: rgba(18, 18, 22, 0.6);
        }
        .canvas-grid-bg {
          position: absolute;
          inset: 0;
          background-size: 24px 24px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          pointer-events: none;
        }
        .canvas-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .connections-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        .active-connector-pulse {
          stroke-dasharray: 6, 6;
          animation: dash-pulse 20s linear infinite;
        }
        @keyframes dash-pulse {
          from { stroke-dashoffset: 500; }
          to { stroke-dashoffset: 0; }
        }

        /* NODES */
        .node-card {
          position: absolute;
          width: 160px;
          height: 68px;
          background: rgba(30, 30, 36, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 0.65rem 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          z-index: 10;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .node-icon-wrap {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .node-content {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          min-width: 0;
        }
        .node-lbl {
          font-size: 0.75rem;
          font-weight: 600;
          color: #f4f4f5;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .node-sub {
          font-size: 0.6rem;
          color: #71717a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* NODE TYPE THEMING */
        .node-trigger .node-icon-wrap { background: rgba(239, 68, 68, 0.15); color: #f87171; }
        .node-agent .node-icon-wrap { background: rgba(99, 102, 241, 0.15); color: #a5b4fc; }
        .node-tool .node-icon-wrap { background: rgba(96, 165, 250, 0.15); color: #93c5fd; }
        .node-gate .node-icon-wrap { background: rgba(245, 158, 11, 0.15); color: #fde68a; }
        .node-db .node-icon-wrap { background: rgba(52, 211, 153, 0.15); color: #6ee7b7; }

        /* ACTIVE GLOW STATE */
        .node-card.glow {
          border-color: #818cf8;
          background: rgba(99, 102, 241, 0.12);
          box-shadow: 0 0 25px rgba(99, 102, 241, 0.35);
          transform: scale(1.03);
        }
        .node-active-pulse {
          position: absolute;
          inset: -4px;
          border: 1px solid #818cf8;
          border-radius: 16px;
          animation: ping-node 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          pointer-events: none;
        }
        @keyframes ping-node {
          75%, 100% { transform: scale(1.1); opacity: 0; }
        }

        /* COMPLETED STATE */
        .node-card.done {
          border-color: rgba(52, 211, 153, 0.35);
          background: rgba(52, 211, 153, 0.03);
        }
        .node-check-done {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 14px;
          height: 14px;
          background: #34d399;
          color: #121214;
          font-size: 0.65rem;
          font-weight: 800;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 8px rgba(52, 211, 153, 0.4);
        }

        /* CONSOLE PANEL */
        .console-panel {
          width: 340px;
          position: relative;
          background: rgba(30, 30, 36, 0.3);
        }
        .flex-align {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .console-header-icon {
          color: #a5b4fc;
        }
        .console-status-label {
          font-size: 0.6rem;
          font-family: monospace;
          color: #52525b;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        .console-logs-container {
          flex: 1;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 1rem;
          font-family: monospace;
          font-size: 0.72rem;
          color: #a1a1aa;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          overflow-y: auto;
          max-height: 480px;
        }
        .console-log-line {
          line-height: 1.45;
          word-break: break-word;
        }
        .line-prefix {
          color: #818cf8;
          margin-right: 0.35rem;
        }

        /* SLACK HITL CARD OVERLAY */
        .slack-approval-overlay {
          position: absolute;
          bottom: 1.25rem;
          left: 1.25rem;
          right: 1.25rem;
          background: rgba(18, 18, 22, 0.95);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          z-index: 100;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .slack-card {
          padding: 1.25rem;
        }
        .slack-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.5rem;
        }
        .slack-team {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: #a1a1aa;
        }
        .slack-logo {
          color: #e21b5a;
        }
        .slack-alert-badge {
          font-size: 0.65rem;
          color: #fb923c;
          background: rgba(251, 146, 60, 0.08);
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .slack-card-body {
          font-size: 0.78rem;
          color: #e4e4e7;
          line-height: 1.45;
          margin-bottom: 1rem;
        }
        .slack-warn {
          margin: 0 0 0.25rem 0;
          color: #fb923c;
        }
        .slack-desc {
          margin: 0;
          font-style: italic;
          background: rgba(0,0,0,0.25);
          padding: 0.6rem;
          border-radius: 6px;
        }
        .slack-card-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        .slack-action-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          border: none;
          padding: 0.45rem 0.85rem;
          border-radius: 8px;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .slack-action-btn.reject {
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
        }
        .slack-action-btn.reject:hover {
          background: rgba(239, 68, 68, 0.25);
        }
        .slack-action-btn.approve {
          background: rgba(52, 211, 153, 0.15);
          color: #6ee7b7;
        }
        .slack-action-btn.approve:hover {
          background: rgba(52, 211, 153, 0.25);
        }

        @media (max-width: 1100px) {
          .simulator-grid {
            grid-template-columns: 1fr;
          }
          .console-panel {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
