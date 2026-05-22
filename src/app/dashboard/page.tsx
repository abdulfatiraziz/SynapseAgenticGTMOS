"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  Award, 
  Activity, 
  Target, 
  Clock, 
  Mail, 
  Globe, 
  Share2, 
  RefreshCw, 
  Cpu, 
  Sparkles, 
  ArrowUpRight, 
  Layers,
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Static corporate intelligence datasets mapped by timeframe
const datasets = {
  "Q2-2026": {
    pipeline: "$14,842,000",
    pipelineTarget: "$15.0M",
    pipelineProgress: 98.9,
    dealsWon: "54",
    dealsValue: "$2.42M",
    activeLeads: "1,420",
    leadsQualified: "680",
    leadsProspecting: "740",
    tamPenetration: "84%",
    tamCount: "4,820 / 5,740",
    inbound: {
      leads: "428",
      pipeline: "$3.8M",
      sla: "<45 seconds",
      enrichment: "98.4%",
    },
    outbound: {
      emails: "18,240",
      pipeline: "$4.9M",
      bookingRate: "8.2%",
      accounts: "320",
    },
    paid: {
      campaigns: "12",
      pipeline: "$2.6M",
      reach: "92%",
      cpma: "$42.10",
    },
    partners: {
      alliances: "18",
      pipeline: "$3.5M",
      integrations: "74%",
    },
    tamTiers: {
      t1: { mapped: "420/500", pct: 84, val: "$8.2M" },
      t2: { mapped: "1,200/1,500", pct: 80, val: "$4.1M" },
      t3: { mapped: "3,200/3,740", pct: 85, val: "$2.5M" }
    }
  },
  "Last-30-Days": {
    pipeline: "$4,250,000",
    pipelineTarget: "$5.0M",
    pipelineProgress: 85.0,
    dealsWon: "19",
    dealsValue: "$0.85M",
    activeLeads: "410",
    leadsQualified: "190",
    leadsProspecting: "220",
    tamPenetration: "76%",
    tamCount: "4,360 / 5,740",
    inbound: {
      leads: "135",
      pipeline: "$1.1M",
      sla: "<38 seconds",
      enrichment: "99.1%",
    },
    outbound: {
      emails: "5,400",
      pipeline: "$1.5M",
      bookingRate: "7.9%",
      accounts: "98",
    },
    paid: {
      campaigns: "4",
      pipeline: "$0.8M",
      reach: "88%",
      cpma: "$46.50",
    },
    partners: {
      alliances: "12",
      pipeline: "$0.85M",
      integrations: "71%",
    },
    tamTiers: {
      t1: { mapped: "380/500", pct: 76, val: "$7.6M" },
      t2: { mapped: "1,110/1,500", pct: 74, val: "$3.8M" },
      t3: { mapped: "2,870/3,740", pct: 76, val: "$2.2M" }
    }
  },
  "YTD": {
    pipeline: "$48,910,000",
    pipelineTarget: "$50.0M",
    pipelineProgress: 97.8,
    dealsWon: "168",
    dealsValue: "$7.65M",
    activeLeads: "4,850",
    leadsQualified: "2,120",
    leadsProspecting: "2,730",
    tamPenetration: "91%",
    tamCount: "5,224 / 5,740",
    inbound: {
      leads: "1,390",
      pipeline: "$12.4M",
      sla: "<48 seconds",
      enrichment: "97.9%",
    },
    outbound: {
      emails: "58,400",
      pipeline: "$16.8M",
      bookingRate: "8.4%",
      accounts: "940",
    },
    paid: {
      campaigns: "38",
      pipeline: "$9.4M",
      reach: "94%",
      cpma: "$39.80",
    },
    partners: {
      alliances: "42",
      pipeline: "$10.3M",
      integrations: "78%",
    },
    tamTiers: {
      t1: { mapped: "480/500", pct: 96, val: "$9.6M" },
      t2: { mapped: "1,380/1,500", pct: 92, val: "$4.6M" },
      t3: { mapped: "3,364/3,740", pct: 90, val: "$2.7M" }
    }
  }
};

const liveWins = [
  "RevOps Agent successfully triaged inbound signup from Stripe.com (SLA: 12s).",
  "CMO Agent optimized budget allocation: assigned $8k to high-intent SaaS group.",
  "Outbound SDR Agent automatically personalized and delivered 42 emails for Tier-1 directors.",
  "Market Intel Analyst detected competitor price drop; auto-alerted PMM fleet.",
  "SDR Manager Agent verified Clay data enrichment matches: 98.4% density secured.",
  "Partnership Lead Agent mapped 18 new Crossbeam overlaps with Snowflake team.",
  "VP CS Agent flagged cyberdyne.com contract renewal alert: auto-generated renewal brief.",
  "Demand Gen Agent deployed 3 new Google Search campaigns targeting 'relational graph DBs'.",
  "RevOps Lead Agent verified HubSpot integration gateway sync: 1,420 active leads verified.",
  "SDR Agent completed Slack Human-in-the-Loop approval: email cadence unlocked."
];

export default function DashboardHome() {
  const [timeframe, setTimeframe] = useState<"Q2-2026" | "Last-30-Days" | "YTD">("Q2-2026");
  const [showIntentOnly, setShowIntentOnly] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [feedLogs, setFeedLogs] = useState<string[]>([
    "RevOps Agent successfully triaged inbound signup from Stripe.com (SLA: 12s).",
    "CMO Agent optimized budget allocation: assigned $8k to high-intent SaaS group.",
    "Outbound SDR Agent automatically personalized and delivered 42 emails for Tier-1 directors."
  ]);

  const currentData = datasets[timeframe];

  // Rotate feed logs in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      const randomWin = liveWins[Math.floor(Math.random() * liveWins.length)];
      setFeedLogs(prev => [randomWin, ...prev.slice(0, 4)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // CRM Sync Simulation trigger sequence
  const handleSyncTrigger = () => {
    if (syncing) return;
    setSyncing(true);
    setSyncStep(1);

    setTimeout(() => setSyncStep(2), 1200);
    setTimeout(() => setSyncStep(3), 2400);
    setTimeout(() => setSyncStep(4), 3600);
    setTimeout(() => {
      setSyncing(false);
      setSyncStep(0);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }, 4800);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Background Radial Glow */}
      <div 
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, transparent 70%)',
          top: '-150px',
          right: '-100px',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Header Row */}
      <div className="header-row" style={{ position: 'relative', zIndex: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Sparkles size={16} color="var(--accent-color)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Autonomous GTM Operations
            </span>
          </div>
          <h1>Executive Dashboard</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Multi-channel command center monitoring agentic motions, TAM mapped penetration, and pipeline value.
          </p>
        </div>

        {/* Executive Control Deck */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Scope Toggle */}
          <button
            onClick={() => setShowIntentOnly(!showIntentOnly)}
            style={{
              background: showIntentOnly ? 'rgba(59, 130, 246, 0.15)' : 'var(--card-bg)',
              border: `1px solid ${showIntentOnly ? 'rgba(59, 130, 246, 0.5)' : 'var(--border-color)'}`,
              color: showIntentOnly ? 'var(--accent-color)' : 'var(--text-secondary)',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease'
            }}
          >
            <Activity size={14} />
            {showIntentOnly ? "High-Intent Scope" : "Full Addressable Scope"}
          </button>

          {/* Timeframe Dropdown */}
          <div style={{ position: 'relative' }}>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '8px 16px',
                paddingRight: '32px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                WebkitAppearance: 'none'
              }}
            >
              <option value="Q2-2026">Q2 2026</option>
              <option value="Last-30-Days">Last 30 Days</option>
              <option value="YTD">Year-To-Date (YTD)</option>
            </select>
            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '0.6rem', color: 'var(--text-secondary)' }}>▼</div>
          </div>

          {/* CRM Sync Button */}
          <button
            onClick={handleSyncTrigger}
            disabled={syncing}
            style={{
              background: syncing ? 'rgba(255, 255, 255, 0.05)' : 'linear-gradient(135deg, var(--accent-color), #4f46e5)',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: syncing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: syncing ? 'none' : '0 4px 15px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            <RefreshCw size={14} className={syncing ? "spin-icon" : ""} />
            {syncing ? "Syncing APIs..." : "Sync CRM data"}
          </button>
        </div>
      </div>

      {/* Top-Tier Financial KPIs Grid */}
      <div className="metrics-grid" style={{ position: 'relative', zIndex: 10, marginTop: '16px' }}>
        {/* KPI 1: Current Pipeline Value */}
        <div className="metric-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px' }}>
              <TrendingUp size={20} color="var(--accent-color)" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ color: 'var(--success-color)', fontSize: '0.75rem', fontWeight: 600 }}>{currentData.pipelineProgress}%</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>of target</span>
            </div>
          </div>
          <span className="metric-label">CURRENT PIPELINE VALUE</span>
          <div className="metric-value" style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            {showIntentOnly ? "$6.42M" : currentData.pipeline}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>target: {currentData.pipelineTarget}</span>
          </div>
          {/* Progress gauge bar */}
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '14px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${showIntentOnly ? 72 : currentData.pipelineProgress}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, var(--accent-color), #60a5fa)',
                borderRadius: '2px',
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
              }} 
            />
          </div>
        </div>

        {/* KPI 2: Won Deals This Quarter */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px' }}>
              <Award size={20} color="var(--success-color)" />
            </div>
            <div style={{ textTransform: 'uppercase', fontSize: '0.7rem', color: 'var(--success-color)', fontWeight: 700, padding: '4px 8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
              +14.2% QoQ
            </div>
          </div>
          <span className="metric-label">WON DEALS (THIS QUARTER)</span>
          <div className="metric-value" style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            {showIntentOnly ? "21 Deals" : `${currentData.dealsWon} Deals`}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>Valued at: {showIntentOnly ? "$0.92M" : currentData.dealsValue}</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '14px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: '78%', 
                height: '100%', 
                background: 'linear-gradient(90deg, var(--success-color), #34d399)',
                borderRadius: '2px'
              }} 
            />
          </div>
        </div>

        {/* KPI 3: Total Active Leads */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '10px' }}>
              <Activity size={20} color="var(--warning-color)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulsing-dot" />
              <span style={{ fontSize: '0.7rem', color: 'var(--warning-color)', fontWeight: 600 }}>Active Fleet Dispatch</span>
            </div>
          </div>
          <span className="metric-label">TOTAL ACTIVE LEADS/DEALS</span>
          <div className="metric-value" style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            {showIntentOnly ? "480 Leads" : currentData.activeLeads}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
              {showIntentOnly ? "310 qual" : `${currentData.leadsQualified} qualified`}
            </span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '14px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: '65%', 
                height: '100%', 
                background: 'linear-gradient(90deg, var(--warning-color), #fbbf24)',
                borderRadius: '2px'
              }} 
            />
          </div>
        </div>

        {/* KPI 4: Total TAM Penetration */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ padding: '8px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '10px' }}>
              <Target size={20} color="#a855f7" />
            </div>
            <span style={{ fontSize: '0.7rem', color: '#a855f7', fontWeight: 700, padding: '4px 8px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '6px' }}>
              Agent Mapped
            </span>
          </div>
          <span className="metric-label">TOTAL TAM PENETRATION</span>
          <div className="metric-value" style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            {showIntentOnly ? "91%" : currentData.tamPenetration}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>{currentData.tamCount} accounts</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '14px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: currentData.tamPenetration, 
                height: '100%', 
                background: 'linear-gradient(90deg, #a855f7, #c084fc)',
                borderRadius: '2px',
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
              }} 
            />
          </div>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2.5fr) minmax(0, 1fr)', gap: '24px', marginTop: '24px', position: 'relative', zIndex: 10 }}>
        
        {/* Left Column: Multi-Channel Performance Motions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
          
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '1.25rem', fontWeight: 600 }}>
                  GTM Motion Performance Channels
                </h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Live operational telemetry and contribution split across autonomous channels.
                </p>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-color)', background: 'rgba(59, 130, 246, 0.1)', padding: '4px 8px', borderRadius: '6px', fontWeight: 600 }}>
                Real-Time Gauges
              </span>
            </div>

            {/* Responsive Channels Grid */}
            <div className="channels-grid" style={{ minWidth: 0 }}>
              
              {/* Motion 1: Inbound Triage */}
              <div className="channel-box" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={16} color="var(--accent-color)" />
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Inbound Triage</span>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--accent-color)', fontWeight: 600 }}>SLA Secure</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Leads Triaged:</span>
                      <span style={{ fontWeight: 600 }}>{currentData.inbound.leads}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Pipeline Mapped:</span>
                      <span style={{ fontWeight: 600 }}>{currentData.inbound.pipeline}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Response Speed:</span>
                      <span style={{ color: 'var(--success-color)', fontWeight: 600 }}>{currentData.inbound.sla}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    <span>Clay enrichment accuracy</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{currentData.inbound.enrichment}</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: currentData.inbound.enrichment, height: '100%', background: 'var(--accent-color)' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    <Cpu size={12} color="var(--accent-color)" style={{ flexShrink: 0 }} />
                    <span>Active: RevOps, SDR Agents</span>
                  </div>
                </div>
              </div>

              {/* Motion 2: Outbound Outreach */}
              <div className="channel-box" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} color="var(--success-color)" />
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Outbound outreach</span>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--success-color)', fontWeight: 600 }}>Optimal</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Emails Sent:</span>
                      <span style={{ fontWeight: 600 }}>{currentData.outbound.emails}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Pipeline Created:</span>
                      <span style={{ fontWeight: 600 }}>{currentData.outbound.pipeline}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Meeting Book Rate:</span>
                      <span style={{ color: 'var(--success-color)', fontWeight: 600 }}>{currentData.outbound.bookingRate}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    <span>Target accounts engaged</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{currentData.outbound.accounts} accounts</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '82%', height: '100%', background: 'var(--success-color)' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    <Cpu size={12} color="var(--success-color)" style={{ flexShrink: 0 }} />
                    <span>Active: Outbound SDR fleet</span>
                  </div>
                </div>
              </div>

              {/* Motion 3: Paid Channels */}
              <div className="channel-box" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Globe size={16} color="var(--warning-color)" />
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Paid Channels</span>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--warning-color)', fontWeight: 600 }}>12 Active Ads</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Campaigns Run:</span>
                      <span style={{ fontWeight: 600 }}>{currentData.paid.campaigns}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Pipeline Influenced:</span>
                      <span style={{ fontWeight: 600 }}>{currentData.paid.pipeline}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Cost per account:</span>
                      <span style={{ color: 'var(--warning-color)', fontWeight: 600 }}>{currentData.paid.cpma}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    <span>Target list reach</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{currentData.paid.reach}</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: currentData.paid.reach, height: '100%', background: 'var(--warning-color)' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    <Cpu size={12} color="var(--warning-color)" style={{ flexShrink: 0 }} />
                    <span>Active: CMO, Demand Gen</span>
                  </div>
                </div>
              </div>

              {/* Motion 4: Referrals & Partners */}
              <div className="channel-box" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Share2 size={16} color="#a855f7" />
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Partners & Refer</span>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#a855f7', fontWeight: 600 }}>Crossbeam</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Alliances Mapped:</span>
                      <span style={{ fontWeight: 600 }}>{currentData.partners.alliances}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Co-sell Pipeline:</span>
                      <span style={{ fontWeight: 600 }}>{currentData.partners.pipeline}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Gateway Share:</span>
                      <span style={{ color: '#a855f7', fontWeight: 600 }}>{currentData.partners.integrations}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    <span>Active sync overlaps</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{currentData.partners.integrations}</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: currentData.partners.integrations, height: '100%', background: '#a855f7' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    <Cpu size={12} color="#a855f7" style={{ flexShrink: 0 }} />
                    <span>Active: Partnerships Agent</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* TAM Segment Distribution Panel */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '1.15rem', fontWeight: 600, marginBottom: '16px' }}>
              Target Account Segment (TAM) Penetration
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Tier 1 Enterprise */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600 }}>Tier 1 (Enterprise / VIP Accounts)</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Mapped: <strong style={{ color: 'var(--text-primary)' }}>{currentData.tamTiers.t1.mapped}</strong> ({currentData.tamTiers.t1.pct}% coverage) | Pipeline: <strong style={{ color: 'var(--text-primary)' }}>{currentData.tamTiers.t1.val}</strong>
                  </span>
                </div>
                <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', display: 'flex', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }}>
                  <div 
                    style={{ 
                      width: `${currentData.tamTiers.t1.pct}%`, 
                      background: 'linear-gradient(90deg, #8b5cf6, #c084fc)', 
                      borderRadius: '5px',
                      boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)',
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} 
                  />
                </div>
              </div>

              {/* Tier 2 Mid-Market */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600 }}>Tier 2 (Mid-Market / High Scale)</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Mapped: <strong style={{ color: 'var(--text-primary)' }}>{currentData.tamTiers.t2.mapped}</strong> ({currentData.tamTiers.t2.pct}% coverage) | Pipeline: <strong style={{ color: 'var(--text-primary)' }}>{currentData.tamTiers.t2.val}</strong>
                  </span>
                </div>
                <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', display: 'flex', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }}>
                  <div 
                    style={{ 
                      width: `${currentData.tamTiers.t2.pct}%`, 
                      background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', 
                      borderRadius: '5px',
                      boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)',
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} 
                  />
                </div>
              </div>

              {/* Tier 3 Growth */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600 }}>Tier 3 (Growth / SMB Scale)</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Mapped: <strong style={{ color: 'var(--text-primary)' }}>{currentData.tamTiers.t3.mapped}</strong> ({currentData.tamTiers.t3.pct}% coverage) | Pipeline: <strong style={{ color: 'var(--text-primary)' }}>{currentData.tamTiers.t3.val}</strong>
                  </span>
                </div>
                <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', display: 'flex', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }}>
                  <div 
                    style={{ 
                      width: `${currentData.tamTiers.t3.pct}%`, 
                      background: 'linear-gradient(90deg, #10b981, #34d399)', 
                      borderRadius: '5px',
                      boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)',
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} 
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Live AI Fleet Wins & Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
          
          {/* Active AI Agent Wins Terminal */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '1.15rem', fontWeight: 600 }}>
                  Active Agent wins
                </h2>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success-color)', boxShadow: '0 0 8px var(--success-color)' }} />
              </div>

              {/* Feed logs pre-populated & prepended */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {feedLogs.map((log, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      padding: '12px', 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '12px',
                      animation: index === 0 ? 'slide-down 0.4s ease' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <Sparkles size={12} color="var(--accent-color)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <p style={{ fontSize: '0.75rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>{log}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Cpu size={16} color="var(--accent-color)" className="spin-icon" />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  17 Autonomous Agents Live
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Horizontal scrolling marquee logs at the absolute bottom */}
      <div 
        style={{ 
          marginTop: '32px', 
          background: 'rgba(22, 25, 35, 0.4)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '12px', 
          padding: '12px', 
          overflow: 'hidden', 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '1px', borderRight: '1px solid var(--border-color)', paddingRight: '16px', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <Database size={12} /> Live Broadcast Feed
        </span>
        <div style={{ width: '100%', overflow: 'hidden', display: 'flex', minWidth: 0 }}>
          <div className="marquee-content" style={{ display: 'flex', gap: '48px', whiteSpace: 'nowrap' }}>
            <span>⚡ SDR Agent booked a demo with CTO at CyberDyne Systems (TAM Tier 1).</span>
            <span>⚡ CMO Agent optimized campaign target search groups, increasing CTA click rate to 9.2%.</span>
            <span>⚡ RevOps Lead connected ProfitWell tool to track customer expansion metrics in real-time.</span>
            <span>⚡ Outbound outreach booked 8 enterprise strategic briefings across the partners network this week.</span>
          </div>
        </div>
      </div>

      {/* CRM Syncing Simulator Modal Overlay */}
      {syncing && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(5, 7, 12, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fade-in 0.3s ease'
          }}
        >
          <div 
            style={{
              background: 'rgba(20, 24, 38, 0.95)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '24px',
              padding: '40px',
              width: '480px',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8), 0 0 30px rgba(59, 130, 246, 0.15)',
              animation: 'scale-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {/* Syncing Animation Sphere */}
            <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 24px auto' }}>
              <div 
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '3px solid rgba(59, 130, 246, 0.1)',
                  borderTopColor: 'var(--accent-color)',
                  animation: 'spin 1s linear infinite'
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  top: '10%',
                  left: '10%',
                  width: '80%',
                  height: '80%',
                  borderRadius: '50%',
                  border: '2px dashed rgba(16, 185, 129, 0.2)',
                  borderBottomColor: 'var(--success-color)',
                  animation: 'spin-reverse 2s linear infinite'
                }}
              />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Database size={24} color="var(--accent-color)" />
              </div>
            </div>

            <h3 style={{ fontFamily: 'var(--font-sora)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              Synchronizing GTM Gateways
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Connecting secure agent bridges to Apollo, Clay, and HubSpot engines.
            </p>

            {/* Step-by-step logs stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', opacity: syncStep >= 1 ? 1 : 0.3, transition: 'opacity 0.2s' }}>
                <span style={{ color: syncStep > 1 ? 'var(--success-color)' : 'var(--accent-color)' }}>
                  {syncStep > 1 ? "✓" : "▶"} Querying Apollo Database API...
                </span>
                {syncStep === 1 && <span style={{ marginLeft: 'auto', color: 'var(--accent-color)', animation: 'pulse 1s infinite' }}>PENDING</span>}
                {syncStep > 1 && <span style={{ marginLeft: 'auto', color: 'var(--success-color)' }}>DONE</span>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', opacity: syncStep >= 2 ? 1 : 0.3, transition: 'opacity 0.2s' }}>
                <span style={{ color: syncStep > 2 ? 'var(--success-color)' : (syncStep === 2 ? 'var(--accent-color)' : 'white') }}>
                  {syncStep > 2 ? "✓" : (syncStep === 2 ? "▶" : "•")} Fetching HubSpot Contacts & Pipeline...
                </span>
                {syncStep === 2 && <span style={{ marginLeft: 'auto', color: 'var(--accent-color)', animation: 'pulse 1s infinite' }}>PENDING</span>}
                {syncStep > 2 && <span style={{ marginLeft: 'auto', color: 'var(--success-color)' }}>DONE</span>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', opacity: syncStep >= 3 ? 1 : 0.3, transition: 'opacity 0.2s' }}>
                <span style={{ color: syncStep > 3 ? 'var(--success-color)' : (syncStep === 3 ? 'var(--accent-color)' : 'white') }}>
                  {syncStep > 3 ? "✓" : (syncStep === 3 ? "▶" : "•")} Mapping enrichment overlaps via Clay...
                </span>
                {syncStep === 3 && <span style={{ marginLeft: 'auto', color: 'var(--accent-color)', animation: 'pulse 1s infinite' }}>PENDING</span>}
                {syncStep > 3 && <span style={{ marginLeft: 'auto', color: 'var(--success-color)' }}>DONE</span>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', opacity: syncStep >= 4 ? 1 : 0.3, transition: 'opacity 0.2s' }}>
                <span style={{ color: syncStep >= 4 ? 'var(--success-color)' : 'white' }}>
                  {syncStep >= 4 ? "✓" : "•"} Committing transactions to vector storage...
                </span>
                {syncStep === 4 && <span style={{ marginLeft: 'auto', color: 'var(--success-color)' }}>SAVING</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast Notification */}
      {showToast && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'rgba(16, 185, 129, 0.95)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            borderRadius: '12px',
            padding: '14px 20px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 15px rgba(16, 185, 129, 0.3)',
            zIndex: 10000,
            animation: 'slide-in-right 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <CheckCircle2 size={18} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Synchronized Successfully</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Pipeline and intent indices are up-to-date.</div>
          </div>
        </div>
      )}

      {/* Dynamic Keyframes Animation Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes pulse {
          50% { opacity: 0.5; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-up {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slide-down {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .spin-icon {
          animation: spin 3s linear infinite;
        }
        .pulsing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--warning-color);
          animation: pulse 1.5s infinite;
        }
        .marquee-content {
          animation: marquee 25s linear infinite;
        }
        .marquee-content:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(10%); }
          100% { transform: translateX(-100%); }
        }
        .channels-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }
        @media (max-width: 1400px) {
          .channels-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 768px) {
          .channels-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        .channel-box {
          transition: all 0.3s ease;
        }
        .channel-box:hover {
          border-color: rgba(255, 255, 255, 0.2) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
      `}} />
    </div>
  );
}
