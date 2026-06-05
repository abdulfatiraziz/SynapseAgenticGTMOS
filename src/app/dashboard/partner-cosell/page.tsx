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
  Share2,
  Database,
  Terminal,
  AlertCircle
} from "lucide-react";

interface OverlapRecord {
  company: string;
  domain: string;
  partner: string;
  partnerStatus: string;
  warmIntroScore: number;
  introFeasibility: "high" | "medium" | "low";
  actionStatus: "idle" | "triggered" | "slack_sent";
}

export default function PartnerCosellDashboard() {
  const [overlaps, setOverlaps] = useState<OverlapRecord[]>([
    { company: "Stripe", domain: "stripe.com", partner: "Snowflake", partnerStatus: "active_customer", warmIntroScore: 92, introFeasibility: "high", actionStatus: "idle" },
    { company: "Databricks", domain: "databricks.com", partner: "Confluent", partnerStatus: "active_customer", warmIntroScore: 85, introFeasibility: "high", actionStatus: "idle" },
    { company: "Retool", domain: "retool.com", partner: "Okta", partnerStatus: "opportunity", warmIntroScore: 54, introFeasibility: "medium", actionStatus: "idle" },
    { company: "Linear", domain: "linear.app", partner: "Sentry", partnerStatus: "prospect", warmIntroScore: 32, introFeasibility: "low", actionStatus: "idle" }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [activeCompany, setActiveCompany] = useState<string | null>(null);
  const [cosellLogs, setCosellLogs] = useState<string[]>([]);

  const initiateCoSell = (companyName: string) => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveCompany(companyName);
    setCosellLogs([
      `Initializing Ecosystem Co-Sell trigger for account: ${companyName}...`,
      "Querying Crossbeam API account mapping database...",
      "Mapping joint client overlaps between sales pipeline and partner directories..."
    ]);

    // Find the record
    const record = overlaps.find(o => o.company === companyName);
    if (!record) return;

    // Trigger state change
    setOverlaps(prev => prev.map(o => {
      if (o.company === companyName) {
        return { ...o, actionStatus: "triggered" };
      }
      return o;
    }));

    setTimeout(() => {
      setCosellLogs(prev => [...prev, `Crossbeam match confirmed: Partner '${record.partner}' lists '${companyName}' as '${record.partnerStatus}'.`]);
      setCosellLogs(prev => [...prev, `Warm Intro Connection Score: ${record.warmIntroScore}% (Feasibility: ${record.introFeasibility.toUpperCase()})`]);
    }, 1500);

    setTimeout(() => {
      setCosellLogs(prev => [...prev, "Formulating joint value proposition brief (VP Partnerships Agent 02d)..."]);
    }, 2800);

    setTimeout(() => {
      setCosellLogs(prev => [...prev, `Joint Value Proposition: '${record.partner} owns active customer relationship with ${companyName}. Synapse GTM OS integration with ${record.partner} allows ${companyName} to automate data sharing out-of-the-box.'`]);
      setCosellLogs(prev => [...prev, "Generating cryptographically gated Slack Shared Channel introduction payload..."]);
    }, 4000);

    setTimeout(() => {
      setCosellLogs(prev => [...prev, `Slack message drafted to Snowflake Account Executive: 'Hey Snowflake AE! Mapped Stripe as active Snowflake customer via Crossbeam overlap. Stripe matches Synapse ICP. Let\\'s do a joint intro to Stripe data lead. Value brief attached.'`]);
    }, 5500);

    setTimeout(() => {
      setCosellLogs(prev => [...prev, `✓ Slack Shared Channel introduction message delivered successfully to ${record.partner} team.`]);
      setCosellLogs(prev => [...prev, `✓ HubSpot CRM updated: Partner co-selling pipeline deal created.`]);
      setIsRunning(false);
      
      setOverlaps(prev => prev.map(o => {
        if (o.company === companyName) {
          return { ...o, actionStatus: "slack_sent" };
        }
        return o;
      }));
    }, 7000);
  };

  return (
    <div style={{ position: "relative", width: "100%", paddingBottom: "40px" }}>
      {/* Background Radial Glow */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.04) 0%, transparent 70%)",
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
            <Sparkles size={16} color="#a855f7" />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#a855f7", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Partner-Led Motion
            </span>
          </div>
          <h1>Ecosystem Co-Selling Map</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Crossbeam overlap matching: Track active customer overlap relationships, connection feasibility scores, and trigger warm introductions.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "24px", position: "relative", zIndex: 10 }}>
        
        {/* Left Side: Overlap grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "24px", backdropFilter: "blur(12px)" }}>
            <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Share2 size={18} color="#a855f7" />
                <h2 style={{ fontFamily: "var(--font-sora)", fontSize: "1.1rem", fontWeight: 600 }}>Crossbeam Account Overlaps</h2>
              </div>
              <span style={{ fontSize: "0.65rem", background: "rgba(168, 85, 247, 0.1)", color: "#a855f7", padding: "3px 6px", borderRadius: "4px", fontWeight: 700 }}>
                Ecosystem Map
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {overlaps.map((over, i) => (
                <div key={i} style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", padding: "14px", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", borderRadius: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "white" }}>{over.company}</span>
                      <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>{over.domain}</span>
                    </div>
                    <div style={{ display: "flex", gap: "12px", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "6px" }}>
                      <span>Partner: <strong style={{ color: "white" }}>{over.partner}</strong></span>
                      <span>Status: <strong style={{ color: "white" }}>{over.partnerStatus}</strong></span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: over.introFeasibility === "high" ? "var(--success-color)" : over.introFeasibility === "medium" ? "var(--warning-color)" : "var(--text-secondary)" }}>
                        {over.warmIntroScore}%
                      </span>
                      <span style={{ fontSize: "0.6rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Intro Score</span>
                    </div>

                    <button
                      onClick={() => initiateCoSell(over.company)}
                      disabled={isRunning || over.actionStatus !== "idle" || over.introFeasibility === "low"}
                      style={{
                        background: over.actionStatus === "slack_sent"
                          ? "rgba(16, 185, 129, 0.15)"
                          : over.actionStatus === "triggered"
                          ? "rgba(255,255,255,0.05)"
                          : over.introFeasibility === "low"
                          ? "rgba(255,255,255,0.02)"
                          : "linear-gradient(135deg, #a855f7, #6366f1)",
                        border: over.actionStatus === "slack_sent" ? "1px solid rgba(16, 185, 129, 0.5)" : "none",
                        color: over.actionStatus === "slack_sent" 
                          ? "var(--success-color)" 
                          : over.introFeasibility === "low" 
                          ? "var(--text-secondary)" 
                          : "white",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: (isRunning || over.actionStatus !== "idle" || over.introFeasibility === "low") ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {over.actionStatus === "slack_sent" ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><Check size={12} strokeWidth={3} /> Slack Sent</div>
                      ) : over.actionStatus === "triggered" ? (
                        <RefreshCw size={12} className="spin-icon" />
                      ) : (
                        "Co-Sell"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Right Side: Co-Sell Logs Operations */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "24px", backdropFilter: "blur(12px)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Terminal size={18} color="#a855f7" />
                  <h2 style={{ fontFamily: "var(--font-sora)", fontSize: "1.1rem", fontWeight: 600 }}>Ecosystem Handoff logger</h2>
                </div>
                <span style={{ fontSize: "0.65rem", color: "#a855f7", background: "rgba(168, 85, 247, 0.1)", padding: "3px 6px", borderRadius: "4px", fontWeight: 700 }}>
                  Agent 02d
                </span>
              </div>

              {cosellLogs.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "14px", maxHeight: "320px", overflowY: "auto" }}>
                  {cosellLogs.map((log, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", justifyItems: "flex-start", fontSize: "0.7rem", color: log.startsWith("✓") ? "var(--success-color)" : "var(--text-secondary)" }}>
                      <span>•</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", border: "1px dashed var(--border-color)", borderRadius: "12px", color: "var(--text-secondary)", fontSize: "0.8rem", width: "100%" }}>
                  <AlertCircle size={24} style={{ marginBottom: "12px", color: "var(--text-secondary)" }} />
                  <span>Choose an eligible Tier-1 account from Ahrefs/Crossbeam overlap list and trigger co-selling operations.</span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "12px", background: "rgba(168, 85, 247, 0.05)", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: "10px", marginTop: "20px" }}>
              <Cpu size={16} color="#a855f7" style={{ flexShrink: 0, marginTop: "2px" }} />
              <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                VP Partnerships automatically monitors Crossbeam match shares, filters high-tenure customer accounts, drafts co-selling messaging, and schedules joint referral intros over Slack Connect.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
