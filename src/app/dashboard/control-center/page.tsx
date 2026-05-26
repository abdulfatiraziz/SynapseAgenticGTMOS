"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Cpu, 
  Wrench, 
  ShieldAlert, 
  Coins, 
  Plus, 
  Trash2, 
  Save, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  HelpCircle,
  Undo2,
  X
} from "lucide-react";
import s from "./page.module.css";

/* ─── Static Agents Information for UI ─── */
const ALL_AGENTS = [
  // Strategy Layer
  { id: "01", name: "CMO Agent", layer: "Strategy", color: "#3b82f6", desc: "Master orchestrator — allocates budget, routes missions, sets OKRs." },
  { id: "01b", name: "VP Product Marketing", layer: "Strategy", color: "#3b82f6", desc: "Translates product capabilities into enterprise pain-and-proof buyer narratives." },
  { id: "01c", name: "Pricing & Packaging", layer: "Strategy", color: "#3b82f6", desc: "Models LTV, CAC, payback periods, and data-driven package tiers." },
  { id: "01d", name: "Market Intel Analyst", layer: "Strategy", color: "#3b82f6", desc: "Monitors intent signals, G2 competitor activities, and funding news." },
  
  // Motions Layer
  { id: "02a", name: "VP Sales", layer: "Motions", color: "#8b5cf6", desc: "Leads enterprise SLG pipeline math, coverage ratios, and ACV forecasting." },
  { id: "02b", name: "Head of PLG", layer: "Motions", color: "#8b5cf6", desc: "Owns self-serve product loops, funnels, and activation triggers." },
  { id: "02c", name: "Head of Community", layer: "Motions", color: "#8b5cf6", desc: "Measures and builds developer community as an active pipeline motion." },
  { id: "02d", name: "VP Partnerships", layer: "Motions", color: "#8b5cf6", desc: "Manages partner-led GTM motions and Crossbeam account mapping." },
  
  // Channels Layer
  { id: "03a", name: "SDR Manager", layer: "Channels", color: "#ec4899", desc: "Enriches leads, writes personalised sequences, books meetings." },
  { id: "03b", name: "Demand Gen Manager", layer: "Channels", color: "#ec4899", desc: "Generates pipeline opportunities via optimized paid media campaigns." },
  { id: "03c", name: "Content & SEO Lead", layer: "Channels", color: "#ec4899", desc: "Aligns keyword clusters and buyer journey content to target ICP intent." },
  { id: "03d", name: "Field & Events Manager", layer: "Channels", color: "#ec4899", desc: "Orchestrates online/offline events and tracks event pipeline ROI." },
  { id: "03e", name: "Head of RevOps", layer: "Channels", color: "#ec4899", desc: "Automates CRM hygiene, routing rules, and multi-touch pipeline attribution." },

  // Execution / CS Layer
  { id: "04a", name: "VP Customer Success", layer: "Customer Success", color: "#10b981", desc: "Drives Net Revenue Retention (NRR) and directs strategic CSM playbooks." },
  { id: "04b", name: "CS Manager (CSM)", layer: "Customer Success", color: "#10b981", desc: "Ensures customer product value realization and flags expansion triggers." },
  { id: "04c", name: "Expansion AE", layer: "Customer Success", color: "#10b981", desc: "Partners with CSMs to convert product usage triggers into upsells." },
  { id: "04d", name: "Renewals Manager", layer: "Customer Success", color: "#10b981", desc: "Ensures commercial renewals complete on-time and tracks health scores." }
];

/* ─── Static Integration Tools List ─── */
const INTEGRATION_TOOLS = [
  { key: "HubSpot", name: "HubSpot", emoji: "🟠" },
  { key: "Apollo", name: "Apollo.io", emoji: "🔵" },
  { key: "Salesforce", name: "Salesforce", emoji: "💼" },
  { key: "Slack", name: "Slack", emoji: "💬" },
  { key: "Notion", name: "Notion", emoji: "📓" },
  { key: "Clay", name: "Clay", emoji: "🌀" },
  { key: "Make", name: "Make.com", emoji: "⚙️" },
  { key: "Zapier", name: "Zapier", emoji: "⚡" },
  { key: "Gainsight", name: "Gainsight", emoji: "📈" },
  { key: "ChurnZero", name: "ChurnZero", emoji: "🔄" },
  { key: "Crossbeam", name: "Crossbeam", emoji: "🤝" },
  { key: "Amplitude", name: "Amplitude", emoji: "📊" },
  { key: "DocuSign", name: "DocuSign", emoji: "✍️" },
  { key: "ProfitWell", name: "ProfitWell", emoji: "💸" },
  { key: "GoogleAds", name: "Google Ads", emoji: "📣" },
  { key: "MetaAds", name: "Meta Ads", emoji: "📘" },
  { key: "Ahrefs", name: "Ahrefs", emoji: "📊" },
  { key: "LinkedIn", name: "LinkedIn", emoji: "🔗" },
  { key: "Zoom", name: "Zoom", emoji: "🎥" },
  { key: "PostHog", name: "PostHog", emoji: "📈" }
];

export default function ControlCenter() {
  const [activeTab, setActiveTab] = useState<"company" | "agents" | "tools" | "hitl" | "budgets">("company");
  const [config, setConfig] = useState<any>(null);
  const [initialConfig, setInitialConfig] = useState<any>(null);
  
  // Loading & Action feedback
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Tag editor input
  const [newPersona, setNewPersona] = useState("");

  // Agent prompt override dialog states
  const [editingAgent, setEditingAgent] = useState<{ id: string; name: string } | null>(null);
  const [tempPrompt, setTempPrompt] = useState("");

  // Canary rules temp states
  const [canaryAgent, setCanaryAgent] = useState("");
  const [canaryV2Id, setCanaryV2Id] = useState("");
  const [canarySplit, setCanarySplit] = useState(10);

  const showFeedback = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/config");
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        // Deep copy
        setInitialConfig(JSON.parse(JSON.stringify(data.config)));
      } else {
        showFeedback("Failed to load configuration", "error");
      }
    } catch (e) {
      showFeedback("Error contacting API gateway", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial config
  useEffect(() => {
    fetchConfig();
  }, []);

  // Check if configuration has been modified
  const isDirty = () => {
    if (!config || !initialConfig) return false;
    return JSON.stringify(config) !== JSON.stringify(initialConfig);
  };

  // Revert changes to initial state
  const handleRevert = () => {
    if (initialConfig) {
      setConfig(JSON.parse(JSON.stringify(initialConfig)));
      showFeedback("Changes reverted to disk state", "success");
    }
  };

  // Save config back to synapse.config.ts
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config })
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("Configuration saved & hot-reloaded successfully!", "success");
        setInitialConfig(JSON.parse(JSON.stringify(config)));
      } else {
        showFeedback(`Save failed: ${data.error}`, "error");
      }
    } catch (e) {
      showFeedback("Error saving config", "error");
    } finally {
      setSaving(false);
    }
  };

  // Persona tag helpers
  const handleAddPersona = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newPersona.trim()) {
      e.preventDefault();
      const updatedPersonas = [...(config.company.target_personas || [])];
      if (!updatedPersonas.includes(newPersona.trim())) {
        updatedPersonas.push(newPersona.trim());
        updateConfig("company", { ...config.company, target_personas: updatedPersonas });
      }
      setNewPersona("");
    }
  };

  const handleRemovePersona = (persona: string) => {
    const updated = (config.company.target_personas || []).filter((p: string) => p !== persona);
    updateConfig("company", { ...config.company, target_personas: updated });
  };

  // Utility to update partial config key
  const updateConfig = (section: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      [section]: value
    }));
  };

  // Agent toggling
  const toggleAgent = (agentId: string) => {
    const activeList = [...(config.agents.active || [])];
    const index = activeList.indexOf(agentId);
    if (index > -1) {
      // Deactivate (remove)
      activeList.splice(index, 1);
    } else {
      // Activate (add)
      activeList.push(agentId);
    }
    updateConfig("agents", { ...config.agents, active: activeList });
  };

  // Prompt overrides modal logic
  const openPromptDialog = (agentId: string, agentName: string) => {
    setEditingAgent({ id: agentId, name: agentName });
    const currentOverride = config.agents.prompt_overrides?.[agentId] || "";
    setTempPrompt(currentOverride);
  };

  const savePromptOverride = () => {
    if (!editingAgent) return;
    const overrides = { ...(config.agents.prompt_overrides || {}) };
    if (tempPrompt.trim()) {
      overrides[editingAgent.id] = tempPrompt.trim();
    } else {
      delete overrides[editingAgent.id];
    }
    updateConfig("agents", { ...config.agents, prompt_overrides: overrides });
    setEditingAgent(null);
  };

  // HITL Gates Checkboxes
  const toggleHitlGate = (gate: string) => {
    const gates = [...(config.hitl.gates || [])];
    const index = gates.indexOf(gate);
    if (index > -1) {
      gates.splice(index, 1);
    } else {
      gates.push(gate);
    }
    updateConfig("hitl", { ...config.hitl, gates });
  };

  // Memory Auto Store Events Checkboxes
  const toggleMemoryEvent = (event: string) => {
    const events = [...(config.memory.auto_store_events || [])];
    const index = events.indexOf(event);
    if (index > -1) {
      events.splice(index, 1);
    } else {
      events.push(event);
    }
    updateConfig("memory", { ...config.memory, auto_store_events: events });
  };

  // Add Canary deployment route
  const addCanaryRoute = () => {
    if (!canaryAgent || !canaryV2Id) return;
    const routing = { ...(config.canary.routing || {}) };
    routing[canaryAgent] = {
      v2_id: canaryV2Id,
      traffic_percentage: canarySplit
    };
    updateConfig("canary", { ...config.canary, routing });
    // Reset inputs
    setCanaryAgent("");
    setCanaryV2Id("");
    setCanarySplit(10);
  };

  const removeCanaryRoute = (agentId: string) => {
    const routing = { ...(config.canary.routing || {}) };
    delete routing[agentId];
    updateConfig("canary", { ...config.canary, routing });
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", flexDirection: "column", gap: "16px" }}>
        <svg className={s.spinner} viewBox="0 0 50 50">
          <circle className={s.spinnerCircle} cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
        </svg>
        <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Loading system configuration...</span>
      </div>
    );
  }

  return (
    <div className={s.container}>
      {/* Feedback toast banner */}
      {message && (
        <div style={{
          position: "fixed",
          top: "24px",
          right: "32px",
          zIndex: 2100,
          background: message.type === "success" ? "rgba(16, 185, 129, 0.95)" : "rgba(239, 68, 68, 0.95)",
          color: "white",
          padding: "16px 24px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontWeight: 600,
          fontSize: "0.95rem",
          backdropFilter: "blur(8px)",
          border: message.type === "success" ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(239,68,68,0.3)",
          animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>
          {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Title */}
      <div className={s.headerRow}>
        <div className={s.titleSection}>
          <h1>GTM Control Room</h1>
          <p>Configure, tune, and override active GTM agents, mock connection settings, and system safeguards.</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className={s.tabsList}>
          <button onClick={() => setActiveTab("company")} className={`${s.tabTrigger} ${activeTab === "company" ? s.active : ""}`}>
            <Building2 size={16} />
            <span>Company Profile</span>
          </button>
          <button onClick={() => setActiveTab("agents")} className={`${s.tabTrigger} ${activeTab === "agents" ? s.active : ""}`}>
            <Cpu size={16} />
            <span>Agent Orchestrator</span>
          </button>
          <button onClick={() => setActiveTab("tools")} className={`${s.tabTrigger} ${activeTab === "tools" ? s.active : ""}`}>
            <Wrench size={16} />
            <span>Tool Gateway</span>
          </button>
          <button onClick={() => setActiveTab("hitl")} className={`${s.tabTrigger} ${activeTab === "hitl" ? s.active : ""}`}>
            <ShieldAlert size={16} />
            <span>Guardrails & HITL</span>
          </button>
          <button onClick={() => setActiveTab("budgets")} className={`${s.tabTrigger} ${activeTab === "budgets" ? s.active : ""}`}>
            <Coins size={16} />
            <span>Budgets & Canaries</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className={s.tabContent}>
        {/* Tab 1: Company Profile */}
        {activeTab === "company" && (
          <div>
            <h2 className={s.panelTitle}>Company Profile</h2>
            <p className={s.panelDesc}>Define your company details. These values shape the context injected into every agent's cognitive core.</p>
            
            <div className={s.gridTwoCol}>
              <div>
                <div className={s.formGroup}>
                  <label htmlFor="companyName">Company Name</label>
                  <input 
                    id="companyName"
                    type="text" 
                    className={s.formInput} 
                    value={config.company.name || ""} 
                    onChange={e => updateConfig("company", { ...config.company, name: e.target.value })}
                  />
                </div>
                
                <div className={s.formGroup}>
                  <label htmlFor="companyWebsite">Website URL</label>
                  <input 
                    id="companyWebsite"
                    type="text" 
                    className={s.formInput} 
                    value={config.company.website || ""} 
                    onChange={e => updateConfig("company", { ...config.company, website: e.target.value })}
                  />
                </div>

                <div className={s.formGroup}>
                  <label htmlFor="companyVertical">Industry Vertical</label>
                  <input 
                    id="companyVertical"
                    type="text" 
                    className={s.formInput} 
                    value={config.company.vertical || ""} 
                    onChange={e => updateConfig("company", { ...config.company, vertical: e.target.value })}
                  />
                </div>
                
                <div className={s.formGroup}>
                  <label>Primary GTM Motion</label>
                  <div className={s.motionGrid}>
                    {[
                      { key: "plg", label: "Product-Led", desc: "Self-serve activation & triggers" },
                      { key: "slg", label: "Sales-Led", desc: "Enterprise sales cycles" },
                      { key: "hybrid", label: "Hybrid Playbook", desc: "Combined PLG + SLG funnel" }
                    ].map(motion => (
                      <div 
                        key={motion.key} 
                        className={`${s.motionCard} ${config.company.gtm_motion === motion.key ? s.selected : ""}`}
                        onClick={() => updateConfig("company", { ...config.company, gtm_motion: motion.key })}
                      >
                        <h3>{motion.label}</h3>
                        <p>{motion.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className={s.formGroup}>
                  <label htmlFor="icpSummary">Ideal Customer Profile (ICP) Summary</label>
                  <textarea 
                    id="icpSummary"
                    className={s.formTextarea} 
                    value={config.company.icp_summary || ""} 
                    onChange={e => updateConfig("company", { ...config.company, icp_summary: e.target.value })}
                    placeholder="Describe your ideal company size, funding, pain points, and triggers..."
                  />
                </div>

                <div className={s.formGroup}>
                  <label htmlFor="newPersonaInput">Target Buyer Personas</label>
                  <div className={s.tagContainer}>
                    {(config.company.target_personas || []).map((persona: string) => (
                      <span key={persona} className={s.tagBadge}>
                        {persona}
                        <button onClick={() => handleRemovePersona(persona)} className={s.tagDelete}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input 
                      id="newPersonaInput"
                      type="text" 
                      className={s.tagInput} 
                      placeholder="Type and press Enter to add..." 
                      value={newPersona}
                      onChange={e => setNewPersona(e.target.value)}
                      onKeyDown={handleAddPersona}
                    />
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>Press Enter to save target roles (e.g. CMO, VP Engineering).</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Agent Orchestrator */}
        {activeTab === "agents" && (
          <div>
            <h2 className={s.panelTitle}>Agent Orchestrator</h2>
            <p className={s.panelDesc}>Deploy and configure the 17 GTM specialists. Deactivated agents are muted in A2A routing and visual dashboards.</p>
            
            {["Strategy", "Motions", "Channels", "Customer Success"].map(layer => {
              const layerAgents = ALL_AGENTS.filter(a => a.layer === layer);
              const activeCount = layerAgents.filter(a => config.agents.active.includes(a.id)).length;
              
              return (
                <div key={layer} className={s.layerBlock}>
                  <div className={s.layerHeader}>
                    <div className={s.layerDot} style={{ background: layerAgents[0].color }} />
                    <span className={s.layerName}>{layer} Layer</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginLeft: "auto", fontWeight: 600 }}>
                      {activeCount} / {layerAgents.length} Active
                    </span>
                  </div>

                  <div className={s.agentsGrid}>
                    {layerAgents.map(agent => {
                      const isActive = config.agents.active.includes(agent.id);
                      const hasOverride = !!config.agents.prompt_overrides?.[agent.id];
                      
                      return (
                        <div key={agent.id} className={`${s.agentCard} ${isActive ? s.active : ""}`}>
                          <div className={s.agentCardHeader}>
                            <div>
                              <span className={s.agentBadge} style={{ background: `${agent.color}15`, color: agent.color }}>
                                AGENT {agent.id}
                              </span>
                              <h3 className={s.agentName} style={{ marginTop: "6px" }}>{agent.name}</h3>
                            </div>
                            <label className={s.switch}>
                              <input 
                                type="checkbox" 
                                checked={isActive} 
                                onChange={() => toggleAgent(agent.id)}
                              />
                              <span className={s.slider}></span>
                            </label>
                          </div>
                          
                          <p className={s.agentDesc}>{agent.desc}</p>
                          
                          <div className={s.agentCardFooter}>
                            <span style={{ fontSize: "0.75rem", color: isActive ? "var(--success-color)" : "var(--text-secondary)" }}>
                              {isActive ? "● Ready" : "○ Muted"}
                            </span>
                            
                            {isActive && (
                              <button 
                                onClick={() => openPromptDialog(agent.id, agent.name)}
                                className={s.configureBtn}
                              >
                                <Sparkles size={12} style={{ color: hasOverride ? "var(--warning-color)" : "inherit" }} />
                                <span>{hasOverride ? "Override Active" : "Tweak Persona"}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Tool Gateway */}
        {activeTab === "tools" && (
          <div>
            <h2 className={s.panelTitle}>Tool Gateway</h2>
            <p className={s.panelDesc}>Control API connections. Global default applies unless individually overridden. Flip tools to 'live' one at a time as you connect API credentials.</p>
            
            <div style={{ display: "flex", gap: "24px", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", padding: "20px", borderRadius: "12px", marginBottom: "28px", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>Global Default Connection Mode</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Choose whether tools call real APIs by default or mock JSON endpoints.</span>
              </div>
              <div className={s.modeToggle} style={{ marginLeft: "auto", minWidth: "160px" }}>
                <button 
                  className={`${s.modeBtn} ${config.tools.default_mode === "mock" ? s.active : ""}`}
                  onClick={() => updateConfig("tools", { ...config.tools, default_mode: "mock" })}
                >
                  Mock Engine
                </button>
                <button 
                  className={`${s.modeBtn} ${config.tools.default_mode === "live" ? s.activeLive : ""}`}
                  onClick={() => updateConfig("tools", { ...config.tools, default_mode: "live" })}
                >
                  Live APIs
                </button>
              </div>
            </div>

            <div className={s.toolsGrid}>
              {INTEGRATION_TOOLS.map(tool => {
                const currentOverride = config.tools.overrides[tool.key]; // 'live' | 'mock' | undefined
                const isOverridden = currentOverride !== undefined;
                const effectiveMode = currentOverride ?? config.tools.default_mode;
                
                return (
                  <div key={tool.key} className={s.toolCard}>
                    <div className={s.toolCardHeader}>
                      <span className={s.toolEmoji}>{tool.emoji}</span>
                      <span className={s.toolName}>{tool.name}</span>
                    </div>

                    <div className={s.modeToggle}>
                      <button 
                        className={`${s.modeBtn} ${!isOverridden ? s.active : ""}`}
                        onClick={() => {
                          const overrides = { ...config.tools.overrides };
                          delete overrides[tool.key];
                          updateConfig("tools", { ...config.tools, overrides });
                        }}
                      >
                        Global
                      </button>
                      <button 
                        className={`${s.modeBtn} ${isOverridden && currentOverride === "mock" ? s.active : ""}`}
                        onClick={() => {
                          const overrides = { ...config.tools.overrides, [tool.key]: "mock" };
                          updateConfig("tools", { ...config.tools, overrides });
                        }}
                      >
                        Mock
                      </button>
                      <button 
                        className={`${s.modeBtn} ${isOverridden && currentOverride === "live" ? s.activeLive : ""}`}
                        onClick={() => {
                          const overrides = { ...config.tools.overrides, [tool.key]: "live" };
                          updateConfig("tools", { ...config.tools, overrides });
                        }}
                      >
                        Live
                      </button>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                      <span>Status:</span>
                      <span style={{ color: effectiveMode === "live" ? "var(--success-color)" : "var(--accent-color)", fontWeight: 600 }}>
                        {effectiveMode === "live" ? "● Connected (Live)" : "○ Smart Mocks"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Guardrails & HITL */}
        {activeTab === "hitl" && (
          <div>
            <h2 className={s.panelTitle}>Guardrails & Safeguards</h2>
            <p className={s.panelDesc}>Configure Human-in-the-Loop gates to intercept outbound writes or customize pgvector agent long-term memory metrics.</p>
            
            <div className={s.gridTwoCol}>
              {/* HITL Column */}
              <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", padding: "24px", borderRadius: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Human-in-the-Loop (HITL)</h3>
                  <label className={s.switch}>
                    <input 
                      type="checkbox" 
                      checked={config.hitl.enabled} 
                      onChange={() => updateConfig("hitl", { ...config.hitl, enabled: !config.hitl.enabled })}
                    />
                    <span className={s.slider}></span>
                  </label>
                </div>

                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
                  When enabled, all tool calls matched by interceptor gates pause execution and request approval in Slack.
                </p>

                {config.hitl.enabled && (
                  <div>
                    <div className={s.formGroup}>
                      <label htmlFor="slackChannelInput">Slack Notification Channel ID</label>
                      <input 
                        id="slackChannelInput"
                        type="text" 
                        className={s.formInput} 
                        value={config.hitl.slack_channel_id || ""}
                        onChange={e => updateConfig("hitl", { ...config.hitl, slack_channel_id: e.target.value })}
                        placeholder="e.g. C0521XXXXXX"
                      />
                    </div>

                    <div className={s.formGroup}>
                      <label htmlFor="timeoutInput">Approval Expiry Timeout (Minutes)</label>
                      <div className={s.sliderWrapper}>
                        <input 
                          id="timeoutInput"
                          type="range" 
                          min="5" 
                          max="180" 
                          step="5"
                          className={s.sliderInput}
                          value={config.hitl.timeout_minutes || 30}
                          onChange={e => updateConfig("hitl", { ...config.hitl, timeout_minutes: parseInt(e.target.value) })}
                        />
                        <span className={s.sliderValue}>{config.hitl.timeout_minutes || 30} min</span>
                      </div>
                    </div>

                    <div className={s.formGroup} style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px" }}>
                      <label className={s.switchLabel}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>Auto-Approve on Timeout</span>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "none", letterSpacing: "none" }}>Automatically execute the tool call if no human responds.</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={config.hitl.auto_approve_on_timeout} 
                          onChange={() => updateConfig("hitl", { ...config.hitl, auto_approve_on_timeout: !config.hitl.auto_approve_on_timeout })}
                          style={{ width: "18px", height: "18px", accentColor: "var(--accent-color)" }}
                        />
                      </label>
                    </div>

                    <div className={s.formGroup} style={{ marginTop: "20px" }}>
                      <label>Interceptor Gates (Tool Matches)</label>
                      <div className={s.gatesGrid}>
                        {[
                          { key: "send_email", label: "Email Outbound" },
                          { key: "create_deal", label: "Create CRM Deal" },
                          { key: "publish_post", label: "Social Posting" },
                          { key: "send_message", label: "Slack Outbound" },
                          { key: "create_campaign", label: "Paid Campaign" }
                        ].map(gate => {
                          const isGated = config.hitl.gates.includes(gate.key);
                          return (
                            <label key={gate.key} className={s.gateCheck}>
                              <input 
                                type="checkbox" 
                                checked={isGated} 
                                onChange={() => toggleHitlGate(gate.key)}
                              />
                              <span>{gate.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* RAG Memory Column */}
              <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", padding: "24px", borderRadius: "16px", height: "max-content" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Long-Term RAG Memory</h3>
                  <label className={s.switch}>
                    <input 
                      type="checkbox" 
                      checked={config.memory.enabled} 
                      onChange={() => updateConfig("memory", { ...config.memory, enabled: !config.memory.enabled })}
                    />
                    <span className={s.slider}></span>
                  </label>
                </div>

                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
                  Stores and recalls decisions, competitor insights, and outbound signals using Supabase pgvector embeddings (768-dim).
                </p>

                {config.memory.enabled && (
                  <div>
                    <div className={s.formGroup}>
                      <label htmlFor="topKInput">Retrieved Memories per Call (Top K)</label>
                      <div className={s.sliderWrapper}>
                        <input 
                          id="topKInput"
                          type="range" 
                          min="1" 
                          max="15" 
                          step="1"
                          className={s.sliderInput}
                          value={config.memory.top_k || 5}
                          onChange={e => updateConfig("memory", { ...config.memory, top_k: parseInt(e.target.value) })}
                        />
                        <span className={s.sliderValue}>{config.memory.top_k || 5} rows</span>
                      </div>
                    </div>

                    <div className={s.formGroup}>
                      <label htmlFor="minSimilarityInput">Minimum Cosine Similarity</label>
                      <div className={s.sliderWrapper}>
                        <input 
                          id="minSimilarityInput"
                          type="range" 
                          min="0.50" 
                          max="0.95" 
                          step="0.05"
                          className={s.sliderInput}
                          value={config.memory.min_similarity || 0.75}
                          onChange={e => updateConfig("memory", { ...config.memory, min_similarity: parseFloat(e.target.value) })}
                        />
                        <span className={s.sliderValue}>{Math.round((config.memory.min_similarity || 0.75) * 100)}% Match</span>
                      </div>
                    </div>

                    <div className={s.formGroup}>
                      <label htmlFor="compactionThresholdInput">Memory Compaction Threshold</label>
                      <div className={s.sliderWrapper}>
                        <input 
                          id="compactionThresholdInput"
                          type="range" 
                          min="10" 
                          max="200" 
                          step="10"
                          className={s.sliderInput}
                          value={config.memory.compaction_threshold || 50}
                          onChange={e => updateConfig("memory", { ...config.memory, compaction_threshold: parseInt(e.target.value) })}
                        />
                        <span className={s.sliderValue}>{config.memory.compaction_threshold || 50} memories</span>
                      </div>
                    </div>

                    <div className={s.formGroup} style={{ marginTop: "20px" }}>
                      <label>Auto-Store Triggers</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
                        {[
                          { key: "think_end", label: "Final reasoning output (think_end)" },
                          { key: "tool_end", label: "Successful API outputs (tool_end)" },
                          { key: "agent_decision", label: "High-level agent conclusions" }
                        ].map(evt => {
                          const isStored = config.memory.auto_store_events.includes(evt.key);
                          return (
                            <label key={evt.key} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.85rem" }}>
                              <input 
                                type="checkbox" 
                                checked={isStored} 
                                onChange={() => toggleMemoryEvent(evt.key)}
                                style={{ accentColor: "var(--accent-color)", width: "16px", height: "16px" }}
                              />
                              <span>{evt.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Budgets & Canary Deployments */}
        {activeTab === "budgets" && (
          <div>
            <h2 className={s.panelTitle}>Budgets & Canary Deployments</h2>
            <p className={s.panelDesc}>Define strict cost caps for Gemini reasoning tokens and manage canary splits to safe-test version 2 of individual SDR or marketing agents.</p>

            <div className={s.gridTwoCol}>
              {/* Budgets Column */}
              <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", padding: "24px", borderRadius: "16px", height: "max-content" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "16px" }}>Session Token Budgets</h3>
                
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
                  Set a hard token ceiling for each multi-agent session. Acts as a circuit breaker to prevent infinite reasoning loops.
                </p>

                <div className={s.formGroup}>
                  <label htmlFor="maxTokensInput">Max Tokens Per Session</label>
                  <div className={s.sliderWrapper}>
                    <input 
                      id="maxTokensInput"
                      type="range" 
                      min="500" 
                      max="100000" 
                      step="500"
                      className={s.sliderInput}
                      value={config.budgets.max_tokens_per_session || 15000}
                      onChange={e => updateConfig("budgets", { ...config.budgets, max_tokens_per_session: parseInt(e.target.value) })}
                    />
                    <span className={s.sliderValue} style={{ minWidth: "80px" }}>{(config.budgets.max_tokens_per_session || 15000).toLocaleString()}</span>
                  </div>
                </div>

                {config.budgets.max_tokens_per_session < 2000 && (
                  <div className={s.alertBox}>
                    <AlertTriangle className={s.alertBoxIcon} size={18} />
                    <div className={s.alertBoxContent}>
                      <h4>Very Low Budget Gate</h4>
                      <p>Setting the budget below 2,000 tokens may cause complex agent planning loops to crash before executing their actions.</p>
                    </div>
                  </div>
                )}

                {config.budgets.max_tokens_per_session > 80000 && (
                  <div className={s.alertBox} style={{ borderColor: "rgba(245, 158, 11, 0.25)", background: "rgba(245, 158, 11, 0.08)" }}>
                    <AlertTriangle style={{ color: "var(--warning-color)" }} className={s.alertBoxIcon} size={18} />
                    <div className={s.alertBoxContent}>
                      <h4>High Reasoning Limit</h4>
                      <p>Budgets above 80,000 tokens allow extensive loops, which could run up high API fees on the GCP Vertex platform.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Canaries Column */}
              <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", padding: "24px", borderRadius: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Canary Splits</h3>
                  <label className={s.switch}>
                    <input 
                      type="checkbox" 
                      checked={config.canary.enabled} 
                      onChange={() => updateConfig("canary", { ...config.canary, enabled: !config.canary.enabled })}
                    />
                    <span className={s.slider}></span>
                  </label>
                </div>

                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
                  Safely split a percentage of incoming traffic to newer versions (v2) of specific SDR or advertising agents.
                </p>

                {config.canary.enabled && (
                  <div>
                    {/* Add Canary Rules Form */}
                    <div style={{ background: "rgba(0,0,0,0.2)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border-color)", marginBottom: "20px" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, display: "block", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Create Split Route</span>
                      
                      <div className={s.canaryGrid}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                          <div className={s.formGroup} style={{ marginBottom: "0" }}>
                            <label style={{ fontSize: "0.7rem" }} htmlFor="canaryAgentSelect">Select Agent</label>
                            <select 
                              id="canaryAgentSelect"
                              className={s.formSelect}
                              value={canaryAgent}
                              onChange={e => setCanaryAgent(e.target.value)}
                            >
                              <option value="">-- Choose Agent --</option>
                              {ALL_AGENTS.map(agent => (
                                <option key={agent.id} value={agent.id}>{agent.id} - {agent.name}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className={s.formGroup} style={{ marginBottom: "0" }}>
                            <label style={{ fontSize: "0.7rem" }} htmlFor="canaryV2Input">V2 Agent ID Override</label>
                            <input 
                              id="canaryV2Input"
                              type="text" 
                              className={s.formInput} 
                              value={canaryV2Id}
                              onChange={e => setCanaryV2Id(e.target.value)}
                              placeholder="e.g. 03a_v2"
                            />
                          </div>
                        </div>

                        <div className={s.formGroup} style={{ marginBottom: "0" }}>
                          <label style={{ fontSize: "0.7rem" }} htmlFor="canarySplitInput">Canary Traffic Split Percentage</label>
                          <div className={s.sliderWrapper}>
                            <input 
                              id="canarySplitInput"
                              type="range" 
                              min="5" 
                              max="95" 
                              step="5"
                              className={s.sliderInput}
                              value={canarySplit}
                              onChange={e => setCanarySplit(parseInt(e.target.value))}
                            />
                            <span className={s.sliderValue}>{canarySplit}% v2</span>
                          </div>
                        </div>

                        <button 
                          onClick={addCanaryRoute}
                          disabled={!canaryAgent || !canaryV2Id}
                          className={s.addCanaryBtn}
                          style={{ width: "100%", padding: "10px", marginTop: "8px" }}
                        >
                          <Plus size={14} style={{ display: "inline-block", marginRight: "4px", verticalAlign: "middle" }} />
                          <span>Insert Canary Rule</span>
                        </button>
                      </div>
                    </div>

                    {/* Active Canary Rules List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>Active Routing Rules</span>
                      {Object.keys(config.canary.routing || {}).length === 0 ? (
                        <div style={{ textAlign: "center", padding: "16px", border: "1px dashed var(--border-color)", borderRadius: "10px", color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                          No canary rules defined. Click above to add.
                        </div>
                      ) : (
                        Object.entries(config.canary.routing || {}).map(([agentId, routeData]: [string, any]) => {
                          const agent = ALL_AGENTS.find(a => a.id === agentId);
                          return (
                            <div key={agentId} className={s.canaryRow}>
                              <div>
                                <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{agentId}</span>
                                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>{agent?.name}</span>
                              </div>
                              <div>
                                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Redirect to:</span>
                                <span style={{ fontWeight: 700, fontSize: "0.85rem", display: "block", color: "var(--warning-color)" }}>{routeData.v2_id}</span>
                              </div>
                              <div>
                                <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{routeData.traffic_percentage}%</span>
                                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>v2 traffic</span>
                              </div>
                              <button onClick={() => removeCanaryRoute(agentId)} className={s.deleteRowBtn}>
                                <Trash2 size={16} />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Sticky Save State Bar */}
      {isDirty() && (
        <div className={s.actionBar}>
          <div className={s.statusMessage}>
            <span className={`${s.statusDot} ${s.dirty}`} />
            <span>You have unsaved changes in your GTM Playbook.</span>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleRevert} className={s.configureBtn} style={{ padding: "10px 20px" }}>
              <Undo2 size={16} />
              <span>Discard</span>
            </button>
            <button onClick={handleSave} disabled={saving} className={s.saveBtn}>
              {saving ? (
                <svg className={s.spinner} viewBox="0 0 50 50" style={{ width: "16px", height: "16px", color: "white" }}>
                  <circle className={s.spinnerCircle} cx="25" cy="25" r="20" fill="none" strokeWidth="6" />
                </svg>
              ) : (
                <Save size={16} />
              )}
              <span>{saving ? "Saving..." : "Save Configuration"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tweak Agent Persona Dialog Modal */}
      {editingAgent && (
        <div className={s.dialogOverlay} onClick={() => setEditingAgent(null)}>
          <div className={s.dialogContent} onClick={e => e.stopPropagation()}>
            <div className={s.dialogHeader}>
              <h3 className={s.dialogTitle}>Persona Override: {editingAgent.name}</h3>
              <button className={s.closeBtn} onClick={() => setEditingAgent(null)}>
                <X size={18} />
              </button>
            </div>
            
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              Customize the specific system prompt or behavioral instructions injected into Agent {editingAgent.id}.
            </p>

            <div className={s.formGroup}>
              <label htmlFor="systemPromptOverride">System Prompt Override</label>
              <textarea 
                id="systemPromptOverride"
                className={s.formTextarea} 
                style={{ minHeight: "180px", fontFamily: "SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace", fontSize: "0.8rem" }}
                value={tempPrompt}
                onChange={e => setTempPrompt(e.target.value)}
                placeholder={`e.g. You are the ${editingAgent.name} Agent. You should focus on...`}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
              <button 
                onClick={() => setEditingAgent(null)} 
                className={s.configureBtn}
                style={{ padding: "8px 16px" }}
              >
                Cancel
              </button>
              <button 
                onClick={savePromptOverride} 
                className={s.saveBtn}
                style={{ padding: "8px 20px" }}
              >
                Apply Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
