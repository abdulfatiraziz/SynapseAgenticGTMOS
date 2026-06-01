"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Play,
  Check,
  RefreshCw,
  Terminal,
  Database,
  Award,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  UserCheck,
  AlertCircle
} from "lucide-react";

interface ProspectInput {
  name: string;
  domain: string;
  icpConstraints: string;
}

interface StepLog {
  agent: string;
  action: string;
  status: "idle" | "running" | "done" | "error";
  time?: string;
}

export default function AgencyDemoDashboard() {
  const [prospect, setProspect] = useState<ProspectInput>({
    name: "Stripe",
    domain: "stripe.com",
    icpConstraints: "Employee count > 200, uses AWS/GCP, B2B product motion"
  });

  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [logs, setLogs] = useState<StepLog[]>([
    { agent: "RevOps Agent (03e)", action: "Intercept new lead trigger and check SAIF input filter", status: "idle" },
    { agent: "Apollo Lead Prospecting", action: "Query contacts, email addresses, and title matches in Apollo API", status: "idle" },
    { agent: "Clay Data Enrichment", action: "Enrich account profile (cloud spend, web tech, employee count) in Clay", status: "idle" },
    { agent: "HubSpot CRM Sync", action: "Create Contact, Account, and Deal opportunities in CRM database", status: "idle" },
    { agent: "Critic Agent (Agent-as-a-Judge)", action: "Audit execution trajectory log, check compliance, and issue scorecard", status: "idle" }
  ]);

  const [scorecard, setScorecard] = useState<{
    planQuality: number;
    toolUsage: number;
    contextHandling: number;
    efficiency: number;
    compositeScore: number;
    comments: string;
    show: boolean;
  }>({
    planQuality: 0,
    toolUsage: 0,
    contextHandling: 0,
    efficiency: 0,
    compositeScore: 0,
    comments: "",
    show: false
  });

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setScorecard(prev => ({ ...prev, show: false }));
    setActiveStep(0);
    
    // Reset all steps to idle except first
    setLogs([
      { agent: "RevOps Agent (03e)", action: "Intercept new lead trigger and check SAIF input filter", status: "running" },
      { agent: "Apollo Lead Prospecting", action: "Query contacts, email addresses, and title matches in Apollo API", status: "idle" },
      { agent: "Clay Data Enrichment", action: "Enrich account profile (cloud spend, web tech, employee count) in Clay", status: "idle" },
      { agent: "HubSpot CRM Sync", action: "Create Contact, Account, and Deal opportunities in CRM database", status: "idle" },
      { agent: "Critic Agent (Agent-as-a-Judge)", action: "Audit execution trajectory log, check compliance, and issue scorecard", status: "idle" }
    ]);

    // Step-by-step progress simulation
    setTimeout(() => {
      // Step 1 done, Step 2 starts
      setLogs(prev => {
        const next = [...prev];
        next[0].status = "done";
        next[0].time = "1.2s";
        next[1].status = "running";
        return next;
      });
      setActiveStep(1);
    }, 1500);

    setTimeout(() => {
      // Step 2 done, Step 3 starts
      setLogs(prev => {
        const next = [...prev];
        next[1].status = "done";
        next[1].time = "2.1s";
        next[2].status = "running";
        return next;
      });
      setActiveStep(2);
    }, 3500);

    setTimeout(() => {
      // Step 3 done, Step 4 starts
      setLogs(prev => {
        const next = [...prev];
        next[2].status = "done";
        next[2].time = "3.4s";
        next[3].status = "running";
        return next;
      });
      setActiveStep(3);
    }, 6000);

    setTimeout(() => {
      // Step 4 done, Step 5 starts (Critic Audit)
      setLogs(prev => {
        const next = [...prev];
        next[3].status = "done";
        next[3].time = "1.8s";
        next[4].status = "running";
        return next;
      });
      setActiveStep(4);
    }, 8000);

    setTimeout(() => {
      // Step 5 done, Show Scorecard
      setLogs(prev => {
        const next = [...prev];
        next[4].status = "done";
        next[4].time = "1.5s";
        return next;
      });
      setActiveStep(5);
      setIsRunning(false);

      // Generate realistic scorecard metrics based on ICP matched or custom text
      const nameHash = prospect.name.length + prospect.domain.length;
      const q = Math.min(100, 92 + (nameHash % 9));
      const t = Math.min(100, 94 + (nameHash % 7));
      const c = Math.min(100, 90 + (nameHash % 11));
      const e = Math.min(100, 89 + (nameHash % 12));
      const comp = Math.round((q + t + c + e) / 4);

      setScorecard({
        planQuality: q,
        toolUsage: t,
        contextHandling: c,
        efficiency: e,
        compositeScore: comp,
        comments: `Critic Audit Result: The simulated multi-agent GTM motion for ${prospect.name} (${prospect.domain}) was completed successfully. RevOps input checks successfully verified through SAIF layer (PII redacted correctly). Apollo prospecting returned 4 primary matching buyer contacts. Clay TAM enrichment passed constraint checks: ${prospect.icpConstraints}. CRM synced in HubSpot with Deal Stage assigned. High execution efficiency and zero agentic context-drift recorded.`,
        show: true
      });
    }, 10500);
  };

  return (
    <div style={{ position: "relative", width: "100%", paddingBottom: "40px" }}>
      {/* Background Radial Glow */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)",
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
              Enterprise Demo Portal
            </span>
          </div>
          <h1>Agency Sales Audit Demo</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Execute end-to-end simulated GTM agency motions, capture enriched lead intelligence, and generate real-time Critic compliance scorecards.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1.8fr)", gap: "24px", position: "relative", zIndex: 10 }}>
        
        {/* Left Side: Prospect Profile Setup Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "24px", backdropFilter: "blur(12px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <Layers size={18} color="var(--accent-color)" />
              <h2 style={{ fontFamily: "var(--font-sora)", fontSize: "1.1rem", fontWeight: 600 }}>Prospect Specifications</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Prospect Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>Prospect Company Name</label>
                <input
                  type="text"
                  value={prospect.name}
                  onChange={(e) => setProspect(prev => ({ ...prev, name: e.target.value }))}
                  disabled={isRunning}
                  style={{
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    outline: "none"
                  }}
                  placeholder="e.g. Acme Corp"
                />
              </div>

              {/* Prospect Domain */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>Company Domain</label>
                <input
                  type="text"
                  value={prospect.domain}
                  onChange={(e) => setProspect(prev => ({ ...prev, domain: e.target.value }))}
                  disabled={isRunning}
                  style={{
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    outline: "none"
                  }}
                  placeholder="e.g. acme.com"
                />
              </div>

              {/* ICP Constraints */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>Target ICP Constraints</label>
                <textarea
                  value={prospect.icpConstraints}
                  onChange={(e) => setProspect(prev => ({ ...prev, icpConstraints: e.target.value }))}
                  disabled={isRunning}
                  rows={4}
                  style={{
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    outline: "none",
                    resize: "none",
                    fontFamily: "inherit",
                    lineHeight: "1.4"
                  }}
                  placeholder="e.g. Employee count > 500, uses AWS, Salesforce integration exists..."
                />
              </div>

              {/* Run Trigger Button */}
              <button
                onClick={runSimulation}
                disabled={isRunning || !prospect.name || !prospect.domain}
                style={{
                  background: isRunning ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, var(--accent-color), #4f46e5)",
                  border: "none",
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: isRunning ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: isRunning ? "none" : "0 4px 15px rgba(59, 130, 246, 0.3)",
                  transition: "all 0.3s ease",
                  marginTop: "8px"
                }}
              >
                {isRunning ? (
                  <>
                    <RefreshCw size={16} className="spin-icon" />
                    <span>Executing Agency Run...</span>
                  </>
                ) : (
                  <>
                    <Play size={16} fill="white" />
                    <span>Simulate Agency Motion</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Model Armor Live Banner */}
          <div style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "12px", padding: "16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <Shield size={18} color="var(--success-color)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--success-color)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Model Armor Guardrails Active</span>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: "1.4", marginTop: "4px" }}>
                PII scanning and masking rules are automatically applied to all outbound integrations (Apollo enrichment, HubSpot Sync) to redact emails, phone numbers, and keys before writes.
              </p>
            </div>
          </div>

        </div>

        {/* Right Side: Multi-Agent Workflow and Critic Scorecard */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Simulation Steps Indicator */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "24px", backdropFilter: "blur(12px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Terminal size={18} color="var(--accent-color)" />
                <h2 style={{ fontFamily: "var(--font-sora)", fontSize: "1.1rem", fontWeight: 600 }}>Multi-Agent Execution Pipeline</h2>
              </div>
              <span style={{ fontSize: "0.7rem", color: isRunning ? "var(--warning-color)" : "var(--text-secondary)", background: isRunning ? "rgba(245, 158, 11, 0.1)" : "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: "6px", fontWeight: 600 }}>
                {isRunning ? "Active Telemetry" : "Ready to Trigger"}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {logs.map((log, index) => {
                const isActive = activeStep === index;
                const isDone = log.status === "done";
                
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      background: isActive ? "rgba(59, 130, 246, 0.06)" : "rgba(255,255,255,0.01)",
                      border: `1px solid ${isActive ? "rgba(59, 130, 246, 0.3)" : isDone ? "rgba(16, 185, 129, 0.2)" : "var(--border-color)"}`,
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    {/* Active Step Glow Bar */}
                    {isActive && (
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: "4px",
                          background: "var(--accent-color)"
                        }}
                      />
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      {/* Icon Indicator */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: isDone 
                            ? "rgba(16, 185, 129, 0.1)" 
                            : isActive 
                            ? "rgba(59, 130, 246, 0.15)" 
                            : "rgba(255,255,255,0.03)",
                          border: `1px solid ${
                            isDone 
                              ? "var(--success-color)" 
                              : isActive 
                              ? "var(--accent-color)" 
                              : "rgba(255,255,255,0.1)"
                          }`,
                          color: isDone ? "var(--success-color)" : isActive ? "var(--accent-color)" : "var(--text-secondary)",
                          transition: "all 0.3s ease"
                        }}
                      >
                        {isDone ? (
                          <Check size={14} strokeWidth={3} />
                        ) : isActive ? (
                          <RefreshCw size={12} className="spin-icon" />
                        ) : (
                          <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{index + 1}</span>
                        )}
                      </div>

                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: isActive ? "var(--text-primary)" : "var(--text-secondary)" }}>
                            {log.agent}
                          </span>
                          {isActive && (
                            <span style={{ fontSize: "0.6rem", background: "var(--accent-color)", color: "white", padding: "1px 5px", borderRadius: "4px", fontWeight: 700, textTransform: "uppercase" }}>
                              Processing
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: "0.75rem", color: isActive ? "var(--text-primary)" : "var(--text-secondary)", marginTop: "2px" }}>
                          {log.action}
                        </p>
                      </div>
                    </div>

                    <div>
                      {isDone && log.time && (
                        <span style={{ fontSize: "0.7rem", color: "var(--success-color)", background: "rgba(16, 185, 129, 0.1)", padding: "3px 7px", borderRadius: "6px", fontWeight: 600 }}>
                          {log.time}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Critic Scorecard Panel (Triggered after execution completes) */}
          {scorecard.show && (
            <div
              style={{
                background: "var(--card-bg)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 20px rgba(168, 85, 247, 0.1)",
                backdropFilter: "blur(12px)",
                animation: "slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Award size={20} color="#a855f7" />
                  <h2 style={{ fontFamily: "var(--font-sora)", fontSize: "1.15rem", fontWeight: 600 }}>Critic Trajectory Grader</h2>
                </div>
                <div style={{ fontSize: "0.85rem", color: "white", background: "linear-gradient(135deg, #a855f7, #6366f1)", padding: "4px 10px", borderRadius: "8px", fontWeight: 700 }}>
                  Composite Score: {scorecard.compositeScore}%
                </div>
              </div>

              {/* 4 Performance Pillar Metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                
                {/* Pillar 1: Plan Quality */}
                <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-color)", padding: "12px", borderRadius: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "6px" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Plan Quality</span>
                    <span style={{ fontWeight: 700, color: "white" }}>{scorecard.planQuality} / 100</span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}>
                    <div style={{ width: `${scorecard.planQuality}%`, height: "100%", background: "#a855f7", borderRadius: "2px" }} />
                  </div>
                </div>

                {/* Pillar 2: Tool Usage */}
                <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-color)", padding: "12px", borderRadius: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "6px" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Tool Usage Accuracy</span>
                    <span style={{ fontWeight: 700, color: "white" }}>{scorecard.toolUsage} / 100</span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}>
                    <div style={{ width: `${scorecard.toolUsage}%`, height: "100%", background: "#a855f7", borderRadius: "2px" }} />
                  </div>
                </div>

                {/* Pillar 3: Context Handling */}
                <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-color)", padding: "12px", borderRadius: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "6px" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Context Handling</span>
                    <span style={{ fontWeight: 700, color: "white" }}>{scorecard.contextHandling} / 100</span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}>
                    <div style={{ width: `${scorecard.contextHandling}%`, height: "100%", background: "#a855f7", borderRadius: "2px" }} />
                  </div>
                </div>

                {/* Pillar 4: Efficiency */}
                <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-color)", padding: "12px", borderRadius: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "6px" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Efficiency Score</span>
                    <span style={{ fontWeight: 700, color: "white" }}>{scorecard.efficiency} / 100</span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}>
                    <div style={{ width: `${scorecard.efficiency}%`, height: "100%", background: "#a855f7", borderRadius: "2px" }} />
                  </div>
                </div>

              </div>

              {/* Critic Comments Panel */}
              <div style={{ padding: "12px", background: "rgba(168, 85, 247, 0.05)", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: "12px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <AlertCircle size={14} color="#a855f7" style={{ marginTop: "2px", flexShrink: 0 }} />
                  <p style={{ fontSize: "0.75rem", lineHeight: "1.45", color: "var(--text-primary)" }}>
                    {scorecard.comments}
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
