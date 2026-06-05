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
  MessageSquare,
  Users,
  Terminal,
  AlertCircle
} from "lucide-react";

interface CommunitySignal {
  id: string;
  user: string;
  company: string;
  source: "Slack" | "Discord" | "GitHub";
  message: string;
  ambassadorScore: number;
  status: "pending" | "generating" | "resolved";
  response?: string;
}

export default function CommunitySignalsDashboard() {
  const [signals, setSignals] = useState<CommunitySignal[]>([
    { id: "s1", user: "builder_tom", company: "HashiCorp", source: "Discord", message: "Does Synapse GTM OS support remote Server-Sent Events (SSE) gateway connections? Need to deploy cloud agent nodes.", ambassadorScore: 88, status: "pending" },
    { id: "s2", user: "dev_sandra", company: "Datadog", source: "GitHub", message: "Starred the repository! Looking to contribute to the A2A wrapper schemas. Is there an OpenAPI spec?", ambassadorScore: 82, status: "pending" },
    { id: "s3", user: "mark_growth", company: "HubSpot", source: "Slack", message: "Our sales team is seeing sync lag on deal creations. Any recommended webhook throttle settings?", ambassadorScore: 68, status: "pending" }
  ]);

  const [activeSignal, setActiveSignal] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);

  const triggerAnswer = (id: string) => {
    if (isAnswering) return;
    setIsAnswering(true);
    setActiveSignal(id);
    
    const sig = signals.find(s => s.id === id);
    if (!sig) return;

    setSignals(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status: "generating" };
      }
      return s;
    }));

    setLogs([
      `Intercepting community signal from builder: ${sig.user} (${sig.company})...`,
      "Evaluating builder's profile authority and Ambassador Score...",
      `Profile Score: ${sig.ambassadorScore}% (Company matches B2B SaaS ICP target).`
    ]);

    setTimeout(() => {
      setLogs(prev => [...prev, "Querying GTM OS local documentation and codebase references (Head of Community Agent 02c)..."]);
    }, 1500);

    setTimeout(() => {
      setLogs(prev => [...prev, "Formulating precise, highly expert technical answer..."]);
    }, 2800);

    setTimeout(() => {
      let mockAnswer = "";
      if (sig.source === "Discord") {
        mockAnswer = "Hey there! Yes, Synapse GTM OS fully supports remote Server-Sent Events (SSE) connections. You can expose any agent by calling toA2a(agent, port) and mapping the route dynamically inside Next.js API networks. Let us know if you need our sample deployment template!";
      } else if (sig.source === "GitHub") {
        mockAnswer = "Thank you for the star! Yes, the A2A schema specifications are defined inside `src/app/api/a2a/[agentId]/agent-card/route.ts` which serves dynamic OpenAPI-compliant JSON specs out-of-the-box. We welcome PRs!";
      } else {
        mockAnswer = "Hi Mark! For HubSpot sync lag, we recommend checking the Supabase RLS policies and verifying that your HubSpot callback tokens are initialized via `getSupabaseAdmin()`. Throttling threshold config is exposed in Gateway.";
      }

      setLogs(prev => [...prev, `Response drafted: "${mockAnswer}"`]);

      setSignals(prev => prev.map(s => {
        if (s.id === id) {
          return { ...s, status: "resolved", response: mockAnswer };
        }
        return s;
      }));
    }, 4500);

    setTimeout(() => {
      setLogs(prev => [...prev, "Dispatching response payload directly to community API callback webhook..."]);
      setLogs(prev => [...prev, `✓ Support thread marked as RESOLVED on ${sig.source}.`]);
      setLogs(prev => [...prev, "✓ Dispatched high-intent community builder alert to SDR Manager."]);
      setIsAnswering(false);
    }, 6000);
  };

  return (
    <div style={{ position: "relative", width: "100%", paddingBottom: "40px" }}>
      {/* Background Radial Glow */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.04) 0%, transparent 70%)",
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
            <Sparkles size={16} color="var(--accent-color)" />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accent-color)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Community Revenue Motion
            </span>
          </div>
          <h1>Community Inbound Triage</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Builder support & intent triage: Intercept forum support questions, audit ambassador profile values, and automate technical responses.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "24px", position: "relative", zIndex: 10 }}>
        
        {/* Left Side: Community Signals */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "24px", backdropFilter: "blur(12px)" }}>
            <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Users size={18} color="var(--accent-color)" />
                <h2 style={{ fontFamily: "var(--font-sora)", fontSize: "1.1rem", fontWeight: 600 }}>Active Inbound Builder Signals</h2>
              </div>
              <span style={{ fontSize: "0.65rem", background: "rgba(14, 165, 233, 0.1)", color: "var(--accent-color)", padding: "3px 6px", borderRadius: "4px", fontWeight: 700 }}>
                Support Queue
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {signals.map((sig, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", borderRadius: "12px", transition: "all 0.3s ease" }}>
                  <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "white" }}>@{sig.user}</span>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>at {sig.company}</span>
                      <span style={{ fontSize: "0.6rem", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: "4px", fontWeight: 600 }}>{sig.source}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ fontSize: "0.65rem", color: "var(--text-secondary)", textAlign: "right" }}>
                        <span>Ambassador Score: <strong style={{ color: "white" }}>{sig.ambassadorScore}%</strong></span>
                      </div>
                      
                      <button
                        onClick={() => triggerAnswer(sig.id)}
                        disabled={isAnswering || sig.status !== "pending"}
                        style={{
                          background: sig.status === "resolved"
                            ? "rgba(16, 185, 129, 0.15)"
                            : sig.status === "generating"
                            ? "rgba(255,255,255,0.05)"
                            : "linear-gradient(135deg, var(--accent-color), #4f46e5)",
                          border: sig.status === "resolved" ? "1px solid rgba(16, 185, 129, 0.5)" : "none",
                          color: sig.status === "resolved" ? "var(--success-color)" : "white",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: (isAnswering || sig.status !== "pending") ? "not-allowed" : "pointer",
                          transition: "all 0.3s ease"
                        }}
                      >
                        {sig.status === "resolved" ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><Check size={12} strokeWidth={3} /> Resolved</div>
                        ) : sig.status === "generating" ? (
                          <RefreshCw size={12} className="spin-icon" />
                        ) : (
                          "Resolve Objections"
                        )}
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: "0.75rem", color: "var(--text-primary)", lineHeight: "1.4", background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "8px" }}>
                    "{sig.message}"
                  </p>

                  {sig.response && (
                    <div style={{ padding: "12px", background: "rgba(14, 165, 233, 0.05)", border: "1px solid rgba(14, 165, 233, 0.2)", borderRadius: "8px", animation: "fade-in 0.3s ease" }}>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "0.65rem", color: "var(--accent-color)", fontWeight: 700, marginBottom: "4px" }}>
                        <Cpu size={12} />
                        <span>AGENT RESPONSE GENERATED</span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                        {sig.response}
                      </p>
                    </div>
                  )}

                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Right Side: Community Operations Logs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "24px", backdropFilter: "blur(12px)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Terminal size={18} color="var(--accent-color)" />
                  <h2 style={{ fontFamily: "var(--font-sora)", fontSize: "1.1rem", fontWeight: 600 }}>Community SLA console</h2>
                </div>
                <span style={{ fontSize: "0.65rem", color: "var(--accent-color)", background: "rgba(14, 165, 233, 0.1)", padding: "3px 6px", borderRadius: "4px", fontWeight: 700 }}>
                  Agent 02c
                </span>
              </div>

              {logs.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "14px", maxHeight: "320px", overflowY: "auto" }}>
                  {logs.map((log, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", justifyItems: "flex-start", fontSize: "0.7rem", color: log.startsWith("✓") ? "var(--success-color)" : "var(--text-secondary)" }}>
                      <span>•</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", border: "1px dashed var(--border-color)", borderRadius: "12px", color: "var(--text-secondary)", fontSize: "0.8rem", width: "100%" }}>
                  <AlertCircle size={24} style={{ marginBottom: "12px", color: "var(--text-secondary)" }} />
                  <span>Intercept support tickets or GitHub stars in the support list and trigger auto-resolution workflows.</span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "12px", background: "rgba(14, 165, 233, 0.05)", border: "1px solid rgba(14, 165, 233, 0.2)", borderRadius: "10px", marginTop: "20px" }}>
              <MessageSquare size={16} color="var(--accent-color)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                Head of Community Agent monitors developer and ambassador activities, calculates social score multipliers, auto-resolves queries with documentation lookups, and escalates corporate leads to SDR sequences.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
