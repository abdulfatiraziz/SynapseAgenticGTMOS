"use client";

import React, { useEffect, useState } from 'react';
import { Shield, Zap, TrendingUp, Cpu, Database, Mail, Target, Users, BarChart3, AlertCircle } from 'lucide-react';

const AgentCard = ({ name, role, status, tools_required, core_objective }: any) => (
  <div className="agent-node-card">
    <div className="agent-status-indicator" data-status={status || 'idle'}></div>
    <div className="agent-header">
      <h3>{name}</h3>
      <span className="agent-role-tag">{role}</span>
    </div>
    <div className="agent-persona">
      <p>"{core_objective}"</p>
    </div>
    <div className="agent-tools">
      {tools_required && tools_required.map((tool: string, i: number) => (
        <span key={i} className="tool-tag">{tool}</span>
      ))}
    </div>
  </div>
);

export default function OrgMap() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchAgents = async () => {
      try {
        const res = await fetch('/api/agents');
        const json = await res.json();
        
        if (!res.ok) {
          throw new Error(json.error || 'Failed to fetch agents');
        }
        
        const data = json.data;
        if (data && data.length > 0) {
          if (isMounted) setAgents(data);
          if (isMounted) setError(null);
        } else {
          if (isMounted) setError("No agents found. Please run the supabase_setup.sql script.");
        }
      } catch (err: any) {
        console.error("Error fetching agents:", err);
        if (isMounted) setError("Could not connect to API. " + err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAgents();
    
    // Poll every 1.5 seconds for updates to simulate real-time
    const interval = setInterval(fetchAgents, 1500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const levelInfo: Record<number, { title: string, description: string }> = {
    1: { title: "Layer 1: Strategy Foundation", description: "Defines ICP, messaging, pricing, and market intelligence." },
    2: { title: "Layer 2: GTM Motions (Engines)", description: "Owns the core revenue engines: Sales, PLG, Community, Partners." },
    3: { title: "Layer 3: Channels & Levers", description: "Executes day-to-day operations and pipeline generation." },
    4: { title: "Layer 4: CS & Expansion (NRR)", description: "Protects and grows existing revenue through renewals and upsells." }
  };

  if (loading) {
    return <div className="p-8 text-center text-white">Booting up the 17-Agent Network...</div>;
  }

  return (
    <div className="org-map-container">
      <div className="header-row">
        <h1>Autonomous Organization Structure</h1>
        <div className="status-legend">
          <span className="legend-item"><span className="dot active"></span> Active</span>
          <span className="legend-item"><span className="dot idle"></span> Idle</span>
          <span className="legend-item"><span className="dot error"></span> Error</span>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="hierarchy-tree">
        {[1, 2, 3, 4].map((layer) => {
          const layerAgents = agents.filter(a => a.layer === layer);
          if (layerAgents.length === 0 && !error) return null;

          return (
            <div key={layer} className="hierarchy-level">
              <div className="level-info">
                <h2>{levelInfo[layer].title}</h2>
                <p>{levelInfo[layer].description}</p>
              </div>
              <div className="agents-grid">
                {layerAgents.map((agent) => (
                  <AgentCard key={agent.id} {...agent} />
                ))}
              </div>
              {layer < 4 && <div className="level-connector"></div>}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .org-map-container {
          padding-bottom: 50px;
        }
        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .error-banner {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          padding: 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 30px;
        }
        .hierarchy-tree {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        .hierarchy-level {
          position: relative;
        }
        .level-info {
          margin-bottom: 24px;
        }
        .level-info h2 {
          color: var(--accent-color);
          font-size: 1.1rem;
          margin-bottom: 8px;
        }
        .level-info p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .agent-node-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 20px;
          position: relative;
          transition: all 0.3s ease;
        }
        .agent-node-card:hover {
          border-color: var(--accent-color);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .agent-status-indicator {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .agent-status-indicator[data-status="active"],
        .agent-status-indicator[data-status="thinking"],
        .agent-status-indicator[data-status="acting"] {
          background: var(--success-color);
          box-shadow: 0 0 10px var(--success-color);
        }
        .agent-status-indicator[data-status="idle"] {
          background: #475569;
        }
        .agent-status-indicator[data-status="error"] {
          background: #ef4444;
          box-shadow: 0 0 10px #ef4444;
        }
        .agent-role-tag {
          font-size: 0.7rem;
          background: rgba(255,255,255,0.05);
          padding: 2px 8px;
          border-radius: 4px;
          color: var(--text-secondary);
          margin-top: 4px;
          display: inline-block;
        }
        .agent-persona {
          margin: 16px 0;
          font-style: italic;
          font-size: 0.85rem;
          color: var(--text-primary);
          opacity: 0.8;
          border-left: 2px solid var(--accent-color);
          padding-left: 12px;
          min-height: 40px;
        }
        .agent-tools {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .tool-tag {
          font-size: 0.65rem;
          background: rgba(59, 130, 246, 0.1);
          color: var(--accent-color);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .level-connector {
          height: 40px;
          width: 2px;
          background: linear-gradient(to bottom, var(--border-color), transparent);
          margin: 20px auto 0;
        }
        .status-legend {
          display: flex;
          gap: 16px;
          font-size: 0.8rem;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .dot.active { background: var(--success-color); }
        .dot.idle { background: #475569; }
        .dot.error { background: #ef4444; }
      `}</style>
    </div>
  );
}

