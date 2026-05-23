// Static configuration data for playbooks and specifications
// Generated automatically from page.tsx to serialize icons to strings

export interface VisualNode {
  id: string;
  label: string;
  type: "trigger" | "agent" | "tool" | "gate" | "db";
  icon: "zap" | "cpu" | "network" | "message" | "database" | string;
  x: number;
  y: number;
  subText?: string;
}

export interface Connection {
  from: string;
  to: string;
  type: "trigger" | "delegate" | "query" | "approve" | "sync";
}

export interface Playbook {
  id: string;
  name: string;
  category: "PLG" | "SLG" | "Community" | "Partner" | "Master";
  description: string;
  nodes: VisualNode[];
  connections: Connection[];
  steps: {
    nodeId: string;
    log: string;
    actionType: "think" | "call_tool" | "hitl" | "done";
    hitlDetails?: {
      agent: string;
      request: string;
    };
  }[];
}

export interface PlaybookOverview {
  strategy: {
    hypothesis: string;
    trigger: string;
    outcomes: string;
  };
  orchestration: {
    strategicRole: string;
    operationalRole: string;
    hitlGateway: string;
  };
  integrations: {
    tool: string;
    purpose: string;
  }[];
  safeguards: {
    boundaries: string;
    hitlCriteria: string;
    timeoutDefaults: string;
  };
}

export const playbooks: Playbook[] = [
  // --- PLG PLAYBOOKS (P1 to P5) ---
  {
    id: "p1_pql_triage",
    name: "P1: Self-Serve Product Action to PQL Triage",
    category: "PLG",
    description: "PostHog Signup ──► Head of PLG (02b) ──► SDR Manager (03a) ──► Notion ICP ──► PQL Slack Gate ──► HubSpot CRM",
    nodes: [
      { id: "p1_trigger", label: "PostHog Signup", type: "trigger", icon: "zap", x: 40, y: 40, subText: "Active Team Signup" },
      { id: "p1_strategic", label: "Head of PLG (02b)", type: "agent", icon: "cpu", x: 230, y: 40, subText: "Strategy Lead" },
      { id: "p1_operational", label: "SDR Manager (03a)", type: "agent", icon: "cpu", x: 230, y: 175, subText: "Sales Operations" },
      { id: "p1_tool", label: "Notion ICP Audit", type: "tool", icon: "network", x: 480, y: 175, subText: "Notion REST API" },
      { id: "p1_gate", label: "PQL Slack Gate", type: "gate", icon: "message", x: 480, y: 310, subText: "HITL Qualification" },
      { id: "p1_db", label: "HubSpot CRM DB", type: "db", icon: "database", x: 770, y: 310, subText: "Sync Opportunity" }
    ],
    connections: [
      { from: "p1_trigger", to: "p1_strategic", type: "trigger" },
      { from: "p1_strategic", to: "p1_operational", type: "delegate" },
      { from: "p1_operational", to: "p1_tool", type: "query" },
      { from: "p1_tool", to: "p1_gate", type: "approve" },
      { from: "p1_gate", to: "p1_db", type: "sync" },
      { from: "p1_db", to: "p1_strategic", type: "sync" }
    ],
    steps: [
      { nodeId: "p1_trigger", log: "PostHog Trigger: Workspace cluster registered with 4 active developer signups.", actionType: "think" },
      { nodeId: "p1_strategic", log: "✉ Head of PLG Agent evaluating product engagement velocity. Delegating custom ICP scoring to SDR Manager.", actionType: "think" },
      { nodeId: "p1_operational", log: "📥 SDR Manager Agent received delegation. Accessing Notion ICP target list via REST API.", actionType: "think" },
      { nodeId: "p1_tool", log: "⚙ [Tool Gateway] Invoking Notion REST API `/v1/pages` to audit target company and match ICP scores.", actionType: "call_tool" },
      { nodeId: "p1_gate", log: "💬 [Slack HITL Gate] Gating qualification. Awaiting product-qualified lead (PQL) sign-off in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Head of PLG (02b)", request: "Approve PQL qualification for 'CloudScale' workspace. ICP match: 94%. Active seats: 4." } },
      { nodeId: "p1_db", log: "✔ HubSpot CRM synced! 📈 Telemetry feedback loop active: Returning sync status, estimated ARR ($12k), and pipeline velocity back to Head of PLG (02b) for real-time model alignment.", actionType: "done" }
    ]
  },
  {
    id: "p2_churn_prevention",
    name: "P2: Self-Serve Product Churn Prevention",
    category: "PLG",
    description: "PostHog Usage Drop ──► VP CS (04a) ──► CSM Agent (04b) ──► Clay Scraper ──► CS Slack Gate ──► HubSpot CRM",
    nodes: [
      { id: "p2_trigger", label: "Usage Drop Alert", type: "trigger", icon: "zap", x: 40, y: 40, subText: "PostHog Telemetry" },
      { id: "p2_strategic", label: "VP CS (04a)", type: "agent", icon: "cpu", x: 230, y: 40, subText: "Health Overseer" },
      { id: "p2_operational", label: "CSM Agent (04b)", type: "agent", icon: "cpu", x: 230, y: 175, subText: "Retention Liaison" },
      { id: "p2_tool", label: "Clay Enrichment", type: "tool", icon: "network", x: 480, y: 175, subText: "Clay Scraper HTTP" },
      { id: "p2_gate", label: "CS Slack Gate", type: "gate", icon: "message", x: 480, y: 310, subText: "Email Approval" },
      { id: "p2_db", label: "HubSpot CRM DB", type: "db", icon: "database", x: 770, y: 310, subText: "Update Health Score" }
    ],
    connections: [
      { from: "p2_trigger", to: "p2_strategic", type: "trigger" },
      { from: "p2_strategic", to: "p2_operational", type: "delegate" },
      { from: "p2_operational", to: "p2_tool", type: "query" },
      { from: "p2_tool", to: "p2_gate", type: "approve" },
      { from: "p2_gate", to: "p2_db", type: "sync" },
      { from: "p2_db", to: "p2_strategic", type: "sync" }
    ],
    steps: [
      { nodeId: "p2_trigger", log: "PostHog Trigger: Product usage activity for 'Acme Logistics' dropped by 35% week-over-week.", actionType: "think" },
      { nodeId: "p2_strategic", log: "✉ VP CS Agent recalculating health score trends. Delegating outreach campaign generation to CSM Agent.", actionType: "think" },
      { nodeId: "p2_operational", log: "📥 CSM Agent initiating background diagnostic scraper on target tech stack changes using Clay.", actionType: "think" },
      { nodeId: "p2_tool", log: "⚙ [Tool Gateway] Triggering Clay API to scrape Acme Logistics recent hires, searching for legacy tool integrations.", actionType: "call_tool" },
      { nodeId: "p2_gate", log: "💬 [Slack HITL Gate] Awaiting CSM approval to deliver personalized recovery email in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "CSM Agent (04b)", request: "Approve recovery campaign for Acme Logistics. Clay diagnostics indicate integration friction with legacy DB." } },
      { nodeId: "p2_db", log: "✔ Account health score updated in HubSpot CRM! 📈 Telemetry feedback loop active: Sending success metrics back to VP CS (04a) for continuous model alignment.", actionType: "done" }
    ]
  },
  {
    id: "p3_limit_upsell",
    name: "P3: Usage-Based Limit Upsell Warning",
    category: "PLG",
    description: "Gumloop limit ──► Head of PLG (02b) ──► Head of RevOps (03e) ──► PostHog ──► Upsell Gate ──► HubSpot CRM",
    nodes: [
      { id: "p3_trigger", label: "Limit Warning", type: "trigger", icon: "zap", x: 40, y: 40, subText: "Billing Limit Met" },
      { id: "p3_strategic", label: "Head of PLG (02b)", type: "agent", icon: "cpu", x: 230, y: 40, subText: "Growth Overseer" },
      { id: "p3_operational", label: "Head of RevOps (03e)", type: "agent", icon: "cpu", x: 230, y: 175, subText: "Ops Coordinator" },
      { id: "p3_tool", label: "PostHog Cohorts", type: "tool", icon: "network", x: 480, y: 175, subText: "Cohort Check API" },
      { id: "p3_gate", label: "Upsell Slack Gate", type: "gate", icon: "message", x: 480, y: 310, subText: "Offer Validation" },
      { id: "p3_db", label: "HubSpot CRM DB", type: "db", icon: "database", x: 770, y: 310, subText: "Expansion Deal" }
    ],
    connections: [
      { from: "p3_trigger", to: "p3_strategic", type: "trigger" },
      { from: "p3_strategic", to: "p3_operational", type: "delegate" },
      { from: "p3_operational", to: "p3_tool", type: "query" },
      { from: "p3_tool", to: "p3_gate", type: "approve" },
      { from: "p3_gate", to: "p3_db", type: "sync" },
      { from: "p3_db", to: "p3_strategic", type: "sync" }
    ],
    steps: [
      { nodeId: "p3_trigger", log: "Gumloop Trigger: 'Nova Corp' exceeded free tier credit limits (10,500 operations).", actionType: "think" },
      { nodeId: "p3_strategic", log: "✉ Head of PLG Agent evaluating expansion opportunity. Handing off workspace seat check to RevOps Lead.", actionType: "think" },
      { nodeId: "p3_operational", log: "📥 RevOps Lead Agent auditing user density and query volumes in PostHog.", actionType: "think" },
      { nodeId: "p3_tool", log: "⚙ [Tool Gateway] Invoking PostHog Query REST API to pull active user events and calculate developer seat growth.", actionType: "call_tool" },
      { nodeId: "p3_gate", log: "💬 [Slack HITL Gate] Awaiting operator approval to grant a 14-day enterprise trial in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Head of PLG (02b)", request: "Approve enterprise trial extension for Nova Corp. Active collaborative seats: 12." } },
      { nodeId: "p3_db", log: "✔ Expansion opportunity synced in HubSpot CRM! 📈 Telemetry feedback loop active: Returning telemetry back to Head of PLG (02b) for lead classification refinement.", actionType: "done" }
    ]
  },
  {
    id: "p4_onboarding_activation",
    name: "P4: Post-Signup Onboarding Activation",
    category: "PLG",
    description: "PostHog Idle Event ──► Head of PLG (02b) ──► CSM Agent (04b) ──► Clay Enrich ──► CS Onboard Gate ──► HubSpot CRM",
    nodes: [
      { id: "p4_trigger", label: "Idle Registrant", type: "trigger", icon: "zap", x: 40, y: 40, subText: "Inactive Event" },
      { id: "p4_strategic", label: "Head of PLG (02b)", type: "agent", icon: "cpu", x: 230, y: 40, subText: "Growth Architect" },
      { id: "p4_operational", label: "CSM Agent (04b)", type: "agent", icon: "cpu", x: 230, y: 175, subText: "Retention Lead" },
      { id: "p4_tool", label: "Clay Enrichment", type: "tool", icon: "network", x: 480, y: 175, subText: "Clay Enrichment API" },
      { id: "p4_gate", label: "CS Onboard Gate", type: "gate", icon: "message", x: 480, y: 310, subText: "Outreach Approval" },
      { id: "p4_db", label: "HubSpot Nurture DB", type: "db", icon: "database", x: 770, y: 310, subText: "Campaign Sync" }
    ],
    connections: [
      { from: "p4_trigger", to: "p4_strategic", type: "trigger" },
      { from: "p4_strategic", to: "p4_operational", type: "delegate" },
      { from: "p4_operational", to: "p4_tool", type: "query" },
      { from: "p4_tool", to: "p4_gate", type: "approve" },
      { from: "p4_gate", to: "p4_db", type: "sync" },
      { from: "p4_db", to: "p4_strategic", type: "sync" }
    ],
    steps: [
      { nodeId: "p4_trigger", log: "PostHog Trigger: User registered 5 days ago but hasn't activated their first adapter integration.", actionType: "think" },
      { nodeId: "p4_strategic", log: "✉ Head of PLG Agent drafting custom compliance guides. Handing off context research to CSM Agent.", actionType: "think" },
      { nodeId: "p4_operational", log: "📥 CSM Agent initiating company enrichment to identify key fintech compliance concerns.", actionType: "think" },
      { nodeId: "p4_tool", log: "⚙ [Tool Gateway] POSTing user domain to Clay enrichment workflow to extract target industry and API stack.", actionType: "call_tool" },
      { nodeId: "p4_gate", log: "💬 [Slack HITL Gate] Awaiting review of the fintech custom activation playbook email in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Head of PLG (02b)", request: "Approve compliant onboarding sequence for 'Fintech Solutions'. Target use case: Automated auditing." } },
      { nodeId: "p4_db", log: "✔ Synced campaign trigger to HubSpot! 📈 Telemetry feedback loop active: Sending campaign metadata back to Head of PLG (02b) for active cohort tuning.", actionType: "done" }
    ]
  },
  {
    id: "p5_team_density",
    name: "P5: Bottom-Up Team Density TAM Expansion",
    category: "PLG",
    description: "PostHog Clusters ──► VP CS (04a) ──► SDR Manager (03a) ──► SerpAPI Search ──► Sales Slack Gate ──► HubSpot CRM",
    nodes: [
      { id: "p5_trigger", label: "Domain Clusters", type: "trigger", icon: "zap", x: 40, y: 40, subText: "Multi-User Signal" },
      { id: "p5_strategic", label: "VP CS (04a)", type: "agent", icon: "cpu", x: 230, y: 40, subText: "Health Overseer" },
      { id: "p5_operational", label: "SDR Manager (03a)", type: "agent", icon: "cpu", x: 230, y: 175, subText: "Sales Operations" },
      { id: "p5_tool", label: "SerpAPI Search", type: "tool", icon: "network", x: 480, y: 175, subText: "Market Intel REST" },
      { id: "p5_gate", label: "Sales Slack Gate", type: "gate", icon: "message", x: 480, y: 310, subText: "Lead Assignment" },
      { id: "p5_db", label: "HubSpot CRM DB", type: "db", icon: "database", x: 770, y: 310, subText: "Account Expansion" }
    ],
    connections: [
      { from: "p5_trigger", to: "p5_strategic", type: "trigger" },
      { from: "p5_strategic", to: "p5_operational", type: "delegate" },
      { from: "p5_operational", to: "p5_tool", type: "query" },
      { from: "p5_tool", to: "p5_gate", type: "approve" },
      { from: "p5_gate", to: "p5_db", type: "sync" },
      { from: "p5_db", to: "p5_strategic", type: "sync" }
    ],
    steps: [
      { nodeId: "p5_trigger", log: "PostHog Trigger: 7 individual free signups recorded from domain 'apex-energy.com'.", actionType: "think" },
      { nodeId: "p5_strategic", log: "✉ VP CS Agent checking account value. Delegating target consolidation to SDR Manager.", actionType: "think" },
      { nodeId: "p5_operational", log: "📥 SDR Manager Agent searching organizational corporate structure via SerpAPI.", actionType: "think" },
      { nodeId: "p5_tool", log: "⚙ [Tool Gateway] Invoking Market Intel SerpAPI client to query conglomerate parent relations and headcount.", actionType: "call_tool" },
      { nodeId: "p5_gate", log: "💬 [Slack HITL Gate] Awaiting Account Director approval to consolidate contacts into an Enterprise Account in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "VP CS (04a)", request: "Approve Enterprise consolidation for 'Apex Energy'. Est. combined ARR TAM: $65,000." } },
      { nodeId: "p5_db", log: "✔ Enterprise Account combined in HubSpot CRM! 📈 Telemetry feedback loop active: Returning telemetry to VP CS (04a) for cohort scoring adjustments.", actionType: "done" }
    ]
  },

  // --- SLG PLAYBOOKS (P6 to P10) ---
  {
    id: "p6_abm_outbound",
    name: "P6: ABM Multi-Channel Ads Warming & Outbound",
    category: "SLG",
    description: "HubSpot TAM ──► CMO Agent (01) ──► SDR Manager (03a) ──► Social Ads API ──► Outbound Gate ──► HubSpot Pipeline",
    nodes: [
      { id: "p6_trigger", label: "High-Value TAM", type: "trigger", icon: "zap", x: 40, y: 40, subText: "HubSpot Segment" },
      { id: "p6_strategic", label: "CMO Agent (01)", type: "agent", icon: "cpu", x: 230, y: 40, subText: "Marketing Director" },
      { id: "p6_operational", label: "SDR Manager (03a)", type: "agent", icon: "cpu", x: 230, y: 175, subText: "Sales Operations" },
      { id: "p6_tool", label: "Social Ads API", type: "tool", icon: "network", x: 480, y: 175, subText: "LinkedIn & Meta Ads" },
      { id: "p6_gate", label: "Outbound Gate", type: "gate", icon: "message", x: 480, y: 310, subText: "Outreach Approval" },
      { id: "p6_db", label: "HubSpot Pipeline", type: "db", icon: "database", x: 770, y: 310, subText: "Active Deal Sync" }
    ],
    connections: [
      { from: "p6_trigger", to: "p6_strategic", type: "trigger" },
      { from: "p6_strategic", to: "p6_operational", type: "delegate" },
      { from: "p6_operational", to: "p6_tool", type: "query" },
      { from: "p6_tool", to: "p6_gate", type: "approve" },
      { from: "p6_gate", to: "p6_db", type: "sync" },
      { from: "p6_db", to: "p6_strategic", type: "sync" }
    ],
    steps: [
      { nodeId: "p6_trigger", log: "HubSpot Trigger: Target account segment 'Automotive Logistics' active with 42 target enterprise companies.", actionType: "think" },
      { nodeId: "p6_strategic", log: "✉ CMO Agent designing ad matched-audience strategy. Delegating ad execution and SDR warm follow-ups to SDR Manager.", actionType: "think" },
      { nodeId: "p6_operational", log: "📥 SDR Manager Agent activating LinkedIn and Meta Custom Audience segment integrations.", actionType: "think" },
      { nodeId: "p6_tool", log: "⚙ [Tool Gateway] Invoking LinkedIn (/adSegments) & Meta (/customaudiences) REST APIs to load target corporate domains.", actionType: "call_tool" },
      { nodeId: "p6_gate", log: "💬 [Slack HITL Gate] Awaiting marketing budget sign-off for warm outbound sequence in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "CMO Agent (01)", request: "Approve omnichannel ads warming launch for 42 Tier-1 Automotive targets. Est. ad-match rate: 84%." } },
      { nodeId: "p6_db", log: "✔ Campaigns and pipeline opportunities active in HubSpot CRM! 📈 Telemetry feedback loop active: Sending conversion rates back to CMO Agent (01) for model tuning.", actionType: "done" }
    ]
  },
  {
    id: "p7_buying_committee",
    name: "P7: B2B Buying Committee Mapping",
    category: "SLG",
    description: "HubSpot Deal ──► Chief Strategy Officer (01b) ──► SDR Manager (03a) ──► Apollo REST ──► Committee Gate ──► HubSpot Sync",
    nodes: [
      { id: "p7_trigger", label: "Inbound Deal", type: "trigger", icon: "zap", x: 40, y: 40, subText: "HubSpot Opportunity" },
      { id: "p7_strategic", label: "CSO Agent (01b)", type: "agent", icon: "cpu", x: 230, y: 40, subText: "Strategy Lead" },
      { id: "p7_operational", label: "SDR Manager (03a)", type: "agent", icon: "cpu", x: 230, y: 175, subText: "Sales Operations" },
      { id: "p7_tool", label: "Apollo REST Check", type: "tool", icon: "network", x: 480, y: 175, subText: "Contact Enrichment" },
      { id: "p7_gate", label: "Committee Gate", type: "gate", icon: "message", x: 480, y: 310, subText: "Validation Gate" },
      { id: "p7_db", label: "HubSpot CRM DB", type: "db", icon: "database", x: 770, y: 310, subText: "Committee Synced" }
    ],
    connections: [
      { from: "p7_trigger", to: "p7_strategic", type: "trigger" },
      { from: "p7_strategic", to: "p7_operational", type: "delegate" },
      { from: "p7_operational", to: "p7_tool", type: "query" },
      { from: "p7_tool", to: "p7_gate", type: "approve" },
      { from: "p7_gate", to: "p7_db", type: "sync" },
      { from: "p7_db", to: "p7_strategic", type: "sync" }
    ],
    steps: [
      { nodeId: "p7_trigger", log: "HubSpot Trigger: Opportunity 'Stripe - Enterprise Adaptor Pilot' created with blank decision roles.", actionType: "think" },
      { nodeId: "p7_strategic", log: "✉ Chief Strategy Officer Agent analyzing enterprise deal constraints. Delegating buyer mapping to SDR Manager.", actionType: "think" },
      { nodeId: "p7_operational", log: "📥 SDR Manager Agent executing Apollo waterfalls to extract the target buying committee list.", actionType: "think" },
      { nodeId: "p7_tool", log: "⚙ [Tool Gateway] Invoking Apollo.io API `/v1/people-match` seeking VP Finance, CISO, and VP Infrastructure.", actionType: "call_tool" },
      { nodeId: "p7_gate", log: "💬 [Slack HITL Gate] Awaiting AE sign-off on target executive roles and contacts in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "CSO Agent (01b)", request: "Approve Stripe B2B buying committee profile mapping. 3 contacts enriched (CISO, VP Finance, CIO)." } },
      { nodeId: "p7_db", log: "✔ Committee records synced into HubSpot CRM! 📈 Telemetry feedback loop active: Telemetry returned to CSO Agent (01b) for enterprise strategy alignment.", actionType: "done" }
    ]
  },
  {
    id: "p8_zoom_prep",
    name: "P8: Discovery Briefing & Zoom Meeting Prep",
    category: "SLG",
    description: "Zoom Booking ──► Chief Strategy Officer (01b) ──► GTM Engineer (01c) ──► Clay Webhook ──► Briefing Gate ──► Notion Strategy",
    nodes: [
      { id: "p8_trigger", label: "Zoom Calendar", type: "trigger", icon: "zap", x: 40, y: 40, subText: "Booking Event" },
      { id: "p8_strategic", label: "CSO Agent (01b)", type: "agent", icon: "cpu", x: 230, y: 40, subText: "Strategy Lead" },
      { id: "p8_operational", label: "GTM Engineer (01c)", type: "agent", icon: "cpu", x: 230, y: 175, subText: "Technical Specialist" },
      { id: "p8_tool", label: "Clay Table Hook", type: "tool", icon: "network", x: 480, y: 175, subText: "Clay Waterfall API" },
      { id: "p8_gate", label: "Briefing Slack Gate", type: "gate", icon: "message", x: 480, y: 310, subText: "Battlecard Review" },
      { id: "p8_db", label: "Notion Strategy", type: "db", icon: "database", x: 770, y: 310, subText: "Save Strategy Brief" }
    ],
    connections: [
      { from: "p8_trigger", to: "p8_strategic", type: "trigger" },
      { from: "p8_strategic", to: "p8_operational", type: "delegate" },
      { from: "p8_operational", to: "p8_tool", type: "query" },
      { from: "p8_tool", to: "p8_gate", type: "approve" },
      { from: "p8_gate", to: "p8_db", type: "sync" },
      { from: "p8_db", to: "p8_strategic", type: "sync" }
    ],
    steps: [
      { nodeId: "p8_trigger", log: "Zoom Trigger: Enterprise discovery call booked with CEO of 'Quantum AI'.", actionType: "think" },
      { nodeId: "p8_strategic", log: "✉ CSO Agent reviewing target account strategy. Delegating custom technical battlecard generation to GTM Engineer.", actionType: "think" },
      { nodeId: "p8_operational", log: "📥 GTM Engineer Agent launching Clay waterfall profile scraper for key technical data points.", actionType: "think" },
      { nodeId: "p8_tool", log: "⚙ [Tool Gateway] POSTing company data to Clay Webhook URL to scrape employee size, active databases, and cloud host.", actionType: "call_tool" },
      { nodeId: "p8_gate", log: "💬 [Slack HITL Gate] Awaiting Account Executive review of custom competitor battlecard in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "CSO Agent (01b)", request: "Approve discovery briefing package for CEO of Quantum AI. Tech stack parsed: Multi-cloud, Snowflake." } },
      { nodeId: "p8_db", log: "✔ Brief saved in Notion Strategy database! 📈 Telemetry feedback loop active: Returning prep status to CSO Agent (01b) for executive dashboards.", actionType: "done" }
    ]
  },
  {
    id: "p9_contract_redlining",
    name: "P9: Legal Redlining & Contract Generation",
    category: "SLG",
    description: "HubSpot negotiates ──► Head of RevOps (03e) ──► GTM Engineer (01c) ──► Notion Legal ──► Legal Gate ──► Gumloop CRM",
    nodes: [
      { id: "p9_trigger", label: "HubSpot Negotiation", type: "trigger", icon: "zap", x: 40, y: 40, subText: "Stage Update Event" },
      { id: "p9_strategic", label: "Head of RevOps (03e)", type: "agent", icon: "cpu", x: 230, y: 40, subText: "Revenue Overseer" },
      { id: "p9_operational", label: "GTM Engineer (01c)", type: "agent", icon: "cpu", x: 230, y: 175, subText: "Technical Specialist" },
      { id: "p9_tool", label: "Notion Legal Search", type: "tool", icon: "network", x: 480, y: 175, subText: "Pricing Schema Check" },
      { id: "p9_gate", label: "Legal Slack Gate", type: "gate", icon: "message", x: 480, y: 310, subText: "Counsel Sign-off" },
      { id: "p9_db", label: "Gumloop Contract DB", type: "db", icon: "database", x: 770, y: 310, subText: "Contract Generated" }
    ],
    connections: [
      { from: "p9_trigger", to: "p9_strategic", type: "trigger" },
      { from: "p9_strategic", to: "p9_operational", type: "delegate" },
      { from: "p9_operational", to: "p9_tool", type: "query" },
      { from: "p9_tool", to: "p9_gate", type: "approve" },
      { from: "p9_gate", to: "p9_db", type: "sync" },
      { from: "p9_db", to: "p9_strategic", type: "sync" }
    ],
    steps: [
      { nodeId: "p9_trigger", log: "HubSpot Trigger: Opportunity shifted to 'Contract Negotiation' stage (Deal value: $120k/yr).", actionType: "think" },
      { nodeId: "p9_strategic", log: "✉ RevOps Lead Agent auditing contract discounting parameters. Delegating schema checks to GTM Engineer.", actionType: "think" },
      { nodeId: "p9_operational", log: "📥 GTM Engineer Agent querying legal pricing compliance parameters in Notion.", actionType: "think" },
      { nodeId: "p9_tool", log: "⚙ [Tool Gateway] Invoking Notion REST API `/v1/pages` to audit approved discount thresholds and supporting SLAs.", actionType: "call_tool" },
      { nodeId: "p9_gate", log: "💬 [Slack HITL Gate] Awaiting General Counsel review and redline approval in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Head of RevOps (03e)", request: "Approve 15% pricing discount and SLA Clause 4b (Premium support) for Stripe contract draft." } },
      { nodeId: "p9_db", log: "✔ Gumloop contract generation pipeline completed and synced! 📈 Telemetry feedback loop active: Pushing metrics back to Head of RevOps (03e) for pricing yield reports.", actionType: "done" }
    ]
  },
  {
    id: "p10_lost_reengage",
    name: "P10: Closed-Lost Re-engagement Prospecting",
    category: "SLG",
    description: "HubSpot Closed-Lost ──► CMO Agent (01) ──► SDR Manager (03a) ──► LinkedIn Retarget ──► Re-engage Gate ──► Apollo Nurture",
    nodes: [
      { id: "p10_trigger", label: "Closed-Lost Deal", type: "trigger", icon: "zap", x: 40, y: 40, subText: "HubSpot Trigger" },
      { id: "p10_strategic", label: "CMO Agent (01)", type: "agent", icon: "cpu", x: 230, y: 40, subText: "Marketing Director" },
      { id: "p10_operational", label: "SDR Manager (03a)", type: "agent", icon: "cpu", x: 230, y: 175, subText: "Sales Operations" },
      { id: "p10_tool", label: "LinkedIn Retarget", type: "tool", icon: "network", x: 480, y: 175, subText: "Marketing API" },
      { id: "p10_gate", label: "Re-engage Gate", type: "gate", icon: "message", x: 480, y: 310, subText: "Approval Gate" },
      { id: "p10_db", label: "Apollo Nurture DB", type: "db", icon: "database", x: 770, y: 310, subText: "Resequenced CRM" }
    ],
    connections: [
      { from: "p10_trigger", to: "p10_strategic", type: "trigger" },
      { from: "p10_strategic", to: "p10_operational", type: "delegate" },
      { from: "p10_operational", to: "p10_tool", type: "query" },
      { from: "p10_tool", to: "p10_gate", type: "approve" },
      { from: "p10_gate", to: "p10_db", type: "sync" },
      { from: "p10_db", to: "p10_strategic", type: "sync" }
    ],
    steps: [
      { nodeId: "p10_trigger", log: "HubSpot Trigger: Deal 'Vanguard Logistics' closed-lost 6 months ago for 'Budget Limits'.", actionType: "think" },
      { nodeId: "p10_strategic", log: "✉ CMO Agent scheduling automated retargeting loops. Delegating custom LinkedIn warm ad segments to SDR Manager.", actionType: "think" },
      { nodeId: "p10_operational", log: "📥 SDR Manager Agent pushing closed-lost contacts to custom matched ad audience segments.", actionType: "think" },
      { nodeId: "p10_tool", log: "⚙ [Tool Gateway] Invoking LinkedIn Marketing API to activate matched company domains retargeting campaign.", actionType: "call_tool" },
      { nodeId: "p10_gate", log: "💬 [Slack HITL Gate] Awaiting Account Director sign-off to initiate re-engagement email sequence in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "CMO Agent (01)", request: "Approve warm outbound follow-up for Vanguard Logistics after 14 days of active social warming ads." } },
      { nodeId: "p10_db", log: "✔ Apollo outbound campaign synced! 📈 Telemetry feedback loop active: Returning telemetry back to CMO Agent (01) for ad attribution tuning.", actionType: "done" }
    ]
  },

  // --- COMMUNITY-LED PLAYBOOKS (P11 to P15) ---
  {
    id: "p11_slack_champ",
    name: "P11: Slack Community Signup to Champion",
    category: "Community",
    description: "Slack Member ──► Head of Community (04c) ──► Head of PLG (02b) ──► LinkedIn REST ──► VIP Slack Gate ──► HubSpot CRM",
    nodes: [
      { id: "p11_trigger", label: "Slack Member In", type: "trigger", icon: "zap", x: 40, y: 40, subText: "New Community User" },
      { id: "p11_strategic", label: "Head of Community (04c)", type: "agent", icon: "cpu", x: 230, y: 40, subText: "Advocacy Lead" },
      { id: "p11_operational", label: "Head of PLG (02b)", type: "agent", icon: "cpu", x: 230, y: 175, subText: "Growth Architect" },
      { id: "p11_tool", label: "LinkedIn REST", type: "tool", icon: "network", x: 480, y: 175, subText: "Profile Lookup" },
      { id: "p11_gate", label: "VIP Slack Gate", type: "gate", icon: "message", x: 480, y: 310, subText: "Invite Approval" },
      { id: "p11_db", label: "HubSpot Ambassador DB", type: "db", icon: "database", x: 770, y: 310, subText: "Save Directory" }
    ],
    connections: [
      { from: "p11_trigger", to: "p11_strategic", type: "trigger" },
      { from: "p11_strategic", to: "p11_operational", type: "delegate" },
      { from: "p11_operational", to: "p11_tool", type: "query" },
      { from: "p11_tool", to: "p11_gate", type: "approve" },
      { from: "p11_gate", to: "p11_db", type: "sync" },
      { from: "p11_db", to: "p11_strategic", type: "sync" }
    ],
    steps: [
      { nodeId: "p11_trigger", log: "Slack Trigger: New community registration 'alex_dev99' joined target developer channel.", actionType: "think" },
      { nodeId: "p11_strategic", log: "✉ Head of Community Agent evaluating champion profile indicators. Delegating profile research to Head of PLG.", actionType: "think" },
      { nodeId: "p11_operational", log: "📥 Head of PLG Agent initiating corporate background lookup on the developer workspace metadata.", actionType: "think" },
      { nodeId: "p11_tool", log: "⚙ [Tool Gateway] Invoking LinkedIn API search endpoint to resolve developer profile to corporate entity and job title.", actionType: "call_tool" },
      { nodeId: "p11_gate", log: "💬 [Slack HITL Gate] Awaiting DevRel approval to send custom VIP Ambassador swag package in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Head of Community (04c)", request: "Approve VIP Champion invite for Alex Mercer (Principal Architect, Cisco). ICP score: 96%." } },
      { nodeId: "p11_db", log: "✔ Champion records logged to HubSpot database! 📈 Telemetry feedback loop active: Pushing metrics back to Head of Community (04c) for community tier model updates.", actionType: "done" }
    ]
  },
  {
    id: "p12_slack_qa",
    name: "P12: Slack Q&A Technical Support to Lead",
    category: "Community",
    description: "Slack Query ──► Head of Community (04c) ──► GTM Engineer (01c) ──► Notion RAG Check ──► Answer Gate ──► HubSpot CRM",
    nodes: [
      { id: "p12_trigger", label: "Slack Support Query", type: "trigger", icon: "zap", x: 40, y: 40, subText: "Slack Support Channel" },
      { id: "p12_strategic", label: "Head of Community (04c)", type: "agent", icon: "cpu", x: 230, y: 40, subText: "Developer Liaison" },
      { id: "p12_operational", label: "GTM Engineer (01c)", type: "agent", icon: "cpu", x: 230, y: 175, subText: "Technical Specialist" },
      { id: "p12_tool", label: "Notion RAG Check", type: "tool", icon: "network", x: 480, y: 175, subText: "RAG Strategy Lookup" },
      { id: "p12_gate", label: "Answer Slack Gate", type: "gate", icon: "message", x: 480, y: 310, subText: "Answer Sign-off" },
      { id: "p12_db", label: "HubSpot OSS Lead DB", type: "db", icon: "database", x: 770, y: 310, subText: "OSS Lead Created" }
    ],
    connections: [
      { from: "p12_trigger", to: "p12_strategic", type: "trigger" },
      { from: "p12_strategic", to: "p12_operational", type: "delegate" },
      { from: "p12_operational", to: "p12_tool", type: "query" },
      { from: "p12_tool", to: "p12_gate", type: "approve" },
      { from: "p12_gate", to: "p12_db", type: "sync" },
      { from: "p12_db", to: "p12_strategic", type: "sync" }
    ],
    steps: [
      { nodeId: "p12_trigger", log: "Slack Trigger: Community query posted in #oss-support: 'Does Synapse support custom MCP over SSE?'", actionType: "think" },
      { nodeId: "p12_strategic", log: "✉ Head of Community Agent reviewing community ticket. Delegating technical response generation to GTM Engineer.", actionType: "think" },
      { nodeId: "p12_operational", log: "📥 GTM Engineer Agent initializing Notion strategy search for SSE adapter protocol documentation.", actionType: "think" },
      { nodeId: "p12_tool", log: "⚙ [Tool Gateway] Invoking Notion Strategy RAG API to extract approved architectural guidelines on SSE support.", actionType: "call_tool" },
      { nodeId: "p12_gate", log: "💬 [Slack HITL Gate] Awaiting Developer Advocate approval of the SSE technical answer in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Head of Community (04c)", request: "Approve SSE adapter technical response in Slack. Answer generated using Notion SSE guides." } },
      { nodeId: "p12_db", log: "✔ Lead created in HubSpot CRM OSS directory! 📈 Telemetry feedback loop active: Returning telemetry to Head of Community (04c) for community health index updates.", actionType: "done" }
    ]
  },
  {
    id: "p13_content_promotion",
    name: "P13: Developer Content Promotion Pipeline",
    category: "Community",
    description: "Notion Wiki ──► CMO Agent (01) ──► Head of Community (04c) ──► Gumloop Run ──► Social Gate ──► Google Sheets",
    nodes: [
      { id: "p13_trigger", label: "Notion Strategic Wiki", type: "trigger", icon: "zap", x: 40, y: 40, subText: "Strategic Guideline" },
      { id: "p13_strategic", label: "CMO Agent (01)", type: "agent", icon: "cpu", x: 230, y: 40, subText: "Content Lead" },
      { id: "p13_operational", label: "Head of Community (04c)", type: "agent", icon: "cpu", x: 230, y: 175, subText: "Advocacy Lead" },
      { id: "p13_tool", label: "Gumloop Run", type: "tool", icon: "network", x: 480, y: 175, subText: "Social Distribution" },
      { id: "p13_gate", label: "Social Slack Gate", type: "gate", icon: "message", x: 480, y: 310, subText: "Copy Review" },
      { id: "p13_db", label: "Google Sheets Logs", type: "db", icon: "database", x: 770, y: 310, subText: "Save Campaign Log" }
    ],
    connections: [
      { from: "p13_trigger", to: "p13_strategic", type: "trigger" },
      { from: "p13_strategic", to: "p13_operational", type: "delegate" },
      { from: "p13_operational", to: "p13_tool", type: "query" },
      { from: "p13_tool", to: "p13_gate", type: "approve" },
      { from: "p13_gate", to: "p13_db", type: "sync" },
      { from: "p13_db", to: "p13_strategic", type: "sync" }
    ],
    steps: [
      { nodeId: "p13_trigger", log: "Notion Trigger: Technical strategy wiki 'GTM Observability Guide' shifted to 'Approved'.", actionType: "think" },
      { nodeId: "p13_strategic", log: "✉ CMO Agent designing content promotion plan. Delegating campaign syndication and developer outreach to Head of Community.", actionType: "think" },
      { nodeId: "p13_operational", log: "📥 Head of Community Agent setting up Gumloop automation parameters to distribute post drafts.", actionType: "think" },
      { nodeId: "p13_tool", log: "⚙ [Tool Gateway] Invoking Gumloop API /pipelines/run to rewrite wiki contents into Twitter threads and LinkedIn updates.", actionType: "call_tool" },
      { nodeId: "p13_gate", log: "💬 [Slack HITL Gate] Awaiting editor review of the Twitter thread and LinkedIn post variations in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "CMO Agent (01)", request: "Approve 3 syndicated content copies for 'GTM Observability Guide'. Google UTM tracking variables generated." } },
      { nodeId: "p13_db", log: "✔ Campaign logged in Google Sheets! 📈 Telemetry feedback loop active: Returning telemetry back to CMO Agent (01) for real-time campaign performance audits.", actionType: "done" }
    ]
  },
  {
    id: "p14_discord_launch",
    name: "P14: Discord / Slack Community Launch",
    category: "Community",
    description: "Launch Doc ──► Head of Community (04c) ──► Head of RevOps (03e) ──► Google Sheets ──► Invite Gate ──► Notion Wiki",
    nodes: [
      { id: "p14_trigger", label: "Notion Launch Doc", type: "trigger", icon: "zap", x: 40, y: 40, subText: "Strategy Blueprint" },
      { id: "p14_strategic", label: "Head of Community (04c)", type: "agent", icon: "cpu", x: 230, y: 40, subText: "Program Lead" },
      { id: "p14_operational", label: "Head of RevOps (03e)", type: "agent", icon: "cpu", x: 230, y: 175, subText: "Revenue Overseer" },
      { id: "p14_tool", label: "Google Sheets REST", type: "tool", icon: "network", x: 480, y: 175, subText: "Candidate Directory" },
      { id: "p14_gate", label: "Invite Slack Gate", type: "gate", icon: "message", x: 480, y: 310, subText: "Exclusivity Check" },
      { id: "p14_db", label: "Notion Strategy Wiki", type: "db", icon: "database", x: 770, y: 310, subText: "Ambassador Database" }
    ],
    connections: [
      { from: "p14_trigger", to: "p14_strategic", type: "trigger" },
      { from: "p14_strategic", to: "p14_operational", type: "delegate" },
      { from: "p14_operational", to: "p14_tool", type: "query" },
      { from: "p14_tool", to: "p14_gate", type: "approve" },
      { from: "p14_gate", to: "p14_db", type: "sync" },
      { from: "p14_db", to: "p14_strategic", type: "sync" }
    ],
    steps: [
      { nodeId: "p14_trigger", log: "Notion Trigger: 'Ambassador Program Cohort Q3' launch strategy approved.", actionType: "think" },
      { nodeId: "p14_strategic", log: "✉ Head of Community Agent coordinating the invite list. Delegating registry audits and data operations to Head of RevOps.", actionType: "think" },
      { nodeId: "p14_operational", log: "📥 RevOps Lead Agent launching candidate list retrieval queries on the Google Sheets directory.", actionType: "think" },
      { nodeId: "p14_tool", log: "⚙ [Tool Gateway] Invoking Google Sheets API `/v4/spreadsheets` to read candidate contacts matching active github profiles.", actionType: "call_tool" },
      { nodeId: "p14_gate", log: "💬 [Slack HITL Gate] Awaiting Community VP review of the ambassador launch invitees in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Head of Community (04c)", request: "Approve invitation launch for 15 developer ambassadors. Contact profiles audited via GitHub commits." } },
      { nodeId: "p14_db", log: "✔ Registry synced in Notion strategy database! 📈 Telemetry feedback loop active: Returning telemetry to Head of Community (04c) for target conversion analytics.", actionType: "done" }
    ]
  },
  {
    id: "p15_github_contribution",
    name: "P15: Technical PR Contribution Qualified",
    category: "Community",
    description: "PR Alert ──► Head of Community (04c) ──► GTM Engineer (01c) ──► Clay Table Check ──► Review Gate ──► Zoom debug",
    nodes: [
      { id: "p15_trigger", label: "Slack PR Alert", type: "trigger", icon: "zap", x: 40, y: 40, subText: "Github Webhook" },
      { id: "p15_strategic", label: "Head of Community (04c)", type: "agent", icon: "cpu", x: 230, y: 40, subText: "Advocacy Lead" },
      { id: "p15_operational", label: "GTM Engineer (01c)", type: "agent", icon: "cpu", x: 230, y: 175, subText: "Technical Specialist" },
      { id: "p15_tool", label: "Clay Table Check", type: "tool", icon: "network", x: 480, y: 175, subText: "Company Check" },
      { id: "p15_gate", label: "Code Review Gate", type: "gate", icon: "message", x: 480, y: 310, subText: "Review Gate" },
      { id: "p15_db", label: "Zoom Debug DB", type: "db", icon: "database", x: 770, y: 310, subText: "Book Debug Session" }
    ],
    connections: [
      { from: "p15_trigger", to: "p15_strategic", type: "trigger" },
      { from: "p15_strategic", to: "p15_operational", type: "delegate" },
      { from: "p15_operational", to: "p15_tool", type: "query" },
      { from: "p15_tool", to: "p15_gate", type: "approve" },
      { from: "p15_gate", to: "p15_db", type: "sync" },
      { from: "p15_db", to: "p15_strategic", type: "sync" }
    ],
    steps: [
      { nodeId: "p15_trigger", log: "Slack Trigger: Community PR #402 submitted by developer 'johndoe' to core memory adapters.", actionType: "think" },
      { nodeId: "p15_strategic", log: "✉ Developer Advocate Agent reviewing contribution value. Delegating developer company enrichment to GTM Engineer.", actionType: "think" },
      { nodeId: "p15_operational", log: "📥 GTM Engineer Agent executing Clay table lookups on developer's company domain.", actionType: "think" },
      { nodeId: "p15_tool", log: "⚙ [Tool Gateway] Invoking Clay API to enrich developer company metadata and search for target account overlaps.", actionType: "call_tool" },
      { nodeId: "p15_gate", log: "💬 [Slack HITL Gate] Awaiting Engineering lead code sign-off and follow-up authorization in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Head of Community (04c)", request: "Approve contribution follow-up and technical Zoom booking. Contributor works at 'Apex Pay' (Tier-1 target)." } },
      { nodeId: "p15_db", log: "✔ Zoom follow-up scheduled and logged! 📈 Telemetry feedback loop active: Sending PR resolution metrics to Head of Community (04c) for continuous contributor model alignment.", actionType: "done" }
    ]
  },

  // --- PARTNER-LED PLAYBOOKS (P16 to P20) ---
  {
    id: "p16_coselling_sync",
    name: "P16: Co-Selling Sync & Joint Opportunity",
    category: "Partner",
    description: "Make Webhook ──► CSO Agent (01b) ──► Head of Partners (02c) ──► Notion Partner DB ──► Warm Intro Gate ──► HubSpot Joint CRM",
    nodes: [
      { id: "p16_trigger", label: "Make Webhook", type: "trigger", icon: "zap", x: 40, y: 40, subText: "On-Demand Trigger" },
      { id: "p16_strategic", label: "CSO Agent (01b)", type: "agent", icon: "cpu", x: 230, y: 40, subText: "Strategy Lead" },
      { id: "p16_operational", label: "Head of Partners (02c)", type: "agent", icon: "cpu", x: 230, y: 175, subText: "Alliance Manager" },
      { id: "p16_tool", label: "Notion Partner DB", type: "tool", icon: "network", x: 480, y: 175, subText: "Partner Database" },
      { id: "p16_gate", label: "Warm Intro Gate", type: "gate", icon: "message", x: 480, y: 310, subText: "Warm Intro Gate" },
      { id: "p16_db", label: "HubSpot Joint CRM", type: "db", icon: "database", x: 770, y: 310, subText: "Joint Opportunity" }
    ],
    connections: [
      { from: "p16_trigger", to: "p16_strategic", type: "trigger" },
      { from: "p16_strategic", to: "p16_operational", type: "delegate" },
      { from: "p16_operational", to: "p16_tool", type: "query" },
      { from: "p16_tool", to: "p16_gate", type: "approve" },
      { from: "p16_gate", to: "p16_db", type: "sync" },
      { from: "p16_db", to: "p16_strategic", type: "sync" }
    ],
    steps: [
      { nodeId: "p16_trigger", log: "Make.com Trigger: Crossbeam account overlaps sync webhook detected 14 active account overlaps.", actionType: "think" },
      { nodeId: "p16_strategic", log: "✉ Chief Strategy Officer Agent evaluating joint target campaigns. Delegating margin reviews and reseller outreach to Head of Partners.", actionType: "think" },
      { nodeId: "p16_operational", log: "📥 Head of Partners Agent querying matching systems integrator margin agreements in Notion.", actionType: "think" },
      { nodeId: "p16_tool", log: "⚙ [Tool Gateway] Invoking Notion REST API `/v1/databases` to check reseller commission guidelines and target pricing.", actionType: "call_tool" },
      { nodeId: "p16_gate", log: "💬 [Slack HITL Gate] Awaiting Alliance VP approval to initiate warm introduction request in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Chief Strategy Officer (01b)", request: "Approve joint referral outreach to Tier-1 Reseller for 14 overlaps. Combined pipeline TAM: $180,000." } },
      { nodeId: "p16_db", log: "✔ Joint opportunity synced in HubSpot CRM! 📈 Telemetry feedback loop active: Returning transaction status back to CSO Agent (01b) for strategic revenue modeling.", actionType: "done" }
    ]
  },
  {
    id: "p17_ecosystem_plan",
    name: "P17: Ecosystem Account Plan Orchestration",
    category: "Partner",
    description: "HubSpot TAM ──► CSO Agent (01b) ──► Head of Partners (02c) ──► Ahrefs SEO API ──► Plan Gate ──► Notion Wiki",
    nodes: [
      { id: "p17_trigger", label: "HubSpot TAM", type: "trigger", icon: "zap", x: 40, y: 40, subText: "Target Partner Segment" },
      { id: "p17_strategic", label: "CSO Agent (01b)", type: "agent", icon: "cpu", x: 230, y: 40, subText: "Strategy Lead" },
      { id: "p17_operational", label: "Head of Partners (02c)", type: "agent", icon: "cpu", x: 230, y: 175, subText: "Alliance Manager" },
      { id: "p17_tool", label: "Ahrefs SEO API", type: "tool", icon: "network", x: 480, y: 175, subText: "Backlink Overlaps" },
      { id: "p17_gate", label: "Plan Review Gate", type: "gate", icon: "message", x: 480, y: 310, subText: "Strategy Review" },
      { id: "p17_db", label: "Notion Strategy Wiki", type: "db", icon: "database", x: 770, y: 310, subText: "Save Joint Plan" }
    ],
    connections: [
      { from: "p17_trigger", to: "p17_strategic", type: "trigger" },
      { from: "p17_strategic", to: "p17_operational", type: "delegate" },
      { from: "p17_operational", to: "p17_tool", type: "query" },
      { from: "p17_tool", to: "p17_gate", type: "approve" },
      { from: "p17_gate", to: "p17_db", type: "sync" },
      { from: "p17_db", to: "p17_strategic", type: "sync" }
    ],
    steps: [
      { nodeId: "p17_trigger", log: "HubSpot Trigger: Target co-marketing account 'Stripe' approved for ecosystem mapping.", actionType: "think" },
      { nodeId: "p17_strategic", log: "✉ Chief Strategy Officer Agent analyzing joint marketing potential. Delegating SEO overlap audit to Head of Partners.", actionType: "think" },
      { nodeId: "p17_operational", log: "📥 Head of Partners Agent invoking organic search overlap queries using Ahrefs integrations.", actionType: "think" },
      { nodeId: "p17_tool", log: "⚙ [Tool Gateway] Invoking Ahrefs REST API to crawl backlinks overlap and target keywords between platforms.", actionType: "call_tool" },
      { nodeId: "p17_gate", log: "💬 [Slack HITL Gate] Awaiting Partner Marketing Director approval of SEO campaign budget in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Chief Strategy Officer (01b)", request: "Approve joint content campaigns with Stripe. Targeted keywords: B2B payment orchestration, AI billing." } },
      { nodeId: "p17_db", log: "✔ Co-marketing plans saved to Notion joint Wiki! 📈 Telemetry feedback loop active: Returning telemetry to CSO Agent (01b) for strategic dashboard alignment.", actionType: "done" }
    ]
  },
  {
    id: "p18_directory_routing",
    name: "P18: AppExchange Directory Listing Routing",
    category: "Partner",
    description: "Make Webhook ──► CSO Agent (01b) ──► Head of RevOps (03e) ──► Clay Sizing API ──► Route Gate ──► HubSpot CRM",
    nodes: [
      { id: "p18_trigger", label: "Make Webhook", type: "trigger", icon: "zap", x: 40, y: 40, subText: "On-Demand Directory" },
      { id: "p18_strategic", label: "CSO Agent (01b)", type: "agent", icon: "cpu", x: 230, y: 40, subText: "Strategy Lead" },
      { id: "p18_operational", label: "Head of RevOps (03e)", type: "agent", icon: "cpu", x: 230, y: 175, subText: "Revenue Overseer" },
      { id: "p18_tool", label: "Clay Sizing API", type: "tool", icon: "network", x: 480, y: 175, subText: "Lead Sizing Webhook" },
      { id: "p18_gate", label: "Route Slack Gate", type: "gate", icon: "message", x: 480, y: 310, subText: "Routing Review" },
      { id: "p18_db", label: "HubSpot Partner CRM", type: "db", icon: "database", x: 770, y: 310, subText: "Lead Synced" }
    ],
    connections: [
      { from: "p18_trigger", to: "p18_strategic", type: "trigger" },
      { from: "p18_strategic", to: "p18_operational", type: "delegate" },
      { from: "p18_operational", to: "p18_tool", type: "query" },
      { from: "p18_tool", to: "p18_gate", type: "approve" },
      { from: "p18_gate", to: "p18_db", type: "sync" },
      { from: "p18_db", to: "p18_strategic", type: "sync" }
    ],
    steps: [
      { nodeId: "p18_trigger", log: "Make.com Trigger: Directory lead submission webhook registered for 'Aero Logistics' (reseller lead).", actionType: "think" },
      { nodeId: "p18_strategic", log: "✉ Chief Strategy Officer Agent analyzing partner tier routes. Delegating account sizing check to Head of RevOps.", actionType: "think" },
      { nodeId: "p18_operational", log: "📥 RevOps Lead Agent triggering Clay waterfalls to audit target headcount and funding records.", actionType: "think" },
      { nodeId: "p18_tool", log: "⚙ [Tool Gateway] Triggering Clay API webhook to resolve Aero Logistics estimated ARR and employee growth.", actionType: "call_tool" },
      { nodeId: "p18_gate", log: "💬 [Slack HITL Gate] Awaiting Alliance Ops approval to assign lead to the high-value Tier-1 Reseller channel in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Chief Strategy Officer (01b)", request: "Approve Aero Logistics channel assignment to Aero Partners. Headcount: 4,500. TAM: $120,000." } },
      { nodeId: "p18_db", log: "✔ Directory lead synced in HubSpot CRM partner pipeline! 📈 Telemetry feedback loop active: Sending routing telemetry to CSO Agent (01b) for yield statistics.", actionType: "done" }
    ]
  },
  {
    id: "p19_deal_conflict",
    name: "P19: Reseller Deal Conflict Check",
    category: "Partner",
    description: "Make Reseller Hook ──► CSO Agent (01b) ──► Head of Partners (02c) ──► HubSpot Search ──► Exclusivity Gate ──► Notion Margin DB",
    nodes: [
      { id: "p19_trigger", label: "Make Reseller Hook", type: "trigger", icon: "zap", x: 40, y: 40, subText: "Reseller Inbound" },
      { id: "p19_strategic", label: "CSO Agent (01b)", type: "agent", icon: "cpu", x: 230, y: 40, subText: "Strategy Lead" },
      { id: "p19_operational", label: "Head of Partners (02c)", type: "agent", icon: "cpu", x: 230, y: 175, subText: "Alliance Manager" },
      { id: "p19_tool", label: "HubSpot Search", type: "tool", icon: "network", x: 480, y: 175, subText: "CRM Conflict Check" },
      { id: "p19_gate", label: "Exclusivity Gate", type: "gate", icon: "message", x: 480, y: 310, subText: "Margin Approval" },
      { id: "p19_db", label: "Notion Margin DB", type: "db", icon: "database", x: 770, y: 310, subText: "Margin Approved" }
    ],
    connections: [
      { from: "p19_trigger", to: "p19_strategic", type: "trigger" },
      { from: "p19_strategic", to: "p19_operational", type: "delegate" },
      { from: "p19_operational", to: "p19_tool", type: "query" },
      { from: "p19_tool", to: "p19_gate", type: "approve" },
      { from: "p19_gate", to: "p19_db", type: "sync" },
      { from: "p19_db", to: "p19_strategic", type: "sync" }
    ],
    steps: [
      { nodeId: "p19_trigger", log: "Make.com Trigger: Reseller deal registration submitted for 'Omega Logistics' by partner 'Aero Partners'.", actionType: "think" },
      { nodeId: "p19_strategic", log: "✉ Chief Strategy Officer Agent assessing pipeline exclusivity conflicts. Delegating direct pipeline audit to Head of Partners.", actionType: "think" },
      { nodeId: "p19_operational", log: "📥 Head of Partners Agent querying HubSpot object search REST clients to verify direct sales overlaps.", actionType: "think" },
      { nodeId: "p19_tool", log: "⚙ [Tool Gateway] Invoking HubSpot search API to check active opportunities matching 'Omega Logistics'.", actionType: "call_tool" },
      { nodeId: "p19_gate", log: "💬 [Slack HITL Gate] Awaiting Alliance VP approval to authorize Aero Partners reseller exclusivity and 25% margin in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Chief Strategy Officer (01b)", request: "Approve exclusivity and 25% margin tier for Aero Partners on Omega Logistics. Direct pipeline: Clear." } },
      { nodeId: "p19_db", log: "✔ Conflict checks clear and margin updates synced in Notion partner database! 📈 Telemetry feedback loop active: Sending conflict stats to CSO Agent (01b) for strategic alignment.", actionType: "done" }
    ]
  },
  {
    id: "m1_tam_launch",
    name: "M1: Omnichannel TAM Launch & Marketing-Sales-Partner Campaign",
    category: "Master",
    description: "CMO (01) ──► Motion Heads (02a-d) ──► Ops Managers ──► Tool Gateway ──► Bottom-Up Feedback ──► Slack Gate ──► HubSpot CRM (Loopback CMO)",
    nodes: [
      { id: "01", label: "CMO Agent (01)", type: "agent", icon: "cpu", x: 230, y: 30, subText: "Marketing Chief" },
      { id: "01b", label: "Chief Strategy Officer (01b)", type: "agent", icon: "cpu", x: 430, y: 30, subText: "Ecosystem Strategy" },
      { id: "01c", label: "GTM Engineer (01c)", type: "agent", icon: "cpu", x: 630, y: 30, subText: "Workflow Systems" },
      { id: "01d", label: "Market Intel Analyst (01d)", type: "agent", icon: "cpu", x: 830, y: 30, subText: "Competitor Intel" },
      { id: "02a", label: "VP Sales (02a)", type: "agent", icon: "cpu", x: 130, y: 160, subText: "Outbound Lead" },
      { id: "02b", label: "Head of PLG (02b)", type: "agent", icon: "cpu", x: 330, y: 160, subText: "Growth Overseer" },
      { id: "02c", label: "Head of Community (02c)", type: "agent", icon: "cpu", x: 530, y: 160, subText: "Evangelist Network" },
      { id: "02d", label: "VP Partnerships (02d)", type: "agent", icon: "cpu", x: 730, y: 160, subText: "Co-Selling Head" },
      { id: "04a", label: "VP CS (04a)", type: "agent", icon: "cpu", x: 930, y: 160, subText: "NRR & Retention" },
      { id: "03a", label: "SDR Manager (03a)", type: "agent", icon: "cpu", x: 30, y: 290, subText: "Lead Triage" },
      { id: "03b", label: "Demand Gen Manager (03b)", type: "agent", icon: "cpu", x: 210, y: 290, subText: "Campaigns ROAS" },
      { id: "03c", label: "Content & SEO Lead (03c)", type: "agent", icon: "cpu", x: 390, y: 290, subText: "Organic Traffic" },
      { id: "03d", label: "Field & Events Manager (03d)", type: "agent", icon: "cpu", x: 570, y: 290, subText: "Webinar Lead Gen" },
      { id: "03e", label: "Head of RevOps (03e)", type: "agent", icon: "cpu", x: 750, y: 290, subText: "Lead Router Systems" },
      { id: "04b", label: "CSM Agent (04b)", type: "agent", icon: "cpu", x: 930, y: 290, subText: "Adoption & QBRs" },
      { id: "04c", label: "Expansion AE (04c)", type: "agent", icon: "cpu", x: 1110, y: 290, subText: "Upsell Expansion" },
      { id: "04d", label: "Renewals Manager (04d)", type: "agent", icon: "cpu", x: 1290, y: 290, subText: "Contract Defence" },
      { id: "clay", label: "Clay Enrichment", type: "tool", icon: "network", x: 130, y: 420, subText: "Enrichment Scrapers" },
      { id: "apollo", label: "Apollo Prospecting", type: "tool", icon: "network", x: 380, y: 420, subText: "Contact Finder" },
      { id: "crossbeam", label: "Crossbeam Sync", type: "tool", icon: "network", x: 630, y: 420, subText: "Partner Account Map" },
      { id: "posthog", label: "PostHog Analytics", type: "tool", icon: "network", x: 880, y: 420, subText: "Usage Telemetry" },
      { id: "ahrefs", label: "Ahrefs SEO Check", type: "tool", icon: "network", x: 1130, y: 420, subText: "Organic Audit" },
      { id: "slack_gate", label: "Slack HITL Gate", type: "gate", icon: "message", x: 380, y: 550, subText: "Orchestrator Sign-off" },
      { id: "hubspot", label: "HubSpot CRM DB", type: "db", icon: "database", x: 880, y: 550, subText: "Unified Revenue DB" }
    ],
    connections: [
      { from: "01", to: "02a", type: "delegate" },
      { from: "01", to: "02b", type: "delegate" },
      { from: "01", to: "02c", type: "delegate" },
      { from: "01", to: "02d", type: "delegate" },
      { from: "02a", to: "03a", type: "delegate" },
      { from: "02b", to: "03e", type: "delegate" },
      { from: "02c", to: "03c", type: "delegate" },
      { from: "02d", to: "03b", type: "delegate" },
      { from: "03a", to: "apollo", type: "query" },
      { from: "03e", to: "posthog", type: "query" },
      { from: "03c", to: "ahrefs", type: "query" },
      { from: "03b", to: "crossbeam", type: "query" },
      { from: "apollo", to: "03a", type: "query" },
      { from: "posthog", to: "03e", type: "query" },
      { from: "ahrefs", to: "03c", type: "query" },
      { from: "crossbeam", to: "03b", type: "query" },
      { from: "03a", to: "02a", type: "delegate" },
      { from: "03e", to: "02b", type: "delegate" },
      { from: "03c", to: "02c", type: "delegate" },
      { from: "03b", to: "02d", type: "delegate" },
      { from: "02a", to: "01", type: "delegate" },
      { from: "02b", to: "01", type: "delegate" },
      { from: "02c", to: "01", type: "delegate" },
      { from: "02d", to: "01", type: "delegate" },
      { from: "01", to: "slack_gate", type: "approve" },
      { from: "slack_gate", to: "hubspot", type: "sync" },
      { from: "hubspot", to: "01", type: "sync" }
    ],
    steps: [
      { nodeId: "01", log: "🤖 CMO Agent (01) initiates quarterly GTM motion audit and performance insights request across all active channels.", actionType: "think" },
      { nodeId: "02a,02b,02c,02d", log: "✉ CMO request broadcasted to all 4 GTM Motion Heads: VP Sales (02a), Head of PLG (02b), Head of Community (02c), VP Partnerships (02d). Evaluating cross-functional campaign alignment.", actionType: "think" },
      { nodeId: "03a,03b,03c,03e", log: "✉ GTM Motion Heads delegating audit tasks to operational subagents: SDR Manager (03a), Demand Gen (03b), Content Lead (03c), and RevOps Lead (03e) compile target parameters.", actionType: "think" },
      { nodeId: "apollo,posthog,ahrefs,crossbeam", log: "⚙ [Tool Gateway] Invoking REST APIs in parallel: Apollo for lead lookup, PostHog for usage metrics, Ahrefs for organic search CPC, Crossbeam for partner mapping.", actionType: "call_tool" },
      { nodeId: "03a,03b,03c,03e", log: "📥 [Tool Gateway] API query responses received. Operational managers analyzing TAM search volume, co-selling partner overlaps, and signup telemetry.", actionType: "think" },
      { nodeId: "02a,02b,02c,02d", log: "✉ Operational managers completed channel analyses and passed consolidated performance reports back up to GTM Motion Heads.", actionType: "think" },
      { nodeId: "01", log: "✉ GTM Motion Heads synthesized reports into a single omnichannel TAM launch dashboard and submitted the consolidated briefing to CMO Agent (01).", actionType: "think" },
      { nodeId: "slack_gate", log: "💬 [Slack HITL Gate] Awaiting CMO and RevOps executive budget sign-off and routing validation in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "CMO Agent (01)", request: "Authorize $25,000 ad warming budget and outbound lead routing rule changes. Overall TAM match: 94%. Mutually-shared partner overlaps: 42%." } },
      { nodeId: "hubspot", log: "✔ CMO approval received! Synchronizing approved TAM lead records and budget adjustments to HubSpot CRM database.", actionType: "think" },
      { nodeId: "01", log: "✔ Symmetrical Closed-Loop Loopback Complete! HubSpot CRM verified database sync and returned confirmation payload to CMO (01). Playbook finished successfully.", actionType: "done" }
    ]
  },
  {
    id: "m2_account_expansion",
    name: "M2: Enterprise High-Value Expansion & Ecosystem Co-Selling Audit",
    category: "Master",
    description: "CSO (01b) ──► Motion Heads (02a-d) ──► Ops Managers ──► Tool Gateway ──► Bottom-Up Feedback ──► Slack Gate ──► HubSpot CRM (Loopback CSO)",
    nodes: [
      { id: "01", label: "CMO Agent (01)", type: "agent", icon: "cpu", x: 230, y: 30, subText: "Marketing Chief" },
      { id: "01b", label: "Chief Strategy Officer (01b)", type: "agent", icon: "cpu", x: 430, y: 30, subText: "Ecosystem Strategy" },
      { id: "01c", label: "GTM Engineer (01c)", type: "agent", icon: "cpu", x: 630, y: 30, subText: "Workflow Systems" },
      { id: "01d", label: "Market Intel Analyst (01d)", type: "agent", icon: "cpu", x: 830, y: 30, subText: "Competitor Intel" },
      { id: "02a", label: "VP Sales (02a)", type: "agent", icon: "cpu", x: 130, y: 160, subText: "Outbound Lead" },
      { id: "02b", label: "Head of PLG (02b)", type: "agent", icon: "cpu", x: 330, y: 160, subText: "Growth Overseer" },
      { id: "02c", label: "Head of Community (02c)", type: "agent", icon: "cpu", x: 530, y: 160, subText: "Evangelist Network" },
      { id: "02d", label: "VP Partnerships (02d)", type: "agent", icon: "cpu", x: 730, y: 160, subText: "Co-Selling Head" },
      { id: "04a", label: "VP CS (04a)", type: "agent", icon: "cpu", x: 930, y: 160, subText: "NRR & Retention" },
      { id: "03a", label: "SDR Manager (03a)", type: "agent", icon: "cpu", x: 30, y: 290, subText: "Lead Triage" },
      { id: "03b", label: "Demand Gen Manager (03b)", type: "agent", icon: "cpu", x: 210, y: 290, subText: "Campaigns ROAS" },
      { id: "03c", label: "Content & SEO Lead (03c)", type: "agent", icon: "cpu", x: 390, y: 290, subText: "Organic Traffic" },
      { id: "03d", label: "Field & Events Manager (03d)", type: "agent", icon: "cpu", x: 570, y: 290, subText: "Webinar Lead Gen" },
      { id: "03e", label: "Head of RevOps (03e)", type: "agent", icon: "cpu", x: 750, y: 290, subText: "Lead Router Systems" },
      { id: "04b", label: "CSM Agent (04b)", type: "agent", icon: "cpu", x: 930, y: 290, subText: "Adoption & QBRs" },
      { id: "04c", label: "Expansion AE (04c)", type: "agent", icon: "cpu", x: 1110, y: 290, subText: "Upsell Expansion" },
      { id: "04d", label: "Renewals Manager (04d)", type: "agent", icon: "cpu", x: 1290, y: 290, subText: "Contract Defence" },
      { id: "clay", label: "Clay Enrichment", type: "tool", icon: "network", x: 130, y: 420, subText: "Enrichment Scrapers" },
      { id: "apollo", label: "Apollo Prospecting", type: "tool", icon: "network", x: 380, y: 420, subText: "Contact Finder" },
      { id: "crossbeam", label: "Crossbeam Sync", type: "tool", icon: "network", x: 630, y: 420, subText: "Partner Account Map" },
      { id: "posthog", label: "PostHog Analytics", type: "tool", icon: "network", x: 880, y: 420, subText: "Usage Telemetry" },
      { id: "ahrefs", label: "Ahrefs SEO Check", type: "tool", icon: "network", x: 1130, y: 420, subText: "Organic Audit" },
      { id: "slack_gate", label: "Slack HITL Gate", type: "gate", icon: "message", x: 380, y: 550, subText: "Orchestrator Sign-off" },
      { id: "hubspot", label: "HubSpot CRM DB", type: "db", icon: "database", x: 880, y: 550, subText: "Unified Revenue DB" }
    ],
    connections: [
      { from: "01b", to: "02a", type: "delegate" },
      { from: "01b", to: "02b", type: "delegate" },
      { from: "01b", to: "02c", type: "delegate" },
      { from: "01b", to: "02d", type: "delegate" },
      { from: "02a", to: "03a", type: "delegate" },
      { from: "02b", to: "03e", type: "delegate" },
      { from: "02c", to: "03d", type: "delegate" },
      { from: "02d", to: "03b", type: "delegate" },
      { from: "03a", to: "apollo", type: "query" },
      { from: "03e", to: "posthog", type: "query" },
      { from: "03d", to: "clay", type: "query" },
      { from: "03b", to: "crossbeam", type: "query" },
      { from: "apollo", to: "03a", type: "query" },
      { from: "posthog", to: "03e", type: "query" },
      { from: "clay", to: "03d", type: "query" },
      { from: "crossbeam", to: "03b", type: "query" },
      { from: "03a", to: "02a", type: "delegate" },
      { from: "03e", to: "02b", type: "delegate" },
      { from: "03d", to: "02c", type: "delegate" },
      { from: "03b", to: "02d", type: "delegate" },
      { from: "02a", to: "01b", type: "delegate" },
      { from: "02b", to: "01b", type: "delegate" },
      { from: "02c", to: "01b", type: "delegate" },
      { from: "02d", to: "01b", type: "delegate" },
      { from: "01b", to: "slack_gate", type: "approve" },
      { from: "slack_gate", to: "hubspot", type: "sync" },
      { from: "hubspot", to: "01b", type: "sync" }
    ],
    steps: [
      { nodeId: "01b", log: "🤖 Chief Strategy Officer (01b) initiates audit for high-value enterprise account expansion pathways and co-selling opportunities.", actionType: "think" },
      { nodeId: "02a,02b,02c,02d", log: "✉ CSO request broadcasted to all 4 GTM Motion Heads. Aligned to identify cross-sell expansion potential and partner co-marketing overlays.", actionType: "think" },
      { nodeId: "03a,03b,03d,03e", log: "✉ GTM Motion Heads task operational layers: SDR Manager (03a) to check buying committee, RevOps (03e) for usage spillover, Events (03d) for event attendee matching, Demand Gen (03b) for partner overlays.", actionType: "think" },
      { nodeId: "apollo,posthog,clay,crossbeam", log: "⚙ [Tool Gateway] Invoking REST APIs in parallel: Apollo for committee enrichment, PostHog for usage alerts, Clay for scraping recent executive hires, Crossbeam for partner mapping.", actionType: "call_tool" },
      { nodeId: "03a,03b,03d,03e", log: "📥 [Tool Gateway] API query results compiled. Operational managers analyzing corporate stakeholder profiles, partner deal overlaps, and billing credit spikes.", actionType: "think" },
      { nodeId: "02a,02b,02c,02d", log: "✉ Operational reports verified. RevOps and Partnerships submit analyzed data to GTM Motion Heads for review.", actionType: "think" },
      { nodeId: "01b", log: "✉ GTM Motion Heads synthesize partner overlaps and usage expansion pathways into a single corporate expansion dashboard and submit to CSO (01b).", actionType: "think" },
      { nodeId: "slack_gate", log: "💬 [Slack HITL Gate] Awaiting CSO and Alliance VP sign-off on reseller pricing structures and partner outreach plans in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Chief Strategy Officer (01b)", request: "Approve joint co-selling partner introduction campaign and 15% reseller tier margins for Stark Industries. Est. pipeline: $120,000." } },
      { nodeId: "hubspot", log: "✔ CSO approval received! Updating Stark Industries deal attributes and partner association maps in HubSpot CRM.", actionType: "think" },
      { nodeId: "01b", log: "✔ Symmetrical Closed-Loop Loopback Complete! HubSpot CRM confirmed expansion deal creation and returned confirmation payload to CSO (01b). Playbook finished successfully.", actionType: "done" }
    ]
  },
  {
    id: "m3_churn_recovery",
    name: "M3: Omnichannel Churn Alert & Emergency Recovery Protocol",
    category: "Master",
    description: "CSO (01b) ──► Motion Heads (02a-d) ──► Ops Managers ──► Tool Gateway ──► Bottom-Up Feedback ──► Slack Gate ──► HubSpot CRM (Loopback CSO)",
    nodes: [
      { id: "01", label: "CMO Agent (01)", type: "agent", icon: "cpu", x: 230, y: 30, subText: "Marketing Chief" },
      { id: "01b", label: "Chief Strategy Officer (01b)", type: "agent", icon: "cpu", x: 430, y: 30, subText: "Ecosystem Strategy" },
      { id: "01c", label: "GTM Engineer (01c)", type: "agent", icon: "cpu", x: 630, y: 30, subText: "Workflow Systems" },
      { id: "01d", label: "Market Intel Analyst (01d)", type: "agent", icon: "cpu", x: 830, y: 30, subText: "Competitor Intel" },
      { id: "02a", label: "VP Sales (02a)", type: "agent", icon: "cpu", x: 130, y: 160, subText: "Outbound Lead" },
      { id: "02b", label: "Head of PLG (02b)", type: "agent", icon: "cpu", x: 330, y: 160, subText: "Growth Overseer" },
      { id: "02c", label: "Head of Community (02c)", type: "agent", icon: "cpu", x: 530, y: 160, subText: "Evangelist Network" },
      { id: "02d", label: "VP Partnerships (02d)", type: "agent", icon: "cpu", x: 730, y: 160, subText: "Co-Selling Head" },
      { id: "04a", label: "VP CS (04a)", type: "agent", icon: "cpu", x: 930, y: 160, subText: "NRR & Retention" },
      { id: "03a", label: "SDR Manager (03a)", type: "agent", icon: "cpu", x: 30, y: 290, subText: "Lead Triage" },
      { id: "03b", label: "Demand Gen Manager (03b)", type: "agent", icon: "cpu", x: 210, y: 290, subText: "Campaigns ROAS" },
      { id: "03c", label: "Content & SEO Lead (03c)", type: "agent", icon: "cpu", x: 390, y: 290, subText: "Organic Traffic" },
      { id: "03d", label: "Field & Events Manager (03d)", type: "agent", icon: "cpu", x: 570, y: 290, subText: "Webinar Lead Gen" },
      { id: "03e", label: "Head of RevOps (03e)", type: "agent", icon: "cpu", x: 750, y: 290, subText: "Lead Router Systems" },
      { id: "04b", label: "CSM Agent (04b)", type: "agent", icon: "cpu", x: 930, y: 290, subText: "Adoption & QBRs" },
      { id: "04c", label: "Expansion AE (04c)", type: "agent", icon: "cpu", x: 1110, y: 290, subText: "Upsell Expansion" },
      { id: "04d", label: "Renewals Manager (04d)", type: "agent", icon: "cpu", x: 1290, y: 290, subText: "Contract Defence" },
      { id: "clay", label: "Clay Enrichment", type: "tool", icon: "network", x: 130, y: 420, subText: "Enrichment Scrapers" },
      { id: "apollo", label: "Apollo Prospecting", type: "tool", icon: "network", x: 380, y: 420, subText: "Contact Finder" },
      { id: "crossbeam", label: "Crossbeam Sync", type: "tool", icon: "network", x: 630, y: 420, subText: "Partner Account Map" },
      { id: "posthog", label: "PostHog Analytics", type: "tool", icon: "network", x: 880, y: 420, subText: "Usage Telemetry" },
      { id: "ahrefs", label: "Ahrefs SEO Check", type: "tool", icon: "network", x: 1130, y: 420, subText: "Organic Audit" },
      { id: "slack_gate", label: "Slack HITL Gate", type: "gate", icon: "message", x: 380, y: 550, subText: "Orchestrator Sign-off" },
      { id: "hubspot", label: "HubSpot CRM DB", type: "db", icon: "database", x: 880, y: 550, subText: "Unified Revenue DB" }
    ],
    connections: [
      { from: "01b", to: "02a", type: "delegate" },
      { from: "01b", to: "02b", type: "delegate" },
      { from: "01b", to: "04a", type: "delegate" },
      { from: "01b", to: "02d", type: "delegate" },
      { from: "02a", to: "03a", type: "delegate" },
      { from: "02b", to: "03e", type: "delegate" },
      { from: "04a", to: "04b", type: "delegate" },
      { from: "02d", to: "03b", type: "delegate" },
      { from: "03a", to: "apollo", type: "query" },
      { from: "03e", to: "posthog", type: "query" },
      { from: "04b", to: "clay", type: "query" },
      { from: "03b", to: "crossbeam", type: "query" },
      { from: "apollo", to: "03a", type: "query" },
      { from: "posthog", to: "03e", type: "query" },
      { from: "clay", to: "04b", type: "query" },
      { from: "crossbeam", to: "03b", type: "query" },
      { from: "03a", to: "02a", type: "delegate" },
      { from: "03e", to: "02b", type: "delegate" },
      { from: "04b", to: "04a", type: "delegate" },
      { from: "03b", to: "02d", type: "delegate" },
      { from: "02a", to: "01b", type: "delegate" },
      { from: "02b", to: "01b", type: "delegate" },
      { from: "04a", to: "01b", type: "delegate" },
      { from: "02d", to: "01b", type: "delegate" },
      { from: "01b", to: "slack_gate", type: "approve" },
      { from: "slack_gate", to: "hubspot", type: "sync" },
      { from: "hubspot", to: "01b", type: "sync" }
    ],
    steps: [
      { nodeId: "01b", log: "🤖 Chief Strategy Officer (01b) triggers emergency risk assessment across all key accounts showing product drop alerts.", actionType: "think" },
      { nodeId: "02a,02b,02d,04a", log: "✉ CSO request broadcasted to Sales (02a), PLG (02b), Partnerships (02d), and VP CS (04a) to evaluate customer health and contract boundaries.", actionType: "think" },
      { nodeId: "03a,03b,03e,04b", log: "✉ Motion Heads delegate tasks: CS Lead (04a) tasks CSM (04b) to enrich recent departures, PLG tasks RevOps (03e) to extract developer error spikes.", actionType: "think" },
      { nodeId: "apollo,posthog,clay,crossbeam", log: "⚙ [Tool Gateway] Invoking REST APIs in parallel: PostHog to query workspace telemetry, Clay to search executive employee departures, Apollo for new contact matches, Crossbeam for partner-owned accounts.", actionType: "call_tool" },
      { nodeId: "03a,03b,03e,04b", log: "📥 [Tool Gateway] API query results compiled. Operational managers Wayne Enterprises developer seat drops, contact movement, and integration errors.", actionType: "think" },
      { nodeId: "02a,02b,02d,04a", log: "✉ Operational reports compiled. CSM (04b) submits account health diagnoses to VP CS (04a) and Sales (02a).", actionType: "think" },
      { nodeId: "01b", log: "✉ GTM Motion Heads consolidate usage drop diagnostics and contract recovery proposals and submit the report to CSO (01b).", actionType: "think" },
      { nodeId: "slack_gate", log: "💬 [Slack HITL Gate] Awaiting CSO and VP Customer Success approval on the emergency recovery package in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "VP CS (04a)", request: "Approve Wayne Enterprises recovery package: 20% seat discount + custom debugging session." } },
      { nodeId: "hubspot", log: "✔ CS Director approval received! Syncing health flags and emergency recovery status to Wayne Enterprises record in HubSpot CRM.", actionType: "think" },
      { nodeId: "01b", log: "✔ Symmetrical Closed-Loop Loopback Complete! HubSpot CRM verified recovery plan and returned confirmation payload to CSO (01b). Playbook finished successfully.", actionType: "done" }
    ]
  },
  {
    id: "m4_quarterly_audit",
    name: "M4: Quarterly GTM Revenue & Attribution Audit",
    category: "Master",
    description: "CMO (01) ──► Motion Heads (02a-d) ──► Ops Managers ──► Tool Gateway ──► Bottom-Up Feedback ──► Slack Gate ──► HubSpot CRM (Loopback CMO)",
    nodes: [
      { id: "01", label: "CMO Agent (01)", type: "agent", icon: "cpu", x: 230, y: 30, subText: "Marketing Chief" },
      { id: "01b", label: "Chief Strategy Officer (01b)", type: "agent", icon: "cpu", x: 430, y: 30, subText: "Ecosystem Strategy" },
      { id: "01c", label: "GTM Engineer (01c)", type: "agent", icon: "cpu", x: 630, y: 30, subText: "Workflow Systems" },
      { id: "01d", label: "Market Intel Analyst (01d)", type: "agent", icon: "cpu", x: 830, y: 30, subText: "Competitor Intel" },
      { id: "02a", label: "VP Sales (02a)", type: "agent", icon: "cpu", x: 130, y: 160, subText: "Outbound Lead" },
      { id: "02b", label: "Head of PLG (02b)", type: "agent", icon: "cpu", x: 330, y: 160, subText: "Growth Overseer" },
      { id: "02c", label: "Head of Community (02c)", type: "agent", icon: "cpu", x: 530, y: 160, subText: "Evangelist Network" },
      { id: "02d", label: "VP Partnerships (02d)", type: "agent", icon: "cpu", x: 730, y: 160, subText: "Co-Selling Head" },
      { id: "04a", label: "VP CS (04a)", type: "agent", icon: "cpu", x: 930, y: 160, subText: "NRR & Retention" },
      { id: "03a", label: "SDR Manager (03a)", type: "agent", icon: "cpu", x: 30, y: 290, subText: "Lead Triage" },
      { id: "03b", label: "Demand Gen Manager (03b)", type: "agent", icon: "cpu", x: 210, y: 290, subText: "Campaigns ROAS" },
      { id: "03c", label: "Content & SEO Lead (03c)", type: "agent", icon: "cpu", x: 390, y: 290, subText: "Organic Traffic" },
      { id: "03d", label: "Field & Events Manager (03d)", type: "agent", icon: "cpu", x: 570, y: 290, subText: "Webinar Lead Gen" },
      { id: "03e", label: "Head of RevOps (03e)", type: "agent", icon: "cpu", x: 750, y: 290, subText: "Lead Router Systems" },
      { id: "04b", label: "CSM Agent (04b)", type: "agent", icon: "cpu", x: 930, y: 290, subText: "Adoption & QBRs" },
      { id: "04c", label: "Expansion AE (04c)", type: "agent", icon: "cpu", x: 1110, y: 290, subText: "Upsell Expansion" },
      { id: "04d", label: "Renewals Manager (04d)", type: "agent", icon: "cpu", x: 1290, y: 290, subText: "Contract Defence" },
      { id: "clay", label: "Clay Enrichment", type: "tool", icon: "network", x: 130, y: 420, subText: "Enrichment Scrapers" },
      { id: "apollo", label: "Apollo Prospecting", type: "tool", icon: "network", x: 380, y: 420, subText: "Contact Finder" },
      { id: "crossbeam", label: "Crossbeam Sync", type: "tool", icon: "network", x: 630, y: 420, subText: "Partner Account Map" },
      { id: "posthog", label: "PostHog Analytics", type: "tool", icon: "network", x: 880, y: 420, subText: "Usage Telemetry" },
      { id: "ahrefs", label: "Ahrefs SEO Check", type: "tool", icon: "network", x: 1130, y: 420, subText: "Organic Audit" },
      { id: "slack_gate", label: "Slack HITL Gate", type: "gate", icon: "message", x: 380, y: 550, subText: "Orchestrator Sign-off" },
      { id: "hubspot", label: "HubSpot CRM DB", type: "db", icon: "database", x: 880, y: 550, subText: "Unified Revenue DB" }
    ],
    connections: [
      { from: "01", to: "02a", type: "delegate" },
      { from: "01", to: "02b", type: "delegate" },
      { from: "01", to: "02c", type: "delegate" },
      { from: "01", to: "02d", type: "delegate" },
      { from: "02a", to: "03a", type: "delegate" },
      { from: "02b", to: "03e", type: "delegate" },
      { from: "02c", to: "03d", type: "delegate" },
      { from: "02d", to: "03b", type: "delegate" },
      { from: "03a", to: "apollo", type: "query" },
      { from: "03e", to: "posthog", type: "query" },
      { from: "03d", to: "clay", type: "query" },
      { from: "03b", to: "crossbeam", type: "query" },
      { from: "apollo", to: "03a", type: "query" },
      { from: "posthog", to: "03e", type: "query" },
      { from: "clay", to: "03d", type: "query" },
      { from: "crossbeam", to: "03b", type: "query" },
      { from: "03a", to: "02a", type: "delegate" },
      { from: "03e", to: "02b", type: "delegate" },
      { from: "03d", to: "02c", type: "delegate" },
      { from: "03b", to: "02d", type: "delegate" },
      { from: "02a", to: "01", type: "delegate" },
      { from: "02b", to: "01", type: "delegate" },
      { from: "02c", to: "01", type: "delegate" },
      { from: "02d", to: "01", type: "delegate" },
      { from: "01", to: "slack_gate", type: "approve" },
      { from: "slack_gate", to: "hubspot", type: "sync" },
      { from: "hubspot", to: "01", type: "sync" }
    ],
    steps: [
      { nodeId: "01", log: "🤖 CMO Agent (01) triggers quarterly GTM revenue and campaign attribution audit across all active motions.", actionType: "think" },
      { nodeId: "02a,02b,02c,02d", log: "✉ CMO request broadcasted to GTM Motion Heads: Sales (02a), PLG (02b), Community (02c), and Partnerships (02d). Evaluating multi-touch ROI metrics.", actionType: "think" },
      { nodeId: "03a,03b,03d,03e", log: "✉ Motion Heads task operational layers: Demand Gen (03b) to review paid ad conversions, Events (03d) to check community referrals, RevOps (03e) to audit routing attribution logs.", actionType: "think" },
      { nodeId: "apollo,posthog,clay,crossbeam", log: "⚙ [Tool Gateway] Invoking REST APIs in parallel: Clay to parse domain attribution logs, PostHog to check signup channels, Apollo to verify target titles, Crossbeam to map partner registrations.", actionType: "call_tool" },
      { nodeId: "03a,03b,03d,03e", log: "📥 [Tool Gateway] API query results compiled. Operational managers resolving multi-touch conversions, marketing ROI metrics, and partner co-marketing attribution weights.", actionType: "think" },
      { nodeId: "02a,02b,02c,02d", log: "✉ Attribution reports verified. Demand Gen and RevOps managers pass synthesized reports back to GTM Motion Heads.", actionType: "think" },
      { nodeId: "01", log: "✉ GTM Motion Heads consolidate cross-channel attribution data and submit the final Q2 GTM ROI dashboard to CMO (01).", actionType: "think" },
      { nodeId: "slack_gate", log: "💬 [Slack HITL Gate] Awaiting CMO and RevOps executive validation of attribution weighting allocations in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "CMO Agent (01)", request: "Approve Q2 campaign attribution weights: Paid Channels 32%, Community referrals 40%, Partner-led co-selling 28%." } },
      { nodeId: "hubspot", log: "✔ CMO approval received! Synchronizing attribution weighting rules and ROI campaign codes to HubSpot CRM.", actionType: "think" },
      { nodeId: "01", log: "✔ Symmetrical Closed-Loop Loopback Complete! HubSpot CRM verified attribution database sync and returned confirmation payload to CMO (01). Playbook finished successfully.", actionType: "done" }
    ]
  },
  {
    id: "m5_pql_upsell",
    name: "M5: Product-Led Growth Upsell & Enterprise Sales Handoff",
    category: "Master",
    description: "CSO (01b) ──► Motion Heads (02a-d) ──► Ops Managers ──► Tool Gateway ──► Bottom-Up Feedback ──► Slack Gate ──► HubSpot CRM (Loopback CSO)",
    nodes: [
      { id: "01", label: "CMO Agent (01)", type: "agent", icon: "cpu", x: 230, y: 30, subText: "Marketing Chief" },
      { id: "01b", label: "Chief Strategy Officer (01b)", type: "agent", icon: "cpu", x: 430, y: 30, subText: "Ecosystem Strategy" },
      { id: "01c", label: "GTM Engineer (01c)", type: "agent", icon: "cpu", x: 630, y: 30, subText: "Workflow Systems" },
      { id: "01d", label: "Market Intel Analyst (01d)", type: "agent", icon: "cpu", x: 830, y: 30, subText: "Competitor Intel" },
      { id: "02a", label: "VP Sales (02a)", type: "agent", icon: "cpu", x: 130, y: 160, subText: "Outbound Lead" },
      { id: "02b", label: "Head of PLG (02b)", type: "agent", icon: "cpu", x: 330, y: 160, subText: "Growth Overseer" },
      { id: "02c", label: "Head of Community (02c)", type: "agent", icon: "cpu", x: 530, y: 160, subText: "Evangelist Network" },
      { id: "02d", label: "VP Partnerships (02d)", type: "agent", icon: "cpu", x: 730, y: 160, subText: "Co-Selling Head" },
      { id: "04a", label: "VP CS (04a)", type: "agent", icon: "cpu", x: 930, y: 160, subText: "NRR & Retention" },
      { id: "03a", label: "SDR Manager (03a)", type: "agent", icon: "cpu", x: 30, y: 290, subText: "Lead Triage" },
      { id: "03b", label: "Demand Gen Manager (03b)", type: "agent", icon: "cpu", x: 210, y: 290, subText: "Campaigns ROAS" },
      { id: "03c", label: "Content & SEO Lead (03c)", type: "agent", icon: "cpu", x: 390, y: 290, subText: "Organic Traffic" },
      { id: "03d", label: "Field & Events Manager (03d)", type: "agent", icon: "cpu", x: 570, y: 290, subText: "Webinar Lead Gen" },
      { id: "03e", label: "Head of RevOps (03e)", type: "agent", icon: "cpu", x: 750, y: 290, subText: "Lead Router Systems" },
      { id: "04b", label: "CSM Agent (04b)", type: "agent", icon: "cpu", x: 930, y: 290, subText: "Adoption & QBRs" },
      { id: "04c", label: "Expansion AE (04c)", type: "agent", icon: "cpu", x: 1110, y: 290, subText: "Upsell Expansion" },
      { id: "04d", label: "Renewals Manager (04d)", type: "agent", icon: "cpu", x: 1290, y: 290, subText: "Contract Defence" },
      { id: "clay", label: "Clay Enrichment", type: "tool", icon: "network", x: 130, y: 420, subText: "Enrichment Scrapers" },
      { id: "apollo", label: "Apollo Prospecting", type: "tool", icon: "network", x: 380, y: 420, subText: "Contact Finder" },
      { id: "crossbeam", label: "Crossbeam Sync", type: "tool", icon: "network", x: 630, y: 420, subText: "Partner Account Map" },
      { id: "posthog", label: "PostHog Analytics", type: "tool", icon: "network", x: 880, y: 420, subText: "Usage Telemetry" },
      { id: "ahrefs", label: "Ahrefs SEO Check", type: "tool", icon: "network", x: 1130, y: 420, subText: "Organic Audit" },
      { id: "slack_gate", label: "Slack HITL Gate", type: "gate", icon: "message", x: 380, y: 550, subText: "Orchestrator Sign-off" },
      { id: "hubspot", label: "HubSpot CRM DB", type: "db", icon: "database", x: 880, y: 550, subText: "Unified Revenue DB" }
    ],
    connections: [
      { from: "01b", to: "02a", type: "delegate" },
      { from: "01b", to: "02b", type: "delegate" },
      { from: "01b", to: "02c", type: "delegate" },
      { from: "01b", to: "02d", type: "delegate" },
      { from: "02a", to: "03a", type: "delegate" },
      { from: "02b", to: "03e", type: "delegate" },
      { from: "02c", to: "03c", type: "delegate" },
      { from: "02d", to: "03b", type: "delegate" },
      { from: "03a", to: "apollo", type: "query" },
      { from: "03e", to: "posthog", type: "query" },
      { from: "03c", to: "ahrefs", type: "query" },
      { from: "03b", to: "crossbeam", type: "query" },
      { from: "apollo", to: "03a", type: "query" },
      { from: "posthog", to: "03e", type: "query" },
      { from: "ahrefs", to: "03c", type: "query" },
      { from: "crossbeam", to: "03b", type: "query" },
      { from: "03a", to: "02a", type: "delegate" },
      { from: "03e", to: "02b", type: "delegate" },
      { from: "03c", to: "02c", type: "delegate" },
      { from: "03b", to: "02d", type: "delegate" },
      { from: "02a", to: "01b", type: "delegate" },
      { from: "02b", to: "01b", type: "delegate" },
      { from: "02c", to: "01b", type: "delegate" },
      { from: "02d", to: "01b", type: "delegate" },
      { from: "01b", to: "slack_gate", type: "approve" },
      { from: "slack_gate", to: "hubspot", type: "sync" },
      { from: "hubspot", to: "01b", type: "sync" }
    ],
    steps: [
      { nodeId: "01b", log: "🤖 Chief Strategy Officer (01b) triggers enterprise PQL upsell campaign and sales handoff protocol.", actionType: "think" },
      { nodeId: "02a,02b,02c,02d", log: "✉ CSO request broadcasted to all 4 GTM Motion Heads. Aligned to identify high-density product workspaces and commercial upgrade pathways.", actionType: "think" },
      { nodeId: "03a,03b,03c,03e", log: "✉ GTM Motion Heads task operational layers: RevOps (03e) to extract query peaks, SDR (03a) to check stakeholder lists, Content (03c) to compile adapter case studies.", actionType: "think" },
      { nodeId: "apollo,posthog,ahrefs,crossbeam", log: "⚙ [Tool Gateway] Invoking REST APIs in parallel: PostHog to audit seat volume triggers, Apollo for stakeholder phone and email discovery, Ahrefs to query competitor interest indexes, Crossbeam for partner connections.", actionType: "call_tool" },
      { nodeId: "03a,03b,03c,03e", log: "📥 [Tool Gateway] API query results compiled. Operational managers analyzing Oscorp workspace limits, stakeholder departments, and co-selling relationships.", actionType: "think" },
      { nodeId: "02a,02b,02c,02d", log: "✉ Operational reports compiled. SDR and RevOps managers submit qualified upsell briefs back to GTM Motion Heads.", actionType: "think" },
      { nodeId: "01b", log: "✉ GTM Motion Heads synthesize commercial potential and stakeholder maps into a single PQL upgrade briefing and submit to CSO (01b).", actionType: "think" },
      { nodeId: "slack_gate", log: "💬 [Slack HITL Gate] Awaiting Growth Director and VP Sales sign-off on enterprise trial extension and executive outbound sequence in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Head of PLG (02b)", request: "Approve commercial handoff for Oscorp. Workspace seat count: 18. Target deal size ARR: $45,000. Verified VP of Engineering contact loaded." } },
      { nodeId: "hubspot", log: "✔ Growth Director approval received! Syncing qualified lead record and pipeline opportunity attributes to HubSpot CRM.", actionType: "think" },
      { nodeId: "01b", log: "✔ Symmetrical Closed-Loop Loopback Complete! HubSpot CRM verified upsell opportunity creation and returned confirmation payload to CSO (01b). Playbook finished successfully.", actionType: "done" }
    ]
  }
];

export const playbookOverviews: Record<string, PlaybookOverview> = {
  p1_pql_triage: {
    strategy: {
      hypothesis: "High-velocity developer signups indicate bottom-up enterprise conversion potential.",
      trigger: "Workspace records ≥4 developer signups inside PostHog telemetry.",
      outcomes: "Route high-value qualified accounts to SDR Manager for immediate outbound pipeline creation."
    },
    orchestration: {
      strategicRole: "Head of PLG (02b) analyzes workspace activation speed and scores product telemetry metrics.",
      operationalRole: "SDR Manager (03a) performs account profiling and ICP checks against Notion target lists.",
      hitlGateway: "Operator validates PQL workspace status in Slack (#gtm-hitl-approvals) before syncing to HubSpot CRM."
    },
    integrations: [
      { tool: "PostHog API", purpose: "Tracks active seat registration and core feature telemetry." },
      { tool: "Notion REST API", purpose: "Audits company accounts against key ICP profiles via /v1/pages." },
      { tool: "Slack Gateway", purpose: "Delivers interactive qualification approval cards to operators." },
      { tool: "HubSpot CRM", purpose: "Syncs qualified opportunities with estimated deal sizes." }
    ],
    safeguards: {
      boundaries: "Active filter: Automatically discards non-business domains (gmail.com, yahoo.com) from outreach lists.",
      hitlCriteria: "Requires manual confirmation for workspaces scoring above 90% ICP match with deal size >$10k ARR.",
      timeoutDefaults: "30-minute approval window. If timeout expires, request reverts to safe default of 'Denied'."
    }
  },
  p2_churn_prevention: {
    strategy: {
      hypothesis: "A sudden drop in usage frequency indicates customer friction or risk of churn.",
      trigger: "Weekly active usage events drop by ≥35% (via PostHog telemetry).",
      outcomes: "Proactive technical diagnostics and personalized re-engagement campaigns generated."
    },
    orchestration: {
      strategicRole: "VP of CS (04a) monitors account-level trends and orchestrates recovery campaigns.",
      operationalRole: "CSM Manager (04b) executes structural audits and compiles technological diagnostic battlecards.",
      hitlGateway: "CSM signs off on draft outreach emails inside #gtm-hitl-approvals before triggering SendGrid."
    },
    integrations: [
      { tool: "PostHog API", purpose: "Retrieves weekly event metrics and parses churn indicators." },
      { tool: "Clay Enrichment", purpose: "Enriches company database profiles via scraping endpoint." },
      { tool: "Slack Gate", purpose: "Authorizes draft email delivery to designated accounts." },
      { tool: "HubSpot CRM", purpose: "Updates account health scores via /v1/objects/companies." }
    ],
    safeguards: {
      boundaries: "CS policy bounds: Maximum of one automated campaign outreach per account per 30 days.",
      hitlCriteria: "Requires manual approval of technical recommendations for accounts with deal size >$20k ARR.",
      timeoutDefaults: "45-minute response window. Reverts to safe 'Denied' state upon expiration."
    }
  },
  p3_limit_upsell: {
    strategy: {
      hypothesis: "Reaching free tier credit limits offers prime context for enterprise expansion conversions.",
      trigger: "Billing limit warning event is fired from Gumloop adapter.",
      outcomes: "Convert self-serve workspaces into high-value enterprise trials."
    },
    orchestration: {
      strategicRole: "Head of PLG (02b) scores expansion value and audits workspace seat counts.",
      operationalRole: "Head of RevOps (03e) reviews collaborative seat density and operational volume.",
      hitlGateway: "Operator validates custom enterprise pricing before sending trial invitation via Slack."
    },
    integrations: [
      { tool: "Gumloop Billing", purpose: "Signals free credit tier limits exceeded (10,500 operations)." },
      { tool: "PostHog Cohorts", purpose: "Audits active developer seat density." },
      { tool: "Slack Gateway", purpose: "Gates promotional enterprise code distributions." },
      { tool: "HubSpot CRM", purpose: "Creates expansion opportunity objects." }
    ],
    safeguards: {
      boundaries: "Strict cap: Promotional trials are restricted to 14 days maximum.",
      hitlCriteria: "Requires manual approval for workspaces with ARR potential exceeding $25k.",
      timeoutDefaults: "30-minute approval window. Reverts to safe 'Denied' state upon expiration."
    }
  },
  p4_onboarding_activation: {
    strategy: {
      hypothesis: "Self-serve signups who do not activate integrations within 5 days are highly vulnerable to dropping off.",
      trigger: "PostHog telemetry fires inactive registration events.",
      outcomes: "Delivers highly targeted technical documentation and onboarding guides to developers."
    },
    orchestration: {
      strategicRole: "Head of PLG (02b) structures target messaging and segment guides.",
      operationalRole: "CSM Manager (04b) analyzes industry context and technical adapter prerequisites.",
      hitlGateway: "CSM reviews personalized guide drafts inside Slack before sending."
    },
    integrations: [
      { tool: "PostHog API", purpose: "Fires events for incomplete onboarding steps." },
      { tool: "Clay API", purpose: "Retrieves target developer technology stack profile." },
      { tool: "Slack Gateway", purpose: "Coordinates marketing copy and template reviews." },
      { tool: "HubSpot Nurture", purpose: "Syncs contact to onboarding drip campaigns." }
    ],
    safeguards: {
      boundaries: "Rule: Prevents emails to accounts with open or active support tickets.",
      hitlCriteria: "Requires manual approval of custom technology guides to ensure accurate code snippet styling.",
      timeoutDefaults: "60-minute approval window. Reverts to safe 'Denied' state upon expiration."
    }
  },
  p5_team_density: {
    strategy: {
      hypothesis: "Pockets of active users across the same corporate domain indicate an unmapped enterprise division.",
      trigger: "PostHog records domain density clustering (≥7 active users on free tier).",
      outcomes: "Consolidate independent signups into unified corporate enterprise accounts."
    },
    orchestration: {
      strategicRole: "VP of CS (04a) tracks multi-account density and scopes expansion potentials.",
      operationalRole: "SDR Manager (03a) maps subsidiary companies and corporate hierarchy structures.",
      hitlGateway: "Account Director approves enterprise consolidation before merging contacts."
    },
    integrations: [
      { tool: "PostHog API", purpose: "Filters domains for high user concentrations." },
      { tool: "SerpAPI Search", purpose: "Retrieves conglomerate parent relations and employee counts." },
      { tool: "Slack Gateway", purpose: "Handles consolidation routing decisions." },
      { tool: "HubSpot CRM", purpose: "Merges contact records under single parent account." }
    ],
    safeguards: {
      boundaries: "Exclusivity checks: Verifies no active enterprise contracts exist prior to routing.",
      hitlCriteria: "Requires manual verification of domain aliases to prevent improper merging of unrelated companies.",
      timeoutDefaults: "30-minute approval window. Reverts to safe 'Denied' state upon expiration."
    }
  },
  p6_abm_outbound: {
    strategy: {
      hypothesis: "Exposing target accounts to high-intent LinkedIn & Meta ads prior to cold sales outbound boosts response rates.",
      trigger: "TAM segment updates or account uploads inside HubSpot CRM.",
      outcomes: "Generate warm pipeline opportunities through synchronized ads and sales outreach."
    },
    orchestration: {
      strategicRole: "CMO Agent (01) aligns ad budget, asset matching, and campaign structures.",
      operationalRole: "SDR Manager (03a) monitors ad matched-audience status and triggers SDR warm outreach.",
      hitlGateway: "Marketing Lead signs off on ad-spend budget allocations in Slack."
    },
    integrations: [
      { tool: "HubSpot CRM", purpose: "Provides target TAM and account segment lists." },
      { tool: "LinkedIn Ads API", purpose: "Syncs domain matched-audience lists via /adSegments." },
      { tool: "Meta Ads API", purpose: "Syncs corporate email segments via /customaudiences." },
      { tool: "HubSpot Pipeline", purpose: "Tracks active pipeline and conversion status." }
    ],
    safeguards: {
      boundaries: "Budget boundaries: Ad spend is strictly capped at $250 monthly per target domain.",
      hitlCriteria: "Requires approval for target lists exceeding 100 accounts to avoid budget exhaustion.",
      timeoutDefaults: "24-hour approval window. Reverts to safe 'Denied' state upon expiration."
    }
  },
  p7_buying_committee: {
    strategy: {
      hypothesis: "High-value enterprise deals require alignment with multiple stakeholders across security, finance, and engineering.",
      trigger: "New HubSpot inbound enterprise opportunities with missing contact roles.",
      outcomes: "Populate complete organizational committee maps to accelerate enterprise deals."
    },
    orchestration: {
      strategicRole: "Chief Strategy Officer (01b) audits deal size and outlines committee requirements.",
      operationalRole: "SDR Manager (03a) maps professional roles and triggers Apollo enrichment waterfalls.",
      hitlGateway: "Account Executive reviews and approves contact details prior to CRM import."
    },
    integrations: [
      { tool: "HubSpot CRM Webhook", purpose: "Listens for new opportunity stage creations." },
      { tool: "Apollo REST API", purpose: "Enriches contact names, titles, and emails via /v1/people-match." },
      { tool: "Slack Gateway", purpose: "Handles contact verification workflow." },
      { tool: "HubSpot CRM", purpose: "Associates target committee contacts with deals." }
    ],
    safeguards: {
      boundaries: "PII protection: All personal email addresses are automatically scrubbed.",
      hitlCriteria: "Requires AE sign-off on contact validity to ensure high accuracy.",
      timeoutDefaults: "30-minute approval window. Reverts to safe 'Denied' state upon expiration."
    }
  },
  p8_zoom_prep: {
    strategy: {
      hypothesis: "Providing sales reps with rich competitor battlecards and technical stack overviews improves close rates on discovery calls.",
      trigger: "New Zoom discovery call bookings on sales calendars.",
      outcomes: "Generate and save highly detailed strategic briefs inside Notion Strategy databases."
    },
    orchestration: {
      strategicRole: "Chief Strategy Officer (01b) audits booking context and assigns rep briefs.",
      operationalRole: "GTM Engineer (01c) audits technical stacks and compiles custom competitive battlecards.",
      hitlGateway: "Account Executive verifies battlecard details in Slack prior to meeting."
    },
    integrations: [
      { tool: "Zoom Calendars", purpose: "Monitors new meeting bookings and calendar events." },
      { tool: "Clay Webhooks", purpose: "Scrapes employee sizes and active tech stack indicators." },
      { tool: "Slack Gateway", purpose: "Alerts reps with real-time briefings." },
      { tool: "Notion Strategy", purpose: "Saves generated strategic briefs via /v1/pages." }
    ],
    safeguards: {
      boundaries: "Data security: Sensitive customer logs are completely excluded from briefings.",
      hitlCriteria: "Requires manual check of parsed competitor data to avoid presenting outdated information.",
      timeoutDefaults: "60-minute approval window. Reverts to safe 'Denied' state upon expiration."
    }
  },
  p9_contract_redlining: {
    strategy: {
      hypothesis: "Streamlining the contract redlining stage with automated compliance parameter audits accelerates sales cycle velocity.",
      trigger: "HubSpot stage shifts to 'Contract Negotiation' on major deals.",
      outcomes: "Generate fully audited contract pricing proposals in Notion and Gumloop."
    },
    orchestration: {
      strategicRole: "Head of RevOps (03e) monitors pricing yield reports and contract standards.",
      operationalRole: "GTM Engineer (01c) audits pricing models against pre-approved SLA databases.",
      hitlGateway: "General Counsel signs off on liability and custom clauses in Slack."
    },
    integrations: [
      { tool: "HubSpot CRM", purpose: "Triggers on opportunity stage updates." },
      { tool: "Notion Legal Search", purpose: "Checks active discount and SLA guidelines." },
      { tool: "Slack Gateway", purpose: "Gates contract and redline approvals." },
      { tool: "Gumloop Contract DB", purpose: "Triggers on-demand document generation pipelines." }
    ],
    safeguards: {
      boundaries: "Discount caps: Discounts exceeding 15% are strictly locked and block automated generation.",
      hitlCriteria: "Requires manual verification from RevOps for any custom payment terms.",
      timeoutDefaults: "120-minute approval window. Reverts to safe 'Denied' state upon expiration."
    }
  },
  p10_lost_reengage: {
    strategy: {
      hypothesis: "Re-targeting closed-lost prospects after 6 months with updated product capabilities and competitor migration offers unlocks dormant revenue.",
      trigger: "HubSpot Closed-Lost stage reaches 6 months age limit.",
      outcomes: "Launch high-performance Apollo sequence re-engagements with matching ad support."
    },
    orchestration: {
      strategicRole: "CMO Agent (01) structures copy strategies and designs targeted matched audiences.",
      operationalRole: "SDR Manager (03a) monitors segment matches and syncs corporate ad audiences.",
      hitlGateway: "Sales Director approves re-engagement launch parameters in Slack."
    },
    integrations: [
      { tool: "HubSpot CRM API", purpose: "Filters closed-lost accounts matching age criteria." },
      { tool: "LinkedIn Retargeting", purpose: "Syncs target emails to matched-audience ad groups." },
      { tool: "Slack Gateway", purpose: "Coordinates copy reviews and approval flows." },
      { tool: "Apollo Nurture DB", purpose: "Triggers personalized outbound email sequences." }
    ],
    safeguards: {
      boundaries: "Exclusions: Excludes any companies with decreased headcount (>20%) or open support queries.",
      hitlCriteria: "Requires manual review of outreach template variables to ensure relevance.",
      timeoutDefaults: "48-hour approval window. Reverts to safe 'Denied' state upon expiration."
    }
  },
  p11_slack_champ: {
    strategy: {
      hypothesis: "Identifying highly active corporate developers in our open-source Slack community allows us to seed enterprise champions bottom-up.",
      trigger: "New member signup inside the open-source Slack community.",
      outcomes: "Onboard high-value members into the VIP Ambassador and champion directories."
    },
    orchestration: {
      strategicRole: "Head of Community (04c) monitors community active scores and contribution milestones.",
      operationalRole: "Head of PLG (02b) enriches profile background and evaluates ICP scoring criteria.",
      hitlGateway: "DevRel Lead approves Ambassador invitations and swag shipments in Slack."
    },
    integrations: [
      { tool: "Slack Real-Time API", purpose: "Captures new community member registrations." },
      { tool: "LinkedIn Search", purpose: "Resolves member names to professional titles." },
      { tool: "Slack Gateway", purpose: "Coordinates invitation decisions." },
      { tool: "HubSpot Ambassador DB", purpose: "Saves validated VIP champion directories." }
    ],
    safeguards: {
      boundaries: "Ambassador constraints: VIP invites are limited to companies with ≥50 employees.",
      hitlCriteria: "Requires manual check of company domain to avoid inviting competitors.",
      timeoutDefaults: "30-minute approval window. Reverts to safe 'Denied' state upon expiration."
    }
  },
  p12_slack_qa: {
    strategy: {
      hypothesis: "Answering technical community queries with high-fidelity, accurate answers provides organic pipeline entry points.",
      trigger: "New technical support question posted inside developer Slack channels.",
      outcomes: "Publish verified RAG-generated answers and log developer as qualified OSS leads."
    },
    orchestration: {
      strategicRole: "Head of Community (04c) monitors channel query flows and categorizes support tickets.",
      operationalRole: "GTM Engineer (01c) audits architectural docs and constructs RAG summaries.",
      hitlGateway: "Developer Advocate signs off on answer code quality in Slack."
    },
    integrations: [
      { tool: "Slack Events API", purpose: "Listens for messages in designated developer channels." },
      { tool: "Notion RAG Check", purpose: "Extracts validated guides from core engineering databases." },
      { tool: "Slack Gateway", purpose: "Coordinates answer revisions and approval cards." },
      { tool: "HubSpot CRM", purpose: "Enters verified developers into the lead database." }
    ],
    safeguards: {
      boundaries: "RAG verification: Exclude generic generative AI code block responses.",
      hitlCriteria: "Requires manual check for questions touching on enterprise pricing packages.",
      timeoutDefaults: "15-minute approval window. Reverts to safe 'Denied' state upon expiration."
    }
  },
  p13_content_promotion: {
    strategy: {
      hypothesis: "Syndicating technical guidelines into digestible developer social posts increases organic traffic and community signups.",
      trigger: "Notion wiki documentation changes to 'Approved' state.",
      outcomes: "Syndicate multi-format social threads and track referral campaigns."
    },
    orchestration: {
      strategicRole: "CMO Agent (01) checks content calendar objectives and designs tracking schemas.",
      operationalRole: "Head of Community (04c) rewrites long-form wikis into social-friendly drafts.",
      hitlGateway: "Content Editor approves thread structures and UTM coordinates inside Slack."
    },
    integrations: [
      { tool: "Notion REST API", purpose: "Fetches approved markdown files via /v1/pages." },
      { tool: "Gumloop API", purpose: "Triggers on-demand content translation pipelines." },
      { tool: "Slack Gateway", purpose: "Gates copy variation reviews." },
      { tool: "Google Sheets", purpose: "Logs campaign metrics and publishing schedules." }
    ],
    safeguards: {
      boundaries: "Frequency cap: Restricts duplicate promotions to a minimum of 7 days separation.",
      hitlCriteria: "Requires manual audit of destination URLs to prevent broken link syndication.",
      timeoutDefaults: "60-minute approval window. Reverts to safe 'Denied' state upon expiration."
    }
  },
  p14_discord_launch: {
    strategy: {
      hypothesis: "Inviting pre-vetted github contributors to our private discord server maximizes high-quality interaction from day one.",
      trigger: "New cohort launch document set to 'Approved' in Notion.",
      outcomes: "Invite verified contributors to custom Discord servers."
    },
    orchestration: {
      strategicRole: "Head of Community (04c) structures target cohort onboarding strategies.",
      operationalRole: "Head of RevOps (03e) crawls developer profile databases and maps contact records.",
      hitlGateway: "Community VP verifies candidate list and sends out invites."
    },
    integrations: [
      { tool: "Notion REST API", purpose: "Reads launch blueprints from strategy databases." },
      { tool: "Google Sheets API", purpose: "Crawl candidate registries via /v4/spreadsheets." },
      { tool: "Slack Gateway", purpose: "Gates directory review processes." },
      { tool: "Notion Ambassador DB", purpose: "Tracks ambassador program metrics." }
    ],
    safeguards: {
      boundaries: "Candidate boundaries: Developers must have ≥3 commits in our public codebase.",
      hitlCriteria: "Requires check on professional email domains to verify affiliation.",
      timeoutDefaults: "30-minute approval window. Reverts to safe 'Denied' state upon expiration."
    }
  },
  p15_github_contribution: {
    strategy: {
      hypothesis: "High-quality pull requests from corporate engineers indicate intent and present prime opportunities for enterprise conversions.",
      trigger: "GitHub webhook triggers on technical PR submissions to adapter layers.",
      outcomes: "Qualify corporate contributors and coordinate joint technical Zoom debugging sessions."
    },
    orchestration: {
      strategicRole: "Head of Community (04c) audits PR value indicators and scores corporate affiliations.",
      operationalRole: "GTM Engineer (01c) performs organizational overlaps checks using Clay.",
      hitlGateway: "Engineering Lead reviews code quality and triggers meeting schedules in Slack."
    },
    integrations: [
      { tool: "GitHub Webhook", purpose: "Monitors PR activities on adaptor codebases." },
      { tool: "Clay API Table", purpose: "Enriches company domain and maps target account overlaps." },
      { tool: "Slack Gateway", purpose: "Coordinates code reviews and meeting bookings." },
      { tool: "Zoom Calendar API", purpose: "Schedules technical Zoom sessions automatically." }
    ],
    safeguards: {
      boundaries: "PR checklist: Code must pass automated linting checks prior to scheduling.",
      hitlCriteria: "Requires check of the engineer's company size to verify enterprise potential.",
      timeoutDefaults: "30-minute approval window. Reverts to safe 'Denied' state upon expiration."
    }
  },
  p16_coselling_sync: {
    strategy: {
      hypothesis: "Syncing overlaps with strategic systems integrators unlocks warm referral routes to key target accounts.",
      trigger: "Make.com webhooks capture Crossbeam account overlap alerts.",
      outcomes: "Sync joint opportunities to HubSpot CRM and coordinate reseller margins."
    },
    orchestration: {
      strategicRole: "Chief Strategy Officer (01b) assesses ecosystem margins and strategic priorities.",
      operationalRole: "Head of Partners (02c) reviews commission tiers and joint reseller contract clauses.",
      hitlGateway: "Alliance Director signs off on partner warm referral intros inside Slack."
    },
    integrations: [
      { tool: "Make.com Webhooks", purpose: "Triggers on Crossbeam overlap detection events." },
      { tool: "Crossbeam API", purpose: "Extracts shared customer accounts." },
      { tool: "Notion Partner DB", purpose: "Verifies reseller structures and commission details." },
      { tool: "HubSpot Joint CRM", purpose: "Syncs joint opportunities to partner pipelines." }
    ],
    safeguards: {
      boundaries: "Margin cap: Joint partner commission capped at 25% ARR maximum.",
      hitlCriteria: "Requires manual check of existing direct pipeline deals to avoid partner conflict.",
      timeoutDefaults: "60-minute approval window. Reverts to safe 'Denied' state upon expiration."
    }
  },
  p17_ecosystem_plan: {
    strategy: {
      hypothesis: "Joint co-marketing campaigns targeting shared backlink and search keywords with key platform partners boost pipeline creation.",
      trigger: "Co-marketing account segment approvals in HubSpot CRM.",
      outcomes: "Publish co-branded wiki playbooks in Notion and launch search campaigns."
    },
    orchestration: {
      strategicRole: "Chief Strategy Officer (01b) projects revenue yields and reviews channel metrics.",
      operationalRole: "Head of Partners (02c) audits keyword backlinks and crawls shared target profiles.",
      hitlGateway: "Partner Marketing Director approves ad campaign budget details."
    },
    integrations: [
      { tool: "HubSpot CRM", purpose: "Provides target ecosystem company details." },
      { tool: "Ahrefs REST API", purpose: "Crawls domain backlink profile overlaps and keywords." },
      { tool: "Slack Gateway", purpose: "Coordinates content asset and budget approvals." },
      { tool: "Notion Joint Wiki", purpose: "Saves partner ecosystem strategy plans." }
    ],
    safeguards: {
      boundaries: "Content bounds: Ads must not mention competitive partner platforms.",
      hitlCriteria: "Requires manual check of keyword lists to avoid high-cost bid anomalies.",
      timeoutDefaults: "30-minute approval window. Reverts to safe 'Denied' state upon expiration."
    }
  },
  p18_directory_routing: {
    strategy: {
      hypothesis: "Partner directory lead submissions contain high buying intent and need immediate routing to key reseller teams.",
      trigger: "Make.com webhook registers directory listing lead submissions.",
      outcomes: "Route target opportunities to the high-value partner pipeline in HubSpot CRM."
    },
    orchestration: {
      strategicRole: "Chief Strategy Officer (01b) audits partner tier structures and deal allocation weights.",
      operationalRole: "Head of RevOps (03e) evaluates target company capitalization and employee growth trends.",
      hitlGateway: "Alliance Ops Director signs off on account channel routing inside Slack."
    },
    integrations: [
      { tool: "Make.com Webhooks", purpose: "Captures directory contact and form submissions." },
      { tool: "Clay API Webhook", purpose: "Enriches company funding and employee stats." },
      { tool: "Slack Gateway", purpose: "Monitors channel conflict and routes approvals." },
      { tool: "HubSpot Partner CRM", purpose: "Syncs deal opportunities to partner pipeline." }
    ],
    safeguards: {
      boundaries: "Routing policy: Existing direct sales contacts take routing precedence over partners.",
      hitlCriteria: "Requires manual confirmation of target region matching to assign local partners.",
      timeoutDefaults: "45-minute approval window. Reverts to safe 'Denied' state upon expiration."
    }
  },
  p19_deal_conflict: {
    strategy: {
      hypothesis: "Protecting direct sales reps from channel conflict requires real-time exclusivity checks before approving reseller margins.",
      trigger: "Make.com webhook detects partner reseller deal registrations.",
      outcomes: "Confirm exclusivity and sync margin agreements to Notion databases."
    },
    orchestration: {
      strategicRole: "Chief Strategy Officer (01b) oversees global channel policies and margin frameworks.",
      operationalRole: "Head of Partners (02c) runs deep HubSpot CRM searches to check direct sales overlaps.",
      hitlGateway: "VP of Sales signs off on reseller exclusivity and margin approvals in Slack."
    },
    integrations: [
      { tool: "Make.com Form Hook", purpose: "Captures reseller registration submissions." },
      { tool: "HubSpot Search API", purpose: "Crawl active CRM contacts and open opportunity fields." },
      { tool: "Slack Gateway", purpose: "Handles direct conflict alerts and margin reviews." },
      { tool: "Notion Margin DB", purpose: "Saves approved margins and reseller contracts." }
    ],
    safeguards: {
      boundaries: "Margin limits: Reseller discounts capped at a maximum of 25% ARR.",
      hitlCriteria: "Requires check of email activity to confirm no active direct talks in the last 30 days.",
      timeoutDefaults: "24-hour SLA window. Reverts to safe 'Denied' state upon expiration."
    }
  },
  p20_integration_launch: {
    strategy: {
      hypothesis: "Promoting integration launches through joint search campaigns drives high-intent developer signups.",
      trigger: "Notion document approvals for integration co-marketing launch blueprints.",
      outcomes: "Publish campaigns and sync budgets in Google Ads."
    },
    orchestration: {
      strategicRole: "CMO Agent (01) structures target marketing objectives and content maps.",
      operationalRole: "Head of Partners (02c) audits organic search keywords and volume footprints.",
      hitlGateway: "Marketing VP approves launch budget and search copy in Slack."
    },
    integrations: [
      { tool: "Notion REST API", purpose: "Reads launch documentation via /v1/pages." },
      { tool: "Ahrefs Search API", purpose: "Queries search volume and CPC benchmarks for key phrases." },
      { tool: "Slack Gateway", purpose: "Gates budget allocations and ad copy reviews." },
      { tool: "Google Ads Campaigns", purpose: "Syncs approved campaign ad-groups live." }
    ],
    safeguards: {
      boundaries: "Budget ceilings: Co-marketing ad group initial spend capped at $5,000.",
      hitlCriteria: "Requires check of Google Ads destination URLs to confirm landing page active states.",
      timeoutDefaults: "30-minute approval window. Reverts to safe 'Denied' state upon expiration."
    }
  },
  m1_tam_launch: {
    strategy: {
      hypothesis: "High-value TAM targeting across marketing, sales, and partner motions speeds up enterprise pipeline velocity.",
      trigger: "Notion database approval of strategic 'High-Value TAM List 2026'.",
      outcomes: "Route 500 strategic accounts into active multi-channel marketing campaigns and joint referral pipelines."
    },
    orchestration: {
      strategicRole: "CMO Agent (01) orchestrates dynamic target audience segments, CSO (01b) aligns ecosystem reseller plans, and Market Intel (01d) parses competitor trends.",
      operationalRole: "Head of PLG (02b) analyzes signup telemetry, VP Sales (02a) structures AE mappings, and Content & SEO Lead (03c) drives keyword analysis.",
      hitlGateway: "CMO and RevOps lead authorize marketing budget allocation ($25,000) and approved search/social ad copy drafts in Slack."
    },
    integrations: [
      { tool: "Notion TAM Database", purpose: "Reads and parses primary target lists." },
      { tool: "Ahrefs Search API", purpose: "Audits organic keyword volumes, CPCs, and developer intent footprints." },
      { tool: "LinkedIn & Meta Ads", purpose: "Matches domain audience profiles." },
      { tool: "Slack Approval Gate", purpose: "Gates ad spend budgets and custom copy drafts." },
      { tool: "HubSpot CRM DB", purpose: "Synchronizes dynamic segments and pipeline opportunity attributes." }
    ],
    safeguards: {
      boundaries: "Budget limits: Outbound ad-group launch spend capped at $25,000. CPC limit: $5.00.",
      hitlCriteria: "Requires cross-checking that the target lists are cleared of existing active accounts in HubSpot CRM.",
      timeoutDefaults: "4-hour operator response window. Defaults to 'Paused' state upon expiration."
    }
  },
  m2_account_expansion: {
    strategy: {
      hypothesis: "Ecosystem co-selling maps allow partners to introduce and warm high-value pipeline opportunities.",
      trigger: "PostHog and HubSpot alerts for enterprise account limit usage spillover.",
      outcomes: "Identify mutual partner overlays and launch structured co-selling referral sequences."
    },
    orchestration: {
      strategicRole: "CSO Agent (01b) coordinates high-value expansion targets, GTM Engineer (01c) audits pipeline automation logic.",
      operationalRole: "VP Partnerships (02d) analyzes partner overlay signals, and SDR Manager (03a) performs account profiling.",
      hitlGateway: "CSO and Alliance VP sign off on enterprise referral outreach templates and co-selling commission tiers in Slack."
    },
    integrations: [
      { tool: "Notion Partner Agreements", purpose: "Checks reseller commissions and pricing guidelines." },
      { tool: "Crossbeam Partner Network", purpose: "Evaluates overlapping accounts with AWS and Snowflake." },
      { tool: "Slack Approval Gate", purpose: "Gates referral emails and strategic introduction schedules." },
      { tool: "HubSpot Joint CRM", purpose: "Syncs pipeline targets and joint opportunity attributes." }
    ],
    safeguards: {
      boundaries: "Discount limits: Reseller margin allocations capped at 25% ARR.",
      hitlCriteria: "Confirm no direct sales activity has occurred in the last 30 days via email audits.",
      timeoutDefaults: "12-hour response window. Reverts to safe 'Denied' state on timeout."
    }
  },
  m3_churn_recovery: {
    strategy: {
      hypothesis: "Rapid response to sharp usage drops prevents contract churn and aligns senior engineering debug cycles.",
      trigger: "PostHog usage diagnostic telemetry flags active developer usage drops ≥45% week-over-week.",
      outcomes: "Inject urgent health updates to CRM and dispatch diagnostic recovery playbooks."
    },
    orchestration: {
      strategicRole: "VP Customer Success (04a) monitors NRR targets, GTM Engineer (01c) routes recovery workflows.",
      operationalRole: "VP Sales (02a) audits pricing boundaries, Head of RevOps (03e) evaluates usage changes, CSM Agent (04b) drafts custom interventions.",
      hitlGateway: "CS Director reviews and approves custom product discounts and priority support packages in Slack."
    },
    integrations: [
      { tool: "PostHog Usage Telemetry", purpose: "Parses workspace developer errors and active query drops." },
      { tool: "Clay Scrapers", purpose: "Enriches target tech stack changes and key employee departures." },
      { tool: "Slack CS Gate", purpose: "Gates outbound diagnostic emails and executive battlecard drafts." },
      { tool: "HubSpot CRM DB", purpose: "Records critical account health warning updates." }
    ],
    safeguards: {
      boundaries: "Pricing override boundaries: Custom account discounts capped at 20% ARR.",
      hitlCriteria: "Verify active support tickets have been updated with senior engineering assignments.",
      timeoutDefaults: "1-hour critical response window. Escalates to VP of CS upon expiration."
    }
  },
  m4_quarterly_audit: {
    strategy: {
      hypothesis: "Multi-touch campaign and community attributions ensure accurate ROI tracking and budget allocation.",
      trigger: "Cron scheduler triggers end-of-quarter revenue and campaign attribution audits.",
      outcomes: "Consolidate campaign outcomes and sync final ROI models back to marketing strategies."
    },
    orchestration: {
      strategicRole: "CMO Agent (01) structures target marketing objectives, CSO (01b) audits reseller channel allocations.",
      operationalRole: "Head of Community (02c) reviews Slack sentiment, Demand Gen Manager (03b) aggregates attribution metrics, Head of RevOps (03e) maps lead routing.",
      hitlGateway: "RevOps Lead and CMO authorize final quarterly attribution weighting reports and ROI dashboards in Slack."
    },
    integrations: [
      { tool: "Google Sheets Directory", purpose: "Imports multi-touch campaign lead source variables." },
      { tool: "Clay Attribution Engine", purpose: "Resolves domain attribution logs and corporate entity hierarchies." },
      { tool: "Slack Gate", purpose: "Gates ROI reports and quarterly budget allocation distributions." },
      { tool: "HubSpot CRM DB", purpose: "Finalizes verified revenue and attribution targets." }
    ],
    safeguards: {
      boundaries: "Attribution variance: Discrepancy tolerances capped at ±5% total revenue.",
      hitlCriteria: "Audit lead-source parameters to confirm all fields are fully populated.",
      timeoutDefaults: "24-hour SLA window. Alerts finance lead if review is not processed."
    }
  },
  m5_pql_upsell: {
    strategy: {
      hypothesis: "Bottom-up usage velocity outliers are high-conversion candidates for enterprise sales upgrades.",
      trigger: "PostHog usage alerts for free workspaces exceeding seat counts and query limits.",
      outcomes: "Extract decision-maker committees and handoff qualified accounts to strategic sales pipelines."
    },
    orchestration: {
      strategicRole: "Head of PLG (02b) scores user density velocity, Market Intel Analyst (01d) tracks competitive overlays.",
      operationalRole: "VP Sales (02a) maps account-based routing structures, SDR Manager (03a) maps decision-maker committees.",
      hitlGateway: "Growth Director and VP Sales authorize enterprise trial upgrades and outbound sales sequences in Slack."
    },
    integrations: [
      { tool: "PostHog Usage Telemetry", purpose: "Tracks queries, API limits, and team density velocity." },
      { tool: "Apollo.io REST API", purpose: "Resolves VP-level target emails and phone numbers." },
      { tool: "Slack Sales Gate", purpose: "Gates direct executive outreach plans and account qualification criteria." },
      { tool: "HubSpot CRM DB", purpose: "Syncs high-intent enterprise pipeline opportunities." }
    ],
    safeguards: {
      boundaries: "Trial duration limits: Enterprise trial extensions capped at a maximum of 14 days.",
      hitlCriteria: "Confirm target company matches the ICP threshold criteria (employee headcount ≥100).",
      timeoutDefaults: "8-hour response window. Automatically moves lead to inbound nurture track on timeout."
    }
  }
};
