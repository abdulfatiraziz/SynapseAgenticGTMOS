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
  Calendar,
  Mail,
  Terminal,
  AlertCircle
} from "lucide-react";

interface WebinarStats {
  title: string;
  registrants: number;
  attended: number;
  noShows: number;
  satisfactionRate: number;
  tier1NoShows: string[];
}

export default function EventPipelineDashboard() {
  const [stats, setStats] = useState<WebinarStats>({
    title: "Quarterly Agentic GTM Automation Briefing",
    registrants: 450,
    attended: 308,
    noShows: 142,
    satisfactionRate: 94,
    tier1NoShows: ["cyberdyne.com", "weyland-yutani.com", "umbrella_corp.com"]
  });

  const [isRunning, setIsRunning] = useState(false);
  const [hasDispatched, setHasDispatched] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const triggerFollowUps = () => {
    if (isRunning) return;
    setIsRunning(true);
    setHasDispatched(false);
    setEmailSubject("");
    setEmailBody("");
    
    setLogs([
      "Loading webinar attendance roster database...",
      `Filtering 'No-Show' list from total webinar registrations (No-Shows: ${stats.noShows})...`,
      "Enriching account directories to identify Tier-1 Target Enterprise accounts..."
    ]);

    setTimeout(() => {
      setLogs(prev => [...prev, `Identified 3 Tier-1 high-intent enterprise no-shows: ${stats.tier1NoShows.join(", ")}`]);
      setLogs(prev => [...prev, "Formulating automated callback template logic (Field & Events Agent 03d)..."]);
    }, 1500);

    setTimeout(() => {
      setLogs(prev => [...prev, "Generating custom video-replay landing pages with dynamic query hashes..."]);
    }, 2800);

    setTimeout(() => {
      const subject = "Missed you at our GTM Automation Briefing";
      const body = "Hi {{First_Name}},\n\nSorry you couldn't make it to our live session. We covered how autonomous AI agents automate Apollo lookup and Clay enrichments. Here is your custom replay link: https://synapse.ai/replay\n\nBest,\nField Operations Team";
      
      setEmailSubject(subject);
      setEmailBody(body);
      setLogs(prev => [...prev, `Email Subject Generated: "${subject}"`]);
    }, 4000);

    setTimeout(() => {
      setLogs(prev => [...prev, "Delivering follow-up sequence via Apollo.io API gateway integrations..."]);
      setLogs(prev => [...prev, "✓ Dispatched 142 follow-up cadences to no-shows."]);
      setLogs(prev => [...prev, "✓ Delegated Tier-1 cold outbound follow-ups to SDR Manager (03a)."]);
      setIsRunning(false);
      setHasDispatched(true);
    }, 5500);
  };

  return (
    <div style={{ position: "relative", width: "100%", paddingBottom: "40px" }}>
      {/* Background Radial Glow */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.04) 0%, transparent 70%)",
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
            <Sparkles size={16} color="var(--warning-color)" />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--warning-color)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Event-Led Operations
            </span>
          </div>
          <h1>Webinar Follow-Up Triage</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Virtual conference & meetup pipeline: Track webinar attendance metrics, identify Tier-1 no-shows, and automate personalized callback sequences.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px", position: "relative", zIndex: 10 }}>
        
        {/* Left Side: Webinar Metrics & Attendance Funnel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "24px", backdropFilter: "blur(12px)" }}>
            <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Calendar size={18} color="var(--warning-color)" />
                <h2 style={{ fontFamily: "var(--font-sora)", fontSize: "1.1rem", fontWeight: 600 }}>Webinar Funnel Telemetry</h2>
              </div>
              <span style={{ fontSize: "0.65rem", background: "rgba(245, 158, 11, 0.1)", color: "var(--warning-color)", padding: "3px 6px", borderRadius: "4px", fontWeight: 700 }}>
                Quarterly Briefing
              </span>
            </div>

            <p style={{ fontSize: "0.85rem", color: "white", fontWeight: 600, marginBottom: "16px" }}>
              {stats.title}
            </p>

            {/* Attendance Metrics grids */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              
              {/* Registrants */}
              <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "12px" }}>
                <span style={{ fontSize: "0.6rem", color: "var(--text-secondary)", textTransform: "uppercase", display: "block" }}>Total Registrants</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "white" }}>{stats.registrants} Signups</span>
              </div>

              {/* Attended */}
              <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "12px" }}>
                <span style={{ fontSize: "0.6rem", color: "var(--text-secondary)", textTransform: "uppercase", display: "block" }}>Attended Live</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--success-color)" }}>{stats.attended} ({(stats.attended/stats.registrants * 100).toFixed(0)}%)</span>
              </div>

              {/* No-Shows */}
              <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "12px" }}>
                <span style={{ fontSize: "0.6rem", color: "var(--text-secondary)", textTransform: "uppercase", display: "block" }}>No-Shows</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--warning-color)" }}>{stats.noShows} ({(stats.noShows/stats.registrants * 100).toFixed(0)}%)</span>
              </div>

              {/* Satisfaction Rate */}
              <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "12px" }}>
                <span style={{ fontSize: "0.6rem", color: "var(--text-secondary)", textTransform: "uppercase", display: "block" }}>CSAT Rating</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "white" }}>{stats.satisfactionRate}% positive</span>
              </div>

            </div>

            {/* Tier-1 No-shows listed */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>Tier-1 Enterprise No-Shows</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {stats.tier1NoShows.map((n, i) => (
                  <span key={i} style={{ fontSize: "0.7rem", padding: "4px 8px", background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.2)", color: "var(--warning-color)", borderRadius: "6px" }}>
                    {n}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Side: Follow-up Operations console */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "24px", backdropFilter: "blur(12px)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Terminal size={18} color="var(--warning-color)" />
                  <h2 style={{ fontFamily: "var(--font-sora)", fontSize: "1.1rem", fontWeight: 600 }}>Webinar Operations console</h2>
                </div>
                <span style={{ fontSize: "0.65rem", color: "var(--warning-color)", background: "rgba(245, 158, 11, 0.1)", padding: "3px 6px", borderRadius: "4px", fontWeight: 700 }}>
                  Agent 03d
                </span>
              </div>

              {logs.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "14px", maxHeight: "180px", overflowY: "auto" }}>
                    {logs.map((log, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", justifyItems: "flex-start", fontSize: "0.7rem", color: log.startsWith("✓") ? "var(--success-color)" : "var(--text-secondary)" }}>
                        <span>•</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>

                  {hasDispatched && emailSubject && (
                    <div style={{ padding: "12px", background: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "10px", animation: "fade-in 0.3s ease" }}>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "0.65rem", color: "var(--warning-color)", fontWeight: 700, marginBottom: "8px" }}>
                        <Mail size={12} />
                        <span>DISPATCHED OUTBOUND CADENCE</span>
                      </div>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "white", display: "block" }}>Subject: {emailSubject}</span>
                      <pre style={{ fontSize: "0.7rem", color: "var(--text-secondary)", lineHeight: "1.4", fontFamily: "inherit", whiteSpace: "pre-wrap", marginTop: "8px", borderTop: "1px solid var(--border-color)", paddingTop: "8px" }}>
                        {emailBody}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", border: "1px dashed var(--border-color)", borderRadius: "12px", color: "var(--text-secondary)", fontSize: "0.8rem", width: "100%" }}>
                  <AlertCircle size={24} style={{ marginBottom: "12px", color: "var(--text-secondary)" }} />
                  <span>Choose webinar status lists above and dispatch automated post-event no-show recovery templates.</span>
                </div>
              )}
            </div>

            <button
              onClick={triggerFollowUps}
              disabled={isRunning || hasDispatched}
              style={{
                background: hasDispatched 
                  ? "rgba(16, 185, 129, 0.15)" 
                  : isRunning 
                  ? "rgba(255,255,255,0.05)" 
                  : "linear-gradient(135deg, var(--warning-color), #d97706)",
                border: hasDispatched ? "1px solid rgba(16, 185, 129, 0.5)" : "none",
                color: hasDispatched ? "var(--success-color)" : "white",
                padding: "12px 20px",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: (isRunning || hasDispatched) ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: (isRunning || hasDispatched) ? "none" : "0 4px 15px rgba(245, 158, 11, 0.3)",
                transition: "all 0.3s ease",
                marginTop: "20px"
              }}
            >
              {hasDispatched ? (
                <>
                  <Check size={16} strokeWidth={3} />
                  <span>Follow-Up Cadences Dispatched</span>
                </>
              ) : isRunning ? (
                <>
                  <RefreshCw size={16} className="spin-icon" />
                  <span>Drafting Objections Recovery...</span>
                </>
              ) : (
                <>
                  <Zap size={16} fill="white" />
                  <span>Dispatch No-Show Recoveries</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
