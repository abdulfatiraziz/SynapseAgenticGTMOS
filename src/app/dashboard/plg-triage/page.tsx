"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Cpu,
  Check,
  RefreshCw,
  Layers,
  Zap,
  Activity,
  ArrowRight,
  TrendingUp,
  Sliders,
  Terminal
} from "lucide-react";

interface UserActivity {
  user: string;
  action: string;
  invites: number;
  featuresUsed: number;
  score: number;
  status: "active" | "qualified" | "routed";
}

export default function PlgTriageDashboard() {
  const [threshold, setThreshold] = useState(70);
  const [activities, setActivities] = useState<UserActivity[]>([
    { user: "dev_operator@airbnb.com", action: "Invited team members, activated vector db module", invites: 8, featuresUsed: 6, score: 94, status: "active" },
    { user: "product_lead@netflix.com", action: "Created custom visual dashboard pipelines", invites: 6, featuresUsed: 4, score: 82, status: "active" },
    { user: "growth_hacker@notion.so", action: "Ran 5 telemetry test campaigns in 1 hour", invites: 4, featuresUsed: 3, score: 65, status: "active" },
    { user: "data_lead@slack.com", action: "Accessed control-center configurations", invites: 2, featuresUsed: 2, score: 48, status: "active" }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [routingLogs, setRoutingLogs] = useState<string[]>([]);
  const [hasRouted, setHasRouted] = useState(false);

  // Recalculate qualification statuses dynamically based on threshold
  const activeActivities = activities.map(act => {
    let status = act.status;
    if (status !== "routed") {
      status = act.score >= threshold ? "qualified" : "active";
    }
    return { ...act, status };
  });

  const triggerTriage = () => {
    if (isRunning) return;
    setIsRunning(true);
    setHasRouted(false);
    setRoutingLogs([
      "Scanning Amplitude user activity metrics database...",
      `Filtering profiles exceeding threshold score ${threshold}%...`
    ]);

    setTimeout(() => {
      setRoutingLogs(prev => [...prev, "Found 2 accounts qualifying as PQLs (score >= threshold)."]);
    }, 1200);

    setTimeout(() => {
      setRoutingLogs(prev => [...prev, "Querying Clay API to enrich company metadata..."]);
    }, 2400);

    setTimeout(() => {
      setRoutingLogs(prev => [...prev, "Clay Enrichment: Airbnb.com (Enterprise, $45M fundraise, uses AWS)"]);
      setRoutingLogs(prev => [...prev, "Clay Enrichment: Netflix.com (Enterprise, B2B motion, uses AWS/GCP)"]);
    }, 3600);

    setTimeout(() => {
      setRoutingLogs(prev => [...prev, "Drafting Enterprise Upsell Deal in HubSpot CRM..."]);
    }, 4800);

    setTimeout(() => {
      setRoutingLogs(prev => [...prev, "HubSpot Deal created: Airbnb Upsell (Stage: Qualified Lead, Value: $24,000)"]);
      setRoutingLogs(prev => [...prev, "HubSpot Deal created: Netflix Expansion (Stage: Qualified Lead, Value: $18,000)"]);
    }, 6000);

    setTimeout(() => {
      setRoutingLogs(prev => [...prev, "Notified Expansion AE (04c) on Slack shared channel."]);
      setRoutingLogs(prev => [...prev, "✓ Product-Led Growth Upsell triage completed successfully."]);
      setIsRunning(false);
      setHasRouted(true);
      
      // Update activities status
      setActivities(prev => prev.map(act => {
        if (act.score >= threshold) {
          return { ...act, status: "routed" };
        }
        return act;
      }));
    }, 7200);
  };

  return (
    <div style={{ position: "relative", width: "100%", paddingBottom: "40px" }}>
      {/* Background Radial Glow */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.04) 0%, transparent 70%)",
          top: "-200px",
          right: "-100px",
          filter: "blur(50px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Header Row */}
      <div className="header-row" style={{ position: "relative", zIndex: 10, marginBottom: "24px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Sparkles size={16} color="var(--success-color)" />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--success-color)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Product-Led Growth
            </span>
          </div>
          <h1>PQL Inbound Triage</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Amplitude product activity scoring: Set product usage qualification limits and route qualified accounts to expansion funnels.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px", position: "relative", zIndex: 10 }}>
        
        {/* Left Side: Amplitude Telemetry & PQL Dials */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Amplitude Activity Card */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "24px", backdropFilter: "blur(12px)" }}>
            <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Activity size={18} color="var(--success-color)" />
                <h2 style={{ fontFamily: "var(--font-sora)", fontSize: "1.1rem", fontWeight: 600 }}>Amplitude User Telemetry</h2>
              </div>
              <span style={{ fontSize: "0.65rem", background: "rgba(16, 185, 129, 0.1)", color: "var(--success-color)", padding: "3px 6px", borderRadius: "4px", fontWeight: 700 }}>
                Live Stream
              </span>
            </div>

            {/* Threshold Slider dial */}
            <div style={{ background: "rgba(255, 255, 255, 0.01)", border: "1px solid var(--border-color)", padding: "16px", borderRadius: "12px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 600, marginBottom: "8px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Sliders size={14} color="var(--success-color)" /> PQL Score Threshold</span>
                <span style={{ color: "var(--success-color)", fontSize: "1rem" }}>{threshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                disabled={isRunning}
                style={{ width: "100%", accentColor: "var(--success-color)", cursor: "pointer" }}
              />
              <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)", display: "block", marginTop: "6px" }}>
                Adjust slider to dynamically score and filter active profiles exceeding qualification limits.
              </span>
            </div>

            {/* User Activity Streams */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {activeActivities.map((act, i) => (
                <div key={i} style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", borderRadius: "10px" }}>
                  <div>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "white" }}>{act.user}</span>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>{act.action}</p>
                    <div style={{ display: "flex", gap: "12px", fontSize: "0.65rem", color: "var(--text-secondary)", marginTop: "6px" }}>
                      <span>Invites: <strong style={{ color: "white" }}>{act.invites}</strong></span>
                      <span>Features: <strong style={{ color: "white" }}>{act.featuresUsed}</strong></span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                    <span style={{ fontSize: "0.95rem", fontWeight: 700, color: act.status === "routed" ? "var(--success-color)" : act.status === "qualified" ? "var(--warning-color)" : "white" }}>
                      {act.score}%
                    </span>
                    <span style={{
                      fontSize: "0.6rem",
                      background: act.status === "routed" 
                        ? "rgba(16, 185, 129, 0.15)" 
                        : act.status === "qualified" 
                        ? "rgba(245, 158, 11, 0.15)" 
                        : "rgba(255,255,255,0.05)",
                      color: act.status === "routed" 
                        ? "var(--success-color)" 
                        : act.status === "qualified" 
                        ? "var(--warning-color)" 
                        : "var(--text-secondary)",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: 700,
                      textTransform: "uppercase"
                    }}>
                      {act.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Right Side: HubSpot Upsell Opportunity Simulator */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "24px", backdropFilter: "blur(12px)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Terminal size={18} color="var(--success-color)" />
                  <h2 style={{ fontFamily: "var(--font-sora)", fontSize: "1.1rem", fontWeight: 600 }}>Triage Operations Console</h2>
                </div>
                <span style={{ fontSize: "0.65rem", color: "var(--success-color)", background: "rgba(16, 185, 129, 0.1)", padding: "3px 6px", borderRadius: "4px", fontWeight: 700 }}>
                  Agent 02b
                </span>
              </div>

              {routingLogs.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "14px", maxHeight: "300px", overflowY: "auto" }}>
                  {routingLogs.map((log, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", justifyItems: "flex-start", fontSize: "0.7rem", color: log.startsWith("✓") ? "var(--success-color)" : "var(--text-secondary)" }}>
                      <span>•</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", border: "1px dashed var(--border-color)", borderRadius: "12px", color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                  Click the triage button below to scan Amplitude events and route qualified PQL deals to CRM.
                </div>
              )}
            </div>

            <button
              onClick={triggerTriage}
              disabled={isRunning || activeActivities.filter(a => a.status === "qualified").length === 0}
              style={{
                background: isRunning ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, var(--success-color), #059669)",
                border: "none",
                color: "white",
                padding: "12px 20px",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: (isRunning || activeActivities.filter(a => a.status === "qualified").length === 0) ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: (isRunning || activeActivities.filter(a => a.status === "qualified").length === 0) ? "none" : "0 4px 15px rgba(16, 185, 129, 0.3)",
                transition: "all 0.3s ease",
                marginTop: "20px"
              }}
            >
              {isRunning ? (
                <>
                  <RefreshCw size={16} className="spin-icon" />
                  <span>Routing Qualified PQLs...</span>
                </>
              ) : (
                <>
                  <Zap size={16} fill="white" />
                  <span>Route PQL Opportunities</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
