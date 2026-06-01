"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Search,
  Globe,
  TrendingUp,
  Cpu,
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

interface KeywordMetrics {
  keyword: string;
  volume: string;
  difficulty: number;
  cpc: string;
  globalTrends: Array<{ country: string; pct: number }>;
}

interface AdDraft {
  headlines: string[];
  descriptions: string[];
  ctaUrl: string;
}

interface DeploymentStep {
  log: string;
  status: "idle" | "running" | "done";
}

export default function SemOptimizerDashboard() {
  const [searchTerm, setSearchTerm] = useState("AI agents for GTM");
  const [isQuerying, setIsQuerying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [hasDeployed, setHasDeployed] = useState(false);

  const [metrics, setMetrics] = useState<KeywordMetrics | null>(null);
  const [adCopy, setAdCopy] = useState<AdDraft | null>(null);

  const [deploymentLogs, setDeploymentLogs] = useState<DeploymentStep[]>([
    { log: "Initialize Google Ads API Gateway session...", status: "idle" },
    { log: "Define B2B ICP audience targeting parameters...", status: "idle" },
    { log: "Configure target keyword group bids (Ahrefs CPC model)...", status: "idle" },
    { log: "Deploy 3 active Search Ad Headline drafts to campaign...", status: "idle" },
    { log: "Campaign synchronized with Google Search Ad Center successfully.", status: "idle" }
  ]);

  const [performance, setPerformance] = useState({
    impressions: 0,
    clicks: 0,
    ctr: 0,
    cpc: 0
  });

  const queryKeywords = () => {
    if (isQuerying) return;
    setIsQuerying(true);
    setMetrics(null);
    setAdCopy(null);
    setHasDeployed(false);

    setTimeout(() => {
      setMetrics({
        keyword: searchTerm,
        volume: "8.4k searches/mo",
        difficulty: 45,
        cpc: "$4.20",
        globalTrends: [
          { country: "United States", pct: 48 },
          { country: "United Kingdom", pct: 15 },
          { country: "European Union", pct: 22 },
          { country: "Others", pct: 15 }
        ]
      });
      setIsQuerying(false);
    }, 1200);
  };

  const generateAdCopy = () => {
    if (isGenerating || !metrics) return;
    setIsGenerating(true);
    setAdCopy(null);

    setTimeout(() => {
      setAdCopy({
        headlines: [
          "Scale Pipelines with GTM AI",
          "Synapse Autonomous GTM OS",
          "Qualify & Enrich Leads 24/7"
        ],
        descriptions: [
          "Deploy autonomous AI agents to qualify leads, enrich account data via Clay, and sync pipelines to HubSpot in real-time.",
          "Eliminate manual pipeline management. Integrate the 17-agent sales, marketing, and CS decision tree out-of-the-box."
        ],
        ctaUrl: "https://synapse.ai/demo"
      });
      setIsGenerating(false);
    }, 1500);
  };

  const deployCampaign = () => {
    if (isDeploying || !adCopy) return;
    setIsDeploying(true);
    setHasDeployed(false);

    setDeploymentLogs([
      { log: "Initialize Google Ads API Gateway session...", status: "running" },
      { log: "Define B2B ICP audience targeting parameters...", status: "idle" },
      { log: "Configure target keyword group bids (Ahrefs CPC model)...", status: "idle" },
      { log: "Deploy 3 active Search Ad Headline drafts to campaign...", status: "idle" },
      { log: "Campaign synchronized with Google Search Ad Center successfully.", status: "idle" }
    ]);

    setTimeout(() => {
      setDeploymentLogs(prev => {
        const next = [...prev];
        next[0].status = "done";
        next[1].status = "running";
        return next;
      });
    }, 1000);

    setTimeout(() => {
      setDeploymentLogs(prev => {
        const next = [...prev];
        next[1].status = "done";
        next[2].status = "running";
        return next;
      });
    }, 2000);

    setTimeout(() => {
      setDeploymentLogs(prev => {
        const next = [...prev];
        next[2].status = "done";
        next[3].status = "running";
        return next;
      });
    }, 3000);

    setTimeout(() => {
      setDeploymentLogs(prev => {
        const next = [...prev];
        next[3].status = "done";
        next[4].status = "running";
        return next;
      });
    }, 4000);

    setTimeout(() => {
      setDeploymentLogs(prev => {
        const next = [...prev];
        next[4].status = "done";
        return next;
      });
      setIsDeploying(false);
      setHasDeployed(true);

      // Initialize performance metrics
      setPerformance({
        impressions: 12400,
        clicks: 968,
        ctr: 7.8,
        cpc: 4.12
      });
    }, 5000);
  };

  // Simulate dynamic running chart metrics once deployed
  useEffect(() => {
    if (!hasDeployed) return;
    const interval = setInterval(() => {
      setPerformance(prev => ({
        impressions: prev.impressions + Math.floor(Math.random() * 20) + 5,
        clicks: prev.clicks + (Math.random() > 0.6 ? 1 : 0),
        ctr: parseFloat((7.6 + Math.random() * 0.4).toFixed(2)),
        cpc: parseFloat((4.05 + Math.random() * 0.15).toFixed(2))
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [hasDeployed]);

  return (
    <div style={{ position: "relative", width: "100%", paddingBottom: "40px" }}>
      {/* Background Radial Glow */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, transparent 70%)",
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
              SEO & SEM Optimization
            </span>
          </div>
          <h1>SEM Ad Optimizer</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Search signals intelligence engine: Discover keywords with Ahrefs, generate ad copies with SEO Agents, and launch automated Google Ads.
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", gap: "24px", position: "relative", zIndex: 10 }}>
        
        {/* Column 1: Ahrefs Keyword Discovery */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "24px", backdropFilter: "blur(12px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <Search size={18} color="var(--accent-color)" />
              <h2 style={{ fontFamily: "var(--font-sora)", fontSize: "1.1rem", fontWeight: 600 }}>Ahrefs Keyword Discovery</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Keyword Input */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>Target Search Concept</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isQuerying || isDeploying}
                    style={{
                      background: "rgba(0,0,0,0.2)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      fontSize: "0.85rem",
                      outline: "none",
                      flex: 1
                    }}
                    placeholder="e.g. AI agents for GTM"
                  />
                  <button
                    onClick={queryKeywords}
                    disabled={isQuerying || isDeploying || !searchTerm}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--border-color)",
                      color: "white",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {isQuerying ? <RefreshCw size={14} className="spin-icon" /> : <Globe size={14} />}
                  </button>
                </div>
              </div>

              {/* Ahrefs Results gauges */}
              {metrics ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px", animation: "slide-down 0.3s ease" }}>
                  
                  {/* Volume Metric */}
                  <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "12px" }}>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>Monthly Volume</span>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "white", marginTop: "4px" }}>
                      {metrics.volume}
                    </div>
                  </div>

                  {/* Difficulty Metric */}
                  <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", marginBottom: "6px" }}>
                      <span style={{ color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>Keyword Difficulty</span>
                      <span style={{ fontWeight: 700, color: "var(--warning-color)" }}>{metrics.difficulty} / 100</span>
                    </div>
                    <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ width: `${metrics.difficulty}%`, height: "100%", background: "var(--warning-color)" }} />
                    </div>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)", display: "block", marginTop: "6px" }}>
                      Moderate competition. Ideal for niche agentic marketing.
                    </span>
                  </div>

                  {/* Average CPC */}
                  <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "12px" }}>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>Average Bid CPC</span>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--accent-color)", marginTop: "4px" }}>
                      {metrics.cpc}
                    </div>
                  </div>

                  {/* Global Trends list */}
                  <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "12px" }}>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Global Share</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {metrics.globalTrends.map((t, i) => (
                        <div key={i} style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", fontSize: "0.75rem" }}>
                          <span style={{ color: "var(--text-secondary)" }}>{t.country}</span>
                          <span style={{ fontWeight: 600 }}>{t.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", border: "1px dashed var(--border-color)", borderRadius: "12px", color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                  Search for a keyword category above to load SEO metrics from Ahrefs registry.
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Column 2: AI Ad Copy Generator */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "24px", backdropFilter: "blur(12px)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Cpu size={18} color="var(--accent-color)" />
                  <h2 style={{ fontFamily: "var(--font-sora)", fontSize: "1.1rem", fontWeight: 600 }}>AI Search Copy Proposer</h2>
                </div>
                <span style={{ fontSize: "0.65rem", color: "var(--accent-color)", background: "rgba(59, 130, 246, 0.1)", padding: "3px 6px", borderRadius: "4px", fontWeight: 700 }}>
                  Agent 03c
                </span>
              </div>

              {adCopy ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "slide-down 0.3s ease" }}>
                  
                  {/* Google Search Mock View */}
                  <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-color)", borderRadius: "14px", padding: "16px" }}>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "0.65rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                      <Globe size={10} />
                      <span>{adCopy.ctaUrl}</span>
                    </div>

                    {/* Headlines */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      {adCopy.headlines.map((hl, i) => (
                        <div key={i} style={{ color: "#60a5fa", fontSize: "1rem", fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}>
                          {hl} {i < adCopy.headlines.length - 1 ? "|" : ""}
                        </div>
                      ))}
                    </div>

                    {/* Descriptions */}
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: "1.4", marginTop: "8px" }}>
                      {adCopy.descriptions.join(" ")}
                    </p>
                  </div>

                  {/* Headline Breakdown Details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>Proposed Headlines</span>
                    {adCopy.headlines.map((hl, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "0.75rem", padding: "8px 12px", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", borderRadius: "8px" }}>
                        <span style={{ color: "var(--accent-color)", fontWeight: 700 }}>#{i+1}</span>
                        <span style={{ fontWeight: 500 }}>{hl}</span>
                      </div>
                    ))}
                  </div>

                  {/* Description Breakdown */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>Proposed Descriptions</span>
                    {adCopy.descriptions.map((desc, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", justifyItems: "flex-start", fontSize: "0.75rem", padding: "8px 12px", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", borderRadius: "8px" }}>
                        <p style={{ lineHeight: "1.35", color: "var(--text-secondary)" }}>{desc}</p>
                      </div>
                    ))}
                  </div>

                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", justifyItems: "center", alignItems: "center", padding: "60px 20px", border: "1px dashed var(--border-color)", borderRadius: "12px", color: "var(--text-secondary)", fontSize: "0.8rem", textAlign: "center" }}>
                  <AlertCircle size={24} style={{ marginBottom: "12px", color: "var(--text-secondary)" }} />
                  <span>Discover a keyword concept in the Ahrefs panel, then trigger SEO copy generation.</span>
                </div>
              )}
            </div>

            {metrics && (
              <button
                onClick={generateAdCopy}
                disabled={isGenerating || isDeploying}
                style={{
                  background: isGenerating ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, var(--accent-color), #4f46e5)",
                  border: "none",
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: isGenerating ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: isGenerating ? "none" : "0 4px 15px rgba(59, 130, 246, 0.3)",
                  transition: "all 0.3s ease",
                  marginTop: "20px"
                }}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={16} className="spin-icon" />
                    <span>Analyzing Keyword Semantics...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} fill="white" />
                    <span>Generate AI Ad Copies</span>
                  </>
                )}
              </button>
            )}

          </div>

        </div>

        {/* Column 3: Google Ads Campaign Deployment & Graph */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "24px", backdropFilter: "blur(12px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <Database size={18} color="var(--accent-color)" />
              <h2 style={{ fontFamily: "var(--font-sora)", fontSize: "1.1rem", fontWeight: 600 }}>Google Ads Campaign</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {adCopy && (
                <button
                  onClick={deployCampaign}
                  disabled={isDeploying || hasDeployed}
                  style={{
                    background: hasDeployed 
                      ? "rgba(16, 185, 129, 0.15)" 
                      : isDeploying 
                      ? "rgba(255,255,255,0.05)" 
                      : "linear-gradient(135deg, var(--success-color), #059669)",
                    border: hasDeployed ? "1px solid rgba(16, 185, 129, 0.5)" : "none",
                    color: hasDeployed ? "var(--success-color)" : "white",
                    padding: "12px 20px",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: (isDeploying || hasDeployed) ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: (isDeploying || hasDeployed) ? "none" : "0 4px 15px rgba(16, 185, 129, 0.3)",
                    transition: "all 0.3s ease"
                  }}
                >
                  {hasDeployed ? (
                    <>
                      <Check size={16} strokeWidth={3} />
                      <span>Campaign Active & Running</span>
                    </>
                  ) : isDeploying ? (
                    <>
                      <RefreshCw size={16} className="spin-icon" />
                      <span>Deploying Search Cadences...</span>
                    </>
                  ) : (
                    <>
                      <Play size={16} fill="white" />
                      <span>Deploy Google Campaign</span>
                    </>
                  )}
                </button>
              )}

              {/* Logs area during deployment */}
              {adCopy && (isDeploying || hasDeployed) && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "14px" }}>
                  <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase", display: "block" }}>API Deployment Logs</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {deploymentLogs.map((logStep, i) => (
                      <div key={i} style={{ display: "flex", justifyItems: "center", gap: "8px", fontSize: "0.7rem", color: logStep.status === "done" ? "var(--success-color)" : logStep.status === "running" ? "var(--accent-color)" : "var(--text-secondary)" }}>
                        {logStep.status === "done" ? (
                          <Check size={10} strokeWidth={3} style={{ flexShrink: 0, marginTop: "1px" }} />
                        ) : logStep.status === "running" ? (
                          <RefreshCw size={10} className="spin-icon" style={{ flexShrink: 0, marginTop: "1px" }} />
                        ) : (
                          <span style={{ width: "10px", textAlign: "center", display: "inline-block" }}>•</span>
                        )}
                        <span>{logStep.log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Running Performance Telemetry */}
              {hasDeployed ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px", animation: "slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
                  <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <TrendingUp size={14} color="var(--success-color)" />
                    <span style={{ fontSize: "0.7rem", color: "var(--success-color)", fontWeight: 700, textTransform: "uppercase" }}>Real-time Campaign Analytics</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    
                    {/* Impressions */}
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", padding: "10px", borderRadius: "10px" }}>
                      <span style={{ fontSize: "0.6rem", color: "var(--text-secondary)", display: "block" }}>Impressions</span>
                      <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "white" }}>{performance.impressions.toLocaleString()}</span>
                    </div>

                    {/* Clicks */}
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", padding: "10px", borderRadius: "10px" }}>
                      <span style={{ fontSize: "0.6rem", color: "var(--text-secondary)", display: "block" }}>Clicks</span>
                      <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "white" }}>{performance.clicks.toLocaleString()}</span>
                    </div>

                    {/* CTR */}
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", padding: "10px", borderRadius: "10px" }}>
                      <span style={{ fontSize: "0.6rem", color: "var(--text-secondary)", display: "block" }}>CTR (%)</span>
                      <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--success-color)" }}>{performance.ctr}%</span>
                    </div>

                    {/* Average CPC */}
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", padding: "10px", borderRadius: "10px" }}>
                      <span style={{ fontSize: "0.6rem", color: "var(--text-secondary)", display: "block" }}>Avg CPC ($)</span>
                      <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent-color)" }}>${performance.cpc}</span>
                    </div>

                  </div>
                </div>
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", border: "1px dashed var(--border-color)", borderRadius: "12px", color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                  Generate ad copy copies in the center panel, then click Deploy to initiate campaigns.
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
