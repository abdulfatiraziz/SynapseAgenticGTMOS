"use client";

import React, { useState } from "react";

/* ─── agent registry (mirrors Supabase + ToolGateway) ─── */
const agents: Agent[] = [
  // Layer 1 — Strategy & Intelligence
  { id: "01",  name: "Chief Marketing Officer",    layer: 1, sub: "ICP · Messaging · Budget allocation",       accent: "#7F77DD", tag: "C-Suite",     tagColor: "purple", reports: "CEO",          tools: ["HubSpot","MarketIntel","Notion","Slack"],              responsibilities: ["Owns overall GTM strategy","Defines and locks ICP","Sets demand gen budget","Aligns all motions"], kpis: ["Pipeline from marketing","CAC","Win-rate uplift","Marketing-sourced revenue %"], logic: "IF MarketIntel shows competitor pivot → Trigger 03c rebuttal content", motion: "Orchestrator" },
  { id: "01b", name: "Chief Strategy Officer",     layer: 1, sub: "Long-term roadmap · Ecosystem design",      accent: "#7F77DD", tag: "C-Suite",     tagColor: "purple", reports: "CEO",          tools: ["HubSpot","MarketIntel","Make"],                        responsibilities: ["GTM architecture oversight","Partner strategy","Board reporting"], kpis: ["Strategic initiative completion","Partner revenue %"], logic: "IF PQL rate drops → Audit 02b onboarding flow", motion: "Strategist" },
  { id: "01c", name: "GTM Engineer",               layer: 1, sub: "System integration · Workflow debugging",   accent: "#7F77DD", tag: "IC / Builder", tagColor: "purple", reports: "CSO",          tools: ["Make","Gumloop","Supabase"],                           responsibilities: ["API bridge building","Agentic workflow debugging","Tool health monitoring"], kpis: ["Uptime %","Integration cycle time"], logic: "IF any Agent reports 'API Down' → Restart Make scenario", motion: "Infrastructure" },
  { id: "01d", name: "Market Intelligence Analyst", layer: 1, sub: "Competitor tracking · ICP research",       accent: "#7F77DD", tag: "IC / Analyst", tagColor: "purple", reports: "VP PMM",       tools: ["MarketIntel","GoogleAnalytics","Notion"],              responsibilities: ["Real-time grounded search","Competitor feature tracking","Industry trend synthesis"], kpis: ["ICP match rate","Competitive win-rate trend"], logic: "ALWAYS search 'Synapse competitors' EVERY 24 h", motion: "Intelligence" },

  // Layer 2 — GTM Motions (Management)
  { id: "02a", name: "VP Sales (SLG)",              layer: 2, sub: "Enterprise deal cycles · Top-down",        accent: "#1D9E75", tag: "Sales-Led",    tagColor: "teal",   reports: "CRO",         tools: ["Apollo","Clay","Slack","HubSpot"],                    responsibilities: ["Outbound sequence strategy","Lead triage management","SDR coaching"], kpis: ["SQLs per month","Pipeline from outbound","Meeting → Opp rate"], logic: "IF Clay enrichment score > 80 → Send to 03a", motion: "Sales-Led" },
  { id: "02b", name: "Head of PLG",                 layer: 2, sub: "Self-serve · PQL engine · Activation",     accent: "#378ADD", tag: "Product-Led",  tagColor: "blue",   reports: "CPO / CMO",   tools: ["PostHog","HubSpot","Slack","Notion"],                 responsibilities: ["PQL scoring model","Activation tracking","Self-serve conversion"], kpis: ["Activation rate","Time-to-value","PQL → SQL rate","Product-sourced revenue %"], logic: "IF user invites 3 teammates → Flag PQL in HubSpot", motion: "Product-Led" },
  { id: "02c", name: "Head of Community",            layer: 2, sub: "Evangelist network · Peer trust",         accent: "#D4537E", tag: "Community-Led",tagColor: "pink",   reports: "CMO",         tools: ["Slack","LinkedIn","Notion"],                           responsibilities: ["Channel creation","Intent listening","Member sentiment analysis"], kpis: ["Community DAU","Community-sourced pipeline %","Referral rate"], logic: "IF keyword 'pricing' in Slack → Notify 03e", motion: "Community-Led" },
  { id: "02d", name: "VP Partnerships",              layer: 2, sub: "Co-sell · Resellers · Evangelist influence",accent: "#D85A30",tag: "Partner-Led",  tagColor: "coral",  reports: "CRO",         tools: ["HubSpot","MarketIntel","Slack","LinkedIn"],           responsibilities: ["Partner account mapping","Co-selling orchestration","Warm intro management"], kpis: ["Partner-sourced revenue %","Partner-influenced pipeline","Time-to-first-deal"], logic: "IF deal has 'evangelist' status → Request intro from partner", motion: "Partner-Led" },

  // Layer 3 — Channels & Execution
  { id: "03a", name: "SDR Manager",                 layer: 3, sub: "Outbound pipeline · Sequences",            accent: "#1D9E75", tag: "Outbound",     tagColor: "teal",   reports: "VP Sales",    tools: ["Apollo","Clay","HubSpot","Slack"],                     responsibilities: ["Cold emailing at scale","Meeting booking","Personalized outreach"], kpis: ["Emails sent","Reply rate","Meetings booked","Pipeline $"], logic: "IF lead opens email 3× → Call via Zoom", motion: "Sales-Led" },
  { id: "03b", name: "Demand Gen Manager",           layer: 3, sub: "Paid ads · Inbound · Attribution",        accent: "#378ADD", tag: "Inbound + Paid",tagColor: "blue",  reports: "CMO",         tools: ["GoogleAds","MetaAds","GoogleAnalytics","MarketIntel"], responsibilities: ["Ad spend optimization","Funnel analysis","ABM plays"], kpis: ["MQL volume","Cost per MQL","ROAS by channel","ABM engagement"], logic: "IF CAC > $500 → Pause LinkedIn campaign", motion: "Performance" },
  { id: "03c", name: "Content & SEO Lead",           layer: 3, sub: "Organic traffic · Social voice",          accent: "#639922", tag: "Organic",       tagColor: "green",  reports: "CMO",         tools: ["LinkedIn","Instagram","MarketIntel"],                  responsibilities: ["Daily AI-powered posting","Engagement tracking","Keyword strategy"], kpis: ["Organic traffic growth","Content-influenced pipeline","Domain authority"], logic: "IF PostHog shows interest in 'Agents' → Post on LinkedIn", motion: "Content" },
  { id: "03d", name: "Field & Events Manager",       layer: 3, sub: "Webinars · Conferences · Lead triage",    accent: "#BA7517", tag: "Events",        tagColor: "amber",  reports: "CMO / VP Sales",tools: ["Zoom","Google","HubSpot","Slack"],                    responsibilities: ["Webinar-to-pipeline triage","Post-event follow-up","Registration management"], kpis: ["Event-sourced pipeline $","Attendee → meeting rate","Cost per opp"], logic: "IF attendee stayed > 45 min → Flag high-intent for 03a", motion: "Event-Led" },
  { id: "03e", name: "Head of RevOps",               layer: 3, sub: "CRM · Routing · Forecasting · Data",      accent: "#D85A30", tag: "Nervous System",tagColor: "coral", reports: "CRO / CFO",   tools: ["Make","Gumloop","HubSpot","Clay"],                    responsibilities: ["Lead routing automation","CRM data hygiene","Tech stack governance"], kpis: ["Routing speed","Forecast accuracy","CRM completeness"], logic: "IF Lead Source = 'Webinar' → Route to 03d immediately", motion: "Operations" },

  // Layer 4 — CS & Expansion (NRR)
  { id: "04a", name: "VP Customer Success",          layer: 4, sub: "Health scores · QBRs · Churn prevention", accent: "#639922", tag: "Retain",        tagColor: "green",  reports: "CRO",         tools: ["HubSpot","PostHog","Notion"],                         responsibilities: ["NRR oversight","QBR orchestration","Churn signal monitoring"], kpis: ["NRR — target 110%+","GRR","Churn rate","Time-to-onboard"], logic: "IF Health Score < 50 → Trigger churn task for 04b", motion: "Retention" },
  { id: "04b", name: "Customer Success Manager",     layer: 4, sub: "Onboarding · Activation · Renewals",      accent: "#639922", tag: "Retain",        tagColor: "green",  reports: "VP CS",       tools: ["HubSpot","Slack","Zoom"],                             responsibilities: ["Account health checks","Product adoption coaching","Structured onboarding"], kpis: ["Renewal rate","Health score distribution","CSAT / NPS"], logic: "IF product usage drops 20% → Schedule check-in call", motion: "Retention" },
  { id: "04c", name: "Expansion Account Executive",  layer: 4, sub: "Upsell · Cross-sell · Seat expansion",    accent: "#1D9E75", tag: "Grow",          tagColor: "teal",   reports: "VP Sales",    tools: ["HubSpot","Apollo","LinkedIn"],                         responsibilities: ["Identifying expansion signals","Running upsell cycles","Contract amendments"], kpis: ["Expansion ARR","Upsell win rate","Avg expansion deal size"], logic: "IF customer at 90% seat limit → Send expansion proposal", motion: "Expansion" },
  { id: "04d", name: "Renewals Manager",              layer: 4, sub: "At-risk accounts · NRR defence",          accent: "#1D9E75", tag: "Grow",          tagColor: "teal",   reports: "VP CS",       tools: ["HubSpot","Notion","Slack"],                            responsibilities: ["Renewal pipeline management","Multi-year negotiation","NRR forecasting"], kpis: ["On-time renewal rate","Churn save rate","Multi-year attach rate"], logic: "IF renewal in 90 days → Notify 04a", motion: "Expansion" },
];

interface Agent {
  id: string; name: string; layer: number; sub: string; accent: string;
  tag: string; tagColor: string; reports: string; tools: string[];
  responsibilities: string[]; kpis: string[]; logic: string; motion: string;
}

const layerMeta = [
  { id: 1, label: "Layer 1 — Strategy & intelligence foundation", icon: "🧠" },
  { id: 2, label: "Layer 2 — GTM motions (engines)",              icon: "⚙️" },
  { id: 3, label: "Layer 3 — Channels & execution levers",        icon: "🚀" },
  { id: 4, label: "Layer 4 — Customer success & expansion (NRR)", icon: "🔄" },
];

const tagBg: Record<string,{bg:string;fg:string}> = {
  purple: { bg: "#EEEDFE", fg: "#3C3489" },
  teal:   { bg: "#E1F5EE", fg: "#085041" },
  blue:   { bg: "#E6F1FB", fg: "#0C447C" },
  pink:   { bg: "#FBEAF0", fg: "#72243E" },
  coral:  { bg: "#FAECE7", fg: "#712B13" },
  amber:  { bg: "#FAEEDA", fg: "#633806" },
  green:  { bg: "#EAF3DE", fg: "#27500A" },
  gray:   { bg: "#F1EFE8", fg: "#444441" },
};

export default function InfrastructurePage() {
  const [selected, setSelected] = useState<Agent | null>(null);

  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1a1a1a" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 60px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px", margin: 0 }}>
            Synapse Agentic Infrastructure
          </h1>
          <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
            17-Agent GTM Nervous System · Click any agent to inspect tools, KPIs, and autonomous logic
          </p>
        </div>

        {/* Status Bar */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 40 }}>
          {[
            { label: "Agents Online", value: "17 / 17", color: "#1D9E75" },
            { label: "Tools Connected", value: "14", color: "#378ADD" },
            { label: "RBAC Verified", value: "✓ Secure", color: "#7F77DD" },
            { label: "Sprint", value: "3 — Complete", color: "#BA7517" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: "10px 20px", fontSize: 12, textAlign: "center" }}>
              <div style={{ color: "#999", fontWeight: 500, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Layers */}
        {layerMeta.map((layer, li) => (
          <div key={layer.id}>
            {/* Connection line between layers */}
            {li > 0 && (
              <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
                <div style={{ width: 1, height: 24, background: "#ddd" }} />
              </div>
            )}

            {/* Layer label */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 0 12px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#999" }}>
              <span>{layer.icon}</span>
              <span>{layer.label}</span>
              <div style={{ flex: 1, height: 1, background: "#e8e8e4" }} />
            </div>

            {/* Agent cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
              {agents.filter((a) => a.layer === layer.id).map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => setSelected(selected?.id === agent.id ? null : agent)}
                  style={{
                    background: "#fff",
                    border: selected?.id === agent.id ? `2px solid ${agent.accent}` : "1px solid #eee",
                    borderRadius: 14,
                    padding: "16px 18px",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.2s ease",
                    boxShadow: selected?.id === agent.id ? `0 4px 20px ${agent.accent}20` : "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px rgba(0,0,0,0.08)`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = selected?.id === agent.id ? `0 4px 20px ${agent.accent}20` : "0 1px 3px rgba(0,0,0,0.04)"; }}
                >
                  {/* Accent bar */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: agent.accent, borderRadius: "14px 14px 0 0" }} />

                  {/* Agent ID badge */}
                  <div style={{ fontSize: 9, fontWeight: 800, color: "#bbb", letterSpacing: "0.1em", marginBottom: 6, marginTop: 4 }}>
                    AGENT {agent.id}
                  </div>

                  {/* Title */}
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 3, lineHeight: 1.3 }}>
                    {agent.name}
                  </div>

                  {/* Subtitle */}
                  <div style={{ fontSize: 11, color: "#999", marginBottom: 12, lineHeight: 1.4 }}>
                    {agent.sub}
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4, marginBottom: 10 }}>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 600, background: tagBg[agent.tagColor]?.bg, color: tagBg[agent.tagColor]?.fg }}>
                      {agent.tag}
                    </span>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 500, background: "#F1EFE8", color: "#666" }}>
                      → {agent.reports}
                    </span>
                  </div>

                  {/* Tools */}
                  <div style={{ fontSize: 10, color: "#aaa", fontWeight: 500, marginBottom: 4 }}>Authorized tools</div>
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4 }}>
                    {agent.tools.map((t) => (
                      <span key={t} style={{ fontSize: 10, color: "#666", background: "#f5f5f3", border: "1px solid #eee", borderRadius: 4, padding: "1px 7px" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Detail Panel */}
        {selected && (
          <div style={{
            background: "#fff",
            border: `1px solid #eee`,
            borderRadius: 16,
            padding: "24px 28px",
            marginTop: 28,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            animation: "fadeIn 0.3s ease",
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: selected.accent, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 4 }}>
                  AGENT {selected.id} · {selected.motion}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>
                  {selected.name}
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "#f5f5f3", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, color: "#999" }}>
                ✕ Close
              </button>
            </div>
            <div style={{ fontSize: 12, color: "#999", marginBottom: 20 }}>
              Reports to {selected.reports} · {selected.tag}
            </div>

            {/* Columns */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>

              {/* Responsibilities */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#aaa", borderBottom: "1px solid #eee", paddingBottom: 6, marginBottom: 10 }}>
                  Core responsibilities
                </div>
                {selected.responsibilities.map((r, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#555", padding: "4px 0", display: "flex", gap: 8, lineHeight: 1.5 }}>
                    <span style={{ color: "#ccc", flexShrink: 0 }}>·</span> {r}
                  </div>
                ))}
              </div>

              {/* KPIs */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#aaa", borderBottom: "1px solid #eee", paddingBottom: 6, marginBottom: 10 }}>
                  KPIs they own
                </div>
                {selected.kpis.map((k, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#555", padding: "4px 0", display: "flex", gap: 8, lineHeight: 1.5 }}>
                    <span style={{ color: "#ccc", flexShrink: 0 }}>·</span> {k}
                  </div>
                ))}
              </div>

              {/* Tools + Logic */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#aaa", borderBottom: "1px solid #eee", paddingBottom: 6, marginBottom: 10 }}>
                  Tool stack (RBAC verified)
                </div>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 5, marginBottom: 18 }}>
                  {selected.tools.map((t) => (
                    <span key={t} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, background: `${selected.accent}12`, border: `1px solid ${selected.accent}30`, color: selected.accent, fontWeight: 600 }}>
                      {t}
                    </span>
                  ))}
                </div>

                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#aaa", borderBottom: "1px solid #eee", paddingBottom: 6, marginBottom: 10 }}>
                  Autonomous decision logic
                </div>
                <div style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: 11, padding: "12px 14px", borderRadius: 8, background: "#FAFAF8", border: "1px solid #eee", color: selected.accent, lineHeight: 1.6 }}>
                  <span style={{ color: "#bbb" }}>// active protocol</span>
                  <br />
                  {selected.logic}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
