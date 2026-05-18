import Link from "next/link";
import s from "./page.module.css";

/* ─── Data ──────────────────────────────────────────────────────────── */
const LAYERS = [
  {
    name: "Strategy Layer",
    color: "#3b82f6",
    agents: [
      { id: "01", name: "CMO Agent", desc: "Master orchestrator — allocates budget, routes missions, sets OKRs.", tools: ["Slack", "Notion", "HubSpot"] },
      { id: "01b", name: "VP PMM", desc: "Positioning & messaging based on competitive and market signals.", tools: ["Notion", "Slack"] },
      { id: "01c", name: "Pricing Agent", desc: "Dynamically optimises price tiers based on usage and competitive data.", tools: ["HubSpot", "Notion"] },
      { id: "01d", name: "Market Intel", desc: "Scans intent signals, competitor moves, and funding news in real-time.", tools: ["Apollo", "Make"] },
    ],
  },
  {
    name: "Motions Layer",
    color: "#8b5cf6",
    agents: [
      { id: "02a", name: "VP Sales", desc: "Manages high-intent pipeline — deal prioritisation and forecasting.", tools: ["HubSpot", "Slack"] },
      { id: "02b", name: "PLG Agent", desc: "Monitors product-qualified leads (PQLs) from PostHog usage events.", tools: ["PostHog", "HubSpot"] },
      { id: "02c", name: "Community Lead", desc: "Monitors Slack/Discord and surfaces evangelists and churn signals.", tools: ["Slack", "Notion"] },
      { id: "02d", name: "Partnerships", desc: "Identifies co-sell opportunities via partner portal and HubSpot.", tools: ["HubSpot", "Notion"] },
    ],
  },
  {
    name: "Channels Layer",
    color: "#ec4899",
    agents: [
      { id: "03a", name: "SDR Manager", desc: "Enriches leads, writes personalised sequences, books meetings.", tools: ["Apollo", "Clay", "HubSpot"] },
      { id: "03b", name: "Demand Gen", desc: "Runs and optimises Google Ads & Meta Ads campaigns autonomously.", tools: ["Google Ads", "Meta Ads"] },
      { id: "03c", name: "Content & SEO", desc: "Keyword research, briefs, and cross-channel content distribution.", tools: ["Ahrefs", "Notion", "Slack"] },
      { id: "03d", name: "Events Manager", desc: "Registers webinar attendees and triages post-event follow-up.", tools: ["Zoom", "HubSpot", "Slack"] },
      { id: "03e", name: "RevOps Agent", desc: "Automates CRM hygiene, routing rules, and SLA enforcement.", tools: ["HubSpot", "Make"] },
    ],
  },
  {
    name: "Customer Success Layer",
    color: "#10b981",
    agents: [
      { id: "04a", name: "VP Customer Success", desc: "Daily health checks — catches churn risk before it escalates.", tools: ["PostHog", "HubSpot", "Slack"] },
      { id: "04b", name: "CSM Agent", desc: "Personalised check-ins and success plans based on usage telemetry.", tools: ["HubSpot", "Slack", "Notion"] },
      { id: "04c", name: "Expansion AE", desc: "Surfaces upsell signals when accounts hit usage thresholds.", tools: ["HubSpot", "Apollo"] },
      { id: "04d", name: "Support Triage", desc: "Classifies tickets by urgency and routes to right team instantly.", tools: ["Slack", "HubSpot"] },
    ],
  },
];

const TOOLS = [
  { emoji: "🟠", name: "HubSpot", status: "live" },
  { emoji: "🔵", name: "Apollo.io", status: "live" },
  { emoji: "💬", name: "Slack", status: "live" },
  { emoji: "📓", name: "Notion", status: "live" },
  { emoji: "🌀", name: "Clay", status: "live" },
  { emoji: "⚙️", name: "Make.com", status: "live" },
  { emoji: "📣", name: "Google Ads", status: "live" },
  { emoji: "📘", name: "Meta Ads", status: "live" },
  { emoji: "📊", name: "Ahrefs", status: "mock" },
  { emoji: "📈", name: "PostHog", status: "mock" },
  { emoji: "🔗", name: "LinkedIn", status: "mock" },
  { emoji: "🎥", name: "Zoom", status: "mock" },
];

const FEATURES = [
  { icon: "🔐", title: "GCP Vertex AI", desc: "Enterprise-grade Gemini 2.5 backend — private, secure, and SOC-2 compatible. No data leaves your GCP project." },
  { icon: "🧠", title: "RAG Memory (pgvector)", desc: "All agent decisions are stored as vector embeddings in Supabase. Agents remember context across sessions." },
  { icon: "✋", title: "Human-in-the-Loop", desc: "High-stakes actions (emails, CRM deals, ads) pause and wait for Slack approval before executing." },
  { icon: "📡", title: "A2A Protocol", desc: "Agents communicate via internal Next.js API routes. Zero extra infrastructure — works on Vercel out of the box." },
  { icon: "💰", title: "Token Budgeting", desc: "Per-session token caps act as circuit breakers, preventing infinite reasoning loops and runaway costs." },
  { icon: "🎚️", title: "One-File Config", desc: "Everything — agents, tools, HITL gates, budgets — controlled from a single synapse.config.ts file." },
];

/* ─── SVG Animation Component ──────────────────────────────────────────── */
function NetworkSVG() {
  // 17 agent nodes arranged in orbital rings around a central Orchestrator
  const orchestrator = { x: 450, y: 220, label: "Orchestrator", color: "#3b82f6" };

  const ring1 = [
    { x: 450, y: 80, label: "CMO", id: "01", color: "#3b82f6" },
    { x: 590, y: 130, label: "VP Sales", id: "02a", color: "#8b5cf6" },
    { x: 640, y: 270, label: "SDR Mgr", id: "03a", color: "#ec4899" },
    { x: 560, y: 380, label: "VP CS", id: "04a", color: "#10b981" },
    { x: 340, y: 380, label: "RevOps", id: "03e", color: "#ec4899" },
    { x: 260, y: 270, label: "Demand Gen", id: "03b", color: "#ec4899" },
    { x: 310, y: 130, label: "PLG", id: "02b", color: "#8b5cf6" },
  ];

  const ring2 = [
    { x: 450, y: 10, label: "VP PMM", id: "01b", color: "#3b82f6" },
    { x: 700, y: 80, label: "Pricing", id: "01c", color: "#3b82f6" },
    { x: 750, y: 220, label: "Mkt Intel", id: "01d", color: "#3b82f6" },
    { x: 700, y: 370, label: "Content", id: "03c", color: "#ec4899" },
    { x: 550, y: 450, label: "Events", id: "03d", color: "#ec4899" },
    { x: 350, y: 450, label: "CSM", id: "04b", color: "#10b981" },
    { x: 200, y: 370, label: "Exp AE", id: "04c", color: "#10b981" },
    { x: 150, y: 220, label: "Community", id: "02c", color: "#8b5cf6" },
    { x: 200, y: 80, label: "Partners", id: "02d", color: "#8b5cf6" },
    { x: 350, y: 10, label: "Support", id: "04d", color: "#10b981" },
  ];

  const allNodes = [...ring1, ...ring2];

  return (
    <svg viewBox="0 0 900 470" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxHeight: 500 }}>
      {/* Orbital rings */}
      <circle cx="450" cy="220" r="145" stroke="rgba(59,130,246,0.06)" strokeWidth="1" />
      <circle cx="450" cy="220" r="255" stroke="rgba(139,92,246,0.04)" strokeWidth="1" />

      {/* Spoke lines from Orchestrator to ring1 */}
      {ring1.map((n, i) => (
        <line key={`r1-${i}`} x1={orchestrator.x} y1={orchestrator.y} x2={n.x} y2={n.y}
          stroke={`${n.color}30`} strokeWidth="1.5" />
      ))}

      {/* Spoke lines from ring1 to ring2 - partial connections */}
      {ring1.map((n, i) => {
        const r2 = ring2[i % ring2.length];
        return <line key={`r2-${i}`} x1={n.x} y1={n.y} x2={r2.x} y2={r2.y}
          stroke="rgba(255,255,255,0.04)" strokeWidth="1" />;
      })}

      {/* Animated signal particles on ring1 connections */}
      {ring1.map((n, i) => (
        <circle key={`p-${i}`} r="3.5" fill={n.color} opacity="0.9">
          <animateMotion
            dur={`${2.5 + i * 0.4}s`}
            repeatCount="indefinite"
            path={`M ${orchestrator.x} ${orchestrator.y} L ${n.x} ${n.y} L ${orchestrator.x} ${orchestrator.y}`}
          />
        </circle>
      ))}

      {/* Animated signal on a few ring2 connections */}
      {ring2.slice(0, 5).map((n, i) => (
        <circle key={`p2-${i}`} r="2.5" fill={n.color} opacity="0.6">
          <animateMotion
            dur={`${3 + i * 0.6}s`}
            repeatCount="indefinite"
            path={`M ${ring1[i % ring1.length].x} ${ring1[i % ring1.length].y} L ${n.x} ${n.y} L ${ring1[i % ring1.length].x} ${ring1[i % ring1.length].y}`}
          />
        </circle>
      ))}

      {/* Ring 2 nodes (smaller) */}
      {ring2.map((n, i) => (
        <g key={`rn2-${i}`} transform={`translate(${n.x}, ${n.y})`}>
          <circle r="18" fill="#0d1117" stroke={n.color} strokeWidth="1.5" opacity="0.8" />
          <text y="4" fill={n.color} fontSize="6.5" fontWeight="700" textAnchor="middle"
            fontFamily="Inter, sans-serif">{n.label}</text>
        </g>
      ))}

      {/* Ring 1 nodes */}
      {ring1.map((n, i) => (
        <g key={`rn1-${i}`} transform={`translate(${n.x}, ${n.y})`}>
          <circle r="24" fill="#0d1117" stroke={n.color} strokeWidth="2">
            <animate attributeName="r" values="24;26;24" dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          </circle>
          <circle r="30" stroke={n.color} strokeWidth="0.5" opacity="0.15" />
          <text y="4" fill="#fff" fontSize="8" fontWeight="700" textAnchor="middle"
            fontFamily="Inter, sans-serif">{n.label}</text>
        </g>
      ))}

      {/* Central Orchestrator */}
      <g transform={`translate(${orchestrator.x}, ${orchestrator.y})`}>
        <circle r="42" fill="#060810" stroke="#3b82f6" strokeWidth="2.5">
          <animate attributeName="r" values="42;44;42" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle r="52" stroke="#3b82f6" strokeWidth="0.75" opacity="0.15">
          <animate attributeName="r" values="52;56;52" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <text y="-6" fill="#fff" fontSize="11" fontWeight="900" textAnchor="middle"
          fontFamily="Inter, sans-serif">SYNAPSE</text>
        <text y="9" fill="#3b82f6" fontSize="8" fontWeight="600" textAnchor="middle"
          fontFamily="Inter, sans-serif">ORCHESTRATOR</text>
      </g>

      {/* Live label */}
      <rect x="340" y="430" width="120" height="26" rx="13" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.25)" />
      <circle cx="360" cy="443" r="4" fill="#10b981">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <text x="370" y="447" fill="#10b981" fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif">
        19 Agents Active
      </text>
    </svg>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className={s.page}>
      <div className={s.noise} />

      {/* Header */}
      <header className={s.header}>
        <div className={s.headerInner}>
          <div>
            <div className={s.logo}>SYNAPSE</div>
            <div className={s.logoSub}>Agentic GTM OS</div>
          </div>
          <nav className={s.nav}>
            <a href="#network" className={s.navLink}>Architecture</a>
            <a href="#agents" className={s.navLink}>17 Agents</a>
            <a href="#tools" className={s.navLink}>Tools</a>
            <Link href="/demo" className={s.navLink}>Live Demo</Link>
            <a href="https://github.com/abdulfatiraziz/SynapseAgenticGTMOS" target="_blank" rel="noreferrer" className={s.navBtn}>
              GitHub ↗
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className={s.hero}>
        <div className={s.heroGlow} />
        <div className={s.badge}>
          <span className={`${s.dot} ${s.dotPulse}`} />
          Level 3 Collaborative Multi-Agent System
        </div>
        <h1 className={s.heroTitle}>
          The First Open-Source<br />
          <span className={s.heroTitleAccent}>Agentic GTM Operating System</span>
        </h1>
        <p className={s.heroDesc}>
          Deploy a coordinated fleet of 17 specialized AI agents as your autonomous digital
          revenue team. From lead triage to competitive intelligence to customer health — on autopilot.
        </p>
        <div className={s.heroCtas}>
          <Link href="/demo" className={s.ctaPrimary}>See Live Demo →</Link>
          <a href="https://github.com/abdulfatiraziz/SynapseAgenticGTMOS" target="_blank" rel="noreferrer" className={s.ctaSecondary}>
            ⭐ Star on GitHub
          </a>
        </div>
        <div className={s.statsBar}>
          <div className={s.stat}><div className={s.statNum}>19</div><div className={s.statLabel}>AI Agents</div></div>
          <div className={s.stat}><div className={s.statNum}>12+</div><div className={s.statLabel}>Live Integrations</div></div>
          <div className={s.stat}><div className={s.statNum}>4</div><div className={s.statLabel}>GTM Layers</div></div>
          <div className={s.stat}><div className={s.statNum}>MIT</div><div className={s.statLabel}>Open Source</div></div>
        </div>
      </section>

      <hr className={s.divider} />

      {/* Network Animation */}
      <section className={s.networkSection} id="network">
        <div className={s.networkWrap}>
          <span className={s.sectionLabel}>Level 3 Architecture</span>
          <h2 className={s.sectionTitle}>Real-Time Agent Network</h2>
          <p className={s.sectionSub} style={{ margin: "0 auto" }}>
            The central Orchestrator coordinates all 17 GTM agents via an internal A2A protocol.
            Watch live data signals route in real-time between departments.
          </p>
          <div className={s.svgContainer}>
            <NetworkSVG />
          </div>
        </div>
      </section>

      <hr className={s.divider} />

      {/* Agents */}
      <div className={s.section} id="agents">
        <span className={s.sectionLabel}>The Fleet</span>
        <h2 className={s.sectionTitle}>17 Specialized GTM Agents</h2>
        <p className={s.sectionSub}>
          Each agent is fully customizable — edit mission, tools, personas, and sub-agent delegation in <code>synapse.config.ts</code>.
        </p>

        {LAYERS.map((layer) => (
          <div key={layer.name} className={s.layerBlock}>
            <div className={s.layerHeader}>
              <div className={s.layerDot} style={{ background: layer.color }} />
              <span className={s.layerName}>{layer.name}</span>
            </div>
            <div className={s.agentsGrid}>
              {layer.agents.map((agent) => (
                <div key={agent.id} className={s.agentCard}>
                  <div className={s.agentId}
                    style={{ background: `${layer.color}15`, color: layer.color }}>
                    AGENT {agent.id}
                  </div>
                  <div className={s.agentName}>{agent.name}</div>
                  <div className={s.agentDesc}>{agent.desc}</div>
                  <div className={s.agentTools}>
                    {agent.tools.map(t => <span key={t} className={s.tool}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <hr className={s.divider} />

      {/* Features */}
      <div className={s.section} id="features">
        <span className={s.sectionLabel}>Infrastructure</span>
        <h2 className={s.sectionTitle}>Built for Enterprise Scale</h2>
        <p className={s.sectionSub}>Production-ready guardrails, security, and observability baked in from day one.</p>
        <div className={s.featGrid}>
          {FEATURES.map(f => (
            <div key={f.title} className={s.featCard}>
              <div className={s.featIcon}>{f.icon}</div>
              <div className={s.featTitle}>{f.title}</div>
              <div className={s.featDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <hr className={s.divider} />

      {/* Tools */}
      <div className={s.section} id="tools">
        <span className={s.sectionLabel}>Integrations</span>
        <h2 className={s.sectionTitle}>12+ Native Tool Connections</h2>
        <p className={s.sectionSub}>Plug in live keys and flip tools to &lsquo;live&rsquo; mode in your config. Everything else runs on smart mocks out of the box.</p>
        <div className={s.toolsGrid}>
          {TOOLS.map(t => (
            <div key={t.name} className={s.toolCard}>
              <span className={s.toolEmoji}>{t.emoji}</span>
              <div>
                <div className={s.toolName}>{t.name}</div>
                <div className={`${s.toolStatus} ${t.status === "live" ? s.live : s.mock}`}>
                  {t.status === "live" ? "● Live" : "○ Mock available"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className={s.divider} />

      {/* Setup */}
      <div className={s.section} id="setup">
        <span className={s.sectionLabel}>Quickstart</span>
        <h2 className={s.sectionTitle}>Running in 60 Seconds</h2>
        <p className={s.sectionSub}>Works out-of-the-box in mock mode. Add your API keys to go fully live.</p>
        <div className={s.terminal}>
          <div className={s.termBar}>
            <div className={s.termDot} style={{ background: "#ef4444" }} />
            <div className={s.termDot} style={{ background: "#eab308" }} />
            <div className={s.termDot} style={{ background: "#22c55e" }} />
          </div>
          <div className={s.termBody}>
            <pre>
{`\u001b[2m# 1. Clone & Install\u001b[0m
git clone https://github.com/abdulfatiraziz/SynpaseAgenticGTM.git
cd synapse-app && npm install

\u001b[2m# 2. Setup database (paste init.sql in Supabase SQL Editor → Run)\u001b[0m

\u001b[2m# 3. Configure your environment\u001b[0m
cp .env.example .env.local
\u001b[2m# Fill in: GCP_PROJECT_ID, SUPABASE_URL, SUPABASE_KEY, GOOGLE_APPLICATION_CREDENTIALS\u001b[0m

\u001b[2m# 4. Run the system\u001b[0m
npm run dev
\u001b[2m# → Open http://localhost:3000\u001b[0m

\u001b[2m# 5. Run the E2E daily simulation\u001b[0m
npx dotenv-cli -e .env.local -- npx tsx src/scripts/e2e_daily_simulation.ts`}
            </pre>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={s.footer}>
        <div className={s.footerLogo}>SYNAPSE</div>
        <div className={s.footerLinks}>
          <a href="https://github.com/abdulfatiraziz/SynpaseAgenticGTM" target="_blank" rel="noreferrer" className={s.footerLink}>GitHub</a>
          <a href="https://github.com/abdulfatiraziz/SynpaseAgenticGTM/blob/main/README.md" target="_blank" rel="noreferrer" className={s.footerLink}>Documentation</a>
          <a href="https://github.com/abdulfatiraziz/SynpaseAgenticGTM/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer" className={s.footerLink}>Contributing</a>
          <a href="https://github.com/abdulfatiraziz/SynpaseAgenticGTM/blob/main/LICENSE" target="_blank" rel="noreferrer" className={s.footerLink}>MIT License</a>
        </div>
        <div>© 2026 Synapse Contributors. Open-sourced under the MIT License.</div>
        <div className={s.footerSub}>Powered by GCP Vertex AI · Supabase pgvector · Google Gemini</div>
      </footer>
    </div>
  );
}
