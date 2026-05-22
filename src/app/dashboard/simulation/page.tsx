"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  MessageSquare,
  FileText,
  Terminal, 
  Check, 
  X, 
  CheckCircle, 
  Database, 
  Network, 
  GitBranch, 
  RefreshCw, 
  Layers, 
  AlertCircle,
  HelpCircle,
  Activity,
  Zap,
  Cpu,
  Mail,
  TrendingUp,
  ZoomIn,
  ZoomOut,
  Maximize
} from "lucide-react";

interface VisualNode {
  id: string;
  label: string;
  type: "trigger" | "agent" | "tool" | "gate" | "db";
  icon: any;
  x: number; // percentage or px
  y: number; // percentage or px
  subText?: string;
}

interface Connection {
  from: string;
  to: string;
  type: "trigger" | "delegate" | "query" | "approve" | "sync";
}

interface Playbook {
  id: string;
  name: string;
  category: "PLG" | "SLG" | "Community" | "Partner";
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

const playbooks: Playbook[] = [
  // --- PLG PLAYBOOKS (P1 to P5) ---
  {
    id: "p1_pql_triage",
    name: "P1: Self-Serve Product Action to PQL Triage",
    category: "PLG",
    description: "PostHog Signup ──► Head of PLG (02b) ──► Notion ICP REST ──► PQL Slack Gate ──► HubSpot",
    nodes: [
      { id: "ph_signup", label: "PostHog Event", type: "trigger", icon: Zap, x: 50, y: 180, subText: "Active Team Signup" },
      { id: "plg_head", label: "Head of PLG (02b)", type: "agent", icon: Cpu, x: 230, y: 180, subText: "Signal Evaluator" },
      { id: "notion_icp", label: "Notion ICP Audit", type: "tool", icon: Network, x: 410, y: 80, subText: "Strategy REST API" },
      { id: "slack_pql_gate", label: "PQL Slack Gate", type: "gate", icon: MessageSquare, x: 590, y: 180, subText: "HITL Qualification" },
      { id: "hubspot_deal", label: "HubSpot CRM", type: "db", icon: Database, x: 770, y: 180, subText: "Sync Qualified Opp" }
    ],
    connections: [
      { from: "ph_signup", to: "plg_head", type: "trigger" },
      { from: "plg_head", to: "notion_icp", type: "query" },
      { from: "notion_icp", to: "slack_pql_gate", type: "approve" },
      { from: "slack_pql_gate", to: "hubspot_deal", type: "sync" }
    ],
    steps: [
      { nodeId: "ph_signup", log: "PostHog Trigger: Workspace cluster registered with 4 signups in 2 hours.", actionType: "think" },
      { nodeId: "plg_head", log: "✉ Head of PLG Agent analyzing product engagement. Querying Notion strategy docs for target ICP.", actionType: "think" },
      { nodeId: "notion_icp", log: "⚙ [Tool Gateway] Invoking Notion REST API /v1/pages to match profile against standard enterprise ICP guidelines.", actionType: "call_tool" },
      { nodeId: "notion_icp", log: "⚡ [Tool Gateway] Notion match successful: Company 'CloudScale' maps to Tier-1 Developer Platform profile.", actionType: "done" },
      { nodeId: "slack_pql_gate", log: "💬 [Slack HITL Gate] Gating qualification. Awaiting product-qualified lead (PQL) sign-off in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Head of PLG (02b)", request: "Approve PQL qualification for 'CloudScale' workspace. Notion match score is 92%." } },
      { nodeId: "hubspot_deal", log: "✔ Operator approved! HubSpot qualified opportunity updated and AE assignment triggered.", actionType: "done" }
    ]
  },
  {
    id: "p2_churn_prevention",
    name: "P2: Self-Serve Product Churn Prevention",
    category: "PLG",
    description: "PostHog Usage Drop ──► VP CS (04a) ──► CSM Agent (04b) ──► Gumloop Scraper ──► Slack Gate ──► HubSpot CRM",
    nodes: [
      { id: "usage_drop", label: "Usage Drop Alert", type: "trigger", icon: Zap, x: 50, y: 180, subText: "PostHog Telemetry" },
      { id: "vp_cs", label: "VP CS (04a)", type: "agent", icon: Cpu, x: 220, y: 180, subText: "Health Overseer" },
      { id: "csm_agent", label: "CSM Agent (04b)", type: "agent", icon: Cpu, x: 390, y: 80, subText: "Retention Lead" },
      { id: "gumloop_diagnose", label: "Gumloop Diagnose", type: "tool", icon: Network, x: 560, y: 280, subText: "REST Scrape Run" },
      { id: "slack_cs_gate", label: "CS Slack Gate", type: "gate", icon: MessageSquare, x: 730, y: 180, subText: "Email Approval" },
      { id: "hubspot_health", label: "HubSpot CRM", type: "db", icon: Database, x: 900, y: 180, subText: "Update Account Health" }
    ],
    connections: [
      { from: "usage_drop", to: "vp_cs", type: "trigger" },
      { from: "vp_cs", to: "csm_agent", type: "delegate" },
      { from: "csm_agent", to: "gumloop_diagnose", type: "query" },
      { from: "gumloop_diagnose", to: "slack_cs_gate", type: "approve" },
      { from: "slack_cs_gate", to: "hubspot_health", type: "sync" }
    ],
    steps: [
      { nodeId: "usage_drop", log: "PostHog Trigger: Product activity for 'Acme Logistics' dropped 35% week-over-week.", actionType: "think" },
      { nodeId: "vp_cs", log: "✉ VP Customer Success recalculating retention scores. Handing off case to CSM Agent (04b).", actionType: "think" },
      { nodeId: "csm_agent", log: "📥 CSM Agent drafting retention outreach. Initiating Gumloop competitive scrape for Acme Logistics.", actionType: "think" },
      { nodeId: "gumloop_diagnose", log: "⚙ [Tool Gateway] Invoking Gumloop API /pipelines/run to scrape recent news and verify competitor hires.", actionType: "call_tool" },
      { nodeId: "gumloop_diagnose", log: "⚡ [Tool Gateway] Gumloop returned scrape data: Company recently integrated a legacy tool; training issue likely.", actionType: "done" },
      { nodeId: "slack_cs_gate", log: "💬 [Slack HITL Gate] Awaiting review of the personalized help and product guides email in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "CSM Agent (04b)", request: "Approve personalized churn-prevention email to Acme Logistics. Gumloop diagnostics show product onboarding friction." } },
      { nodeId: "hubspot_health", log: "✔ Operator approved email delivery! Churn risk score logged and customer health updated in HubSpot CRM.", actionType: "done" }
    ]
  },
  {
    id: "p3_limit_upsell",
    name: "P3: Usage-Based Limit Upsell Warning",
    category: "PLG",
    description: "Gumloop Usage Metric ──► RevOps Lead (03e) ──► PostHog Cohorts ──► Upsell Slack Gate ──► HubSpot Deal",
    nodes: [
      { id: "usage_warning", label: "Limit Warning", type: "trigger", icon: Zap, x: 50, y: 180, subText: "Billing Limit Met" },
      { id: "revops_lead", label: "RevOps Lead (03e)", type: "agent", icon: Cpu, x: 250, y: 180, subText: "Ops Coordinator" },
      { id: "posthog_cohorts", label: "PostHog Check", type: "tool", icon: Network, x: 450, y: 80, subText: "Cohort REST Queries" },
      { id: "slack_upsell_gate", label: "Upsell Slack Gate", type: "gate", icon: MessageSquare, x: 650, y: 180, subText: "Offer Validation" },
      { id: "hubspot_upsell", label: "HubSpot CRM", type: "db", icon: Database, x: 850, y: 180, subText: "Expansion Deal" }
    ],
    connections: [
      { from: "usage_warning", to: "revops_lead", type: "trigger" },
      { from: "revops_lead", to: "posthog_cohorts", type: "query" },
      { from: "posthog_cohorts", to: "slack_upsell_gate", type: "approve" },
      { from: "slack_upsell_gate", to: "hubspot_upsell", type: "sync" }
    ],
    steps: [
      { nodeId: "usage_warning", log: "Gumloop Trigger: 'Nova Corp' exceeded free tier credit allocation (10,500 operations).", actionType: "think" },
      { nodeId: "revops_lead", log: "✉ RevOps Lead Agent reviewing account eligibility. Querying PostHog to audit workspace user density.", actionType: "think" },
      { nodeId: "posthog_cohorts", log: "⚙ [Tool Gateway] Invoking PostHog Query REST API to audit user events and check active cohort status.", actionType: "call_tool" },
      { nodeId: "posthog_cohorts", log: "⚡ [Tool Gateway] PostHog returned: Active workspace has 12 collaborative members, indicating strong enterprise fit.", actionType: "done" },
      { nodeId: "slack_upsell_gate", log: "💬 [Slack HITL Gate] Awaiting authorization of custom enterprise trial extension offer in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "RevOps Lead (03e)", request: "Approve 14-day enterprise trial extension offer for Nova Corp. Current workspace active seats: 12." } },
      { nodeId: "hubspot_upsell", log: "✔ Upsell path approved! HubSpot Expansion opportunity created and reseller/sales alert triggered.", actionType: "done" }
    ]
  },
  {
    id: "p4_onboarding_activation",
    name: "P4: Post-Signup Onboarding Activation",
    category: "PLG",
    description: "PostHog Idle Event ──► Head of PLG (02b) ──► Gumloop Enrich ──► Onboarding Slack Gate ──► HubSpot",
    nodes: [
      { id: "idle_registrant", label: "Idle Registrant", type: "trigger", icon: Zap, x: 50, y: 180, subText: "Inactive Event" },
      { id: "plg_activation", label: "Head of PLG (02b)", type: "agent", icon: Cpu, x: 250, y: 180, subText: "Growth Architect" },
      { id: "gumloop_enrich", label: "Gumloop Scraper", type: "tool", icon: Network, x: 450, y: 80, subText: "Company Context" },
      { id: "slack_activation_gate", label: "CS Onboard Gate", type: "gate", icon: MessageSquare, x: 650, y: 180, subText: "Outreach Approval" },
      { id: "hubspot_email", label: "HubSpot Nurture", type: "db", icon: Database, x: 850, y: 180, subText: "Trigger Campaign" }
    ],
    connections: [
      { from: "idle_registrant", to: "plg_activation", type: "trigger" },
      { from: "plg_activation", to: "gumloop_enrich", type: "query" },
      { from: "gumloop_enrich", to: "slack_activation_gate", type: "approve" },
      { from: "slack_activation_gate", to: "hubspot_email", type: "sync" }
    ],
    steps: [
      { nodeId: "idle_registrant", log: "PostHog Trigger: User signed up 5 days ago but hasn't run their first workflow.", actionType: "think" },
      { nodeId: "plg_activation", log: "✉ Head of PLG mapping reactivation playbook. Setting up Gumloop research scraper to isolate user's industry context.", actionType: "think" },
      { nodeId: "gumloop_enrich", log: "⚙ [Tool Gateway] Invoking Gumloop Scraper API to scan target company homepage and extract developer use cases.", actionType: "call_tool" },
      { nodeId: "gumloop_enrich", log: "⚡ [Tool Gateway] Gumloop completed: Company is 'Fintech Solutions'; key use case is payment compliance.", actionType: "done" },
      { nodeId: "slack_activation_gate", log: "💬 [Slack HITL Gate] Awaiting CSM approval to send targeted compliance onboarding template in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Head of PLG (02b)", request: "Approve compliant onboarding sequence for Fintech Solutions. Target use case: automated financial auditing." } },
      { nodeId: "hubspot_email", log: "✔ Approved! HubSpot transactional nurture sequence initiated with custom compliance SDK guides.", actionType: "done" }
    ]
  },
  {
    id: "p5_team_density",
    name: "P5: Bottom-Up Team Density TAM Expansion",
    category: "PLG",
    description: "PostHog Domain Clusters ──► RevOps Lead (03e) ──► Market Intel Serp ──► Sales Slack Gate ──► HubSpot",
    nodes: [
      { id: "density_alert", label: "Domain Clusters", type: "trigger", icon: Zap, x: 50, y: 180, subText: "Multi-User Signal" },
      { id: "revops_router", label: "RevOps Lead (03e)", type: "agent", icon: Cpu, x: 250, y: 180, subText: "Data Operations" },
      { id: "serp_search", label: "SerpAPI Search", type: "tool", icon: Network, x: 450, y: 80, subText: "Market Intel REST" },
      { id: "slack_abm_gate", label: "Sales Slack Gate", type: "gate", icon: MessageSquare, x: 650, y: 180, subText: "Lead Assignment" },
      { id: "hubspot_expansion", label: "HubSpot CRM", type: "db", icon: Database, x: 850, y: 180, subText: "Expansion Account" }
    ],
    connections: [
      { from: "density_alert", to: "revops_router", type: "trigger" },
      { from: "revops_router", to: "serp_search", type: "query" },
      { from: "serp_search", to: "slack_abm_gate", type: "approve" },
      { from: "slack_abm_gate", to: "hubspot_expansion", type: "sync" }
    ],
    steps: [
      { nodeId: "density_alert", log: "PostHog Trigger: 7 individual free accounts registered from domain 'apex-energy.com'.", actionType: "think" },
      { nodeId: "revops_router", log: "✉ RevOps Lead assessing account consolidation signals. Invoking SerpAPI search to map enterprise headquarters.", actionType: "think" },
      { nodeId: "serp_search", log: "⚙ [Tool Gateway] Invoking Market Intel SerpAPI REST client to query organizational structure and headcount size of Apex Energy.", actionType: "call_tool" },
      { nodeId: "serp_search", log: "⚡ [Tool Gateway] SerpAPI resolved: Headcount 4,500; parent entity is public conglomerate.", actionType: "done" },
      { nodeId: "slack_abm_gate", log: "💬 [Slack HITL Gate] Awaiting Account Director sign-off to consolidate contacts into single Enterprise Account in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "RevOps Lead (03e)", request: "Approve Enterprise consolidation for 'Apex Energy'. Direct signup clusters: 7 seats, estimated TAM $65,000/yr." } },
      { nodeId: "hubspot_expansion", log: "✔ Approved! Accounts combined in HubSpot CRM; outbound intro queued via Apollo for local sales team.", actionType: "done" }
    ]
  },

  // --- SLG PLAYBOOKS (P6 to P10) ---
  {
    id: "p6_abm_outbound",
    name: "P6: ABM Multi-Channel Ads Warming & Outbound",
    category: "SLG",
    description: "HubSpot TAM ──► CMO (01) ──► LinkedIn/Meta Ads ──► Apollo ──► SDR Slack Gate ──► HubSpot Pipeline",
    nodes: [
      { id: "target_tam", label: "High-Value TAM", type: "trigger", icon: Zap, x: 50, y: 180, subText: "HubSpot Segment" },
      { id: "cmo_agent", label: "CMO Agent (01)", type: "agent", icon: Cpu, x: 220, y: 180, subText: "Strategy Director" },
      { id: "linkedin_meta_ads", label: "Ads Matched APIs", type: "tool", icon: Network, x: 390, y: 80, subText: "LinkedIn/Meta Ads" },
      { id: "apollo_enrich", label: "Apollo.io API", type: "tool", icon: Network, x: 560, y: 280, subText: "Contact Enrichment" },
      { id: "slack_sdr_gate", label: "Outbound Gate", type: "gate", icon: MessageSquare, x: 730, y: 180, subText: "Approval Gate" },
      { id: "hubspot_pipeline", label: "HubSpot Pipeline", type: "db", icon: Database, x: 900, y: 180, subText: "Active Deal Created" }
    ],
    connections: [
      { from: "target_tam", to: "cmo_agent", type: "trigger" },
      { from: "cmo_agent", to: "linkedin_meta_ads", type: "query" },
      { from: "linkedin_meta_ads", to: "apollo_enrich", type: "delegate" },
      { from: "apollo_enrich", to: "slack_sdr_gate", type: "approve" },
      { from: "slack_sdr_gate", to: "hubspot_pipeline", type: "sync" }
    ],
    steps: [
      { nodeId: "target_tam", log: "HubSpot Trigger: Target account segment 'Automotive Logistics Tier-1' active with 42 target companies.", actionType: "think" },
      { nodeId: "cmo_agent", log: "✉ CMO Agent designing omnichannel awareness strategy. Initiating matched-audience ads on Meta and LinkedIn.", actionType: "think" },
      { nodeId: "linkedin_meta_ads", log: "⚙ [Tool Gateway] Invoking LinkedIn (/adSegments) & Meta (/customaudiences) REST APIs to load target corporate domains and warm up audiences.", actionType: "call_tool" },
      { nodeId: "linkedin_meta_ads", log: "⚡ [Tool Gateway] Social Ad Networks confirmed: 84% matched company domain rate warmed. Campaign launched.", actionType: "done" },
      { nodeId: "apollo_enrich", log: "⚙ [Tool Gateway] Invoking Apollo.io REST API `/v1/people-match` to extract VP of Supply Chain contact details for targets.", actionType: "call_tool" },
      { nodeId: "apollo_enrich", log: "⚡ [Tool Gateway] Apollo returned 42 contact records with verified direct emails and corporate phones.", actionType: "done" },
      { nodeId: "slack_sdr_gate", log: "💬 [Slack HITL Gate] Awaiting SDR Leader review of warm outbound campaign sequence and template copy in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "CMO Agent (01)", request: "Approve warm outbound enrollment of 42 Tier-1 Supply Chain VPs. LinkedIn and Meta ad-warming campaigns active for 7 days." } },
      { nodeId: "hubspot_pipeline", log: "✔ Outbound sequence authorized! Deals generated in HubSpot CRM and Apollo sequence started.", actionType: "done" }
    ]
  },
  {
    id: "p7_buying_committee",
    name: "P7: B2B Buying Committee Mapping",
    category: "SLG",
    description: "HubSpot Deal Inbound ──► SDR Manager (03a) ──► Apollo Search ──► Committee Slack Gate ──► HubSpot Update",
    nodes: [
      { id: "sf_deal_in", label: "Inbound Deal", type: "trigger", icon: Zap, x: 50, y: 180, subText: "HubSpot Opportunity" },
      { id: "sdr_manager", label: "SDR Manager (03a)", type: "agent", icon: Cpu, x: 250, y: 180, subText: "Outbound Lead" },
      { id: "apollo_search", label: "Apollo REST Check", type: "tool", icon: Network, x: 450, y: 80, subText: "Executive Finder" },
      { id: "slack_map_gate", label: "Committee Gate", type: "gate", icon: MessageSquare, x: 650, y: 180, subText: "Validation Gate" },
      { id: "hubspot_update", label: "HubSpot CRM", type: "db", icon: Database, x: 850, y: 180, subText: "Committee Synced" }
    ],
    connections: [
      { from: "sf_deal_in", to: "sdr_manager", type: "trigger" },
      { from: "sdr_manager", to: "apollo_search", type: "query" },
      { from: "apollo_search", to: "slack_map_gate", type: "approve" },
      { from: "slack_map_gate", to: "hubspot_update", type: "sync" }
    ],
    steps: [
      { nodeId: "sf_deal_in", log: "HubSpot Trigger: Deal 'Stripe - Enterprise Pilot' created with missing contact roles.", actionType: "think" },
      { nodeId: "sdr_manager", log: "✉ SDR Manager Agent mapping the decision hierarchy. Initiating Apollo query for key stakeholders.", actionType: "think" },
      { nodeId: "apollo_search", log: "⚙ [Tool Gateway] Invoking Apollo.io REST `/v1/people-match` seeking VP Finance, Head of Security, and Chief Information Officer.", actionType: "call_tool" },
      { nodeId: "apollo_search", log: "⚡ [Tool Gateway] Apollo returned 3 decision makers (VP Finance, CISO, and CIO) with verified contact details.", actionType: "done" },
      { nodeId: "slack_map_gate", log: "💬 [Slack HITL Gate] Awaiting Account Executive sign-off of the buying committee structure in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "SDR Manager (03a)", request: "Approve B2B buying committee profile mapping for Stripe Enterprise Deal. Stakeholders identified: 3 (CISO, VP Finance, CIO)." } },
      { nodeId: "hubspot_update", log: "✔ Committee approved! HubSpot Opportunity records synced and linked with custom AE contact roles.", actionType: "done" }
    ]
  },
  {
    id: "p8_zoom_prep",
    name: "P8: Discovery Briefing & Zoom Meeting Prep",
    category: "SLG",
    description: "Zoom Calendar Event ──► Market Intel (01d) ──► Clay Webhook Enrichment ──► Briefing Slack Gate ──► Notion Strategy",
    nodes: [
      { id: "zoom_booking", label: "Zoom Calendar", type: "trigger", icon: Zap, x: 50, y: 180, subText: "Calendar Webhook" },
      { id: "market_intel", label: "Market Intel (01d)", type: "agent", icon: Cpu, x: 250, y: 180, subText: "Competitive Analyst" },
      { id: "clay_enrichment", label: "Clay Table Hook", type: "tool", icon: Network, x: 450, y: 80, subText: "Waterfall Webhook" },
      { id: "slack_prep_gate", label: "Briefing Slack Gate", type: "gate", icon: MessageSquare, x: 650, y: 180, subText: "Battlecard Review" },
      { id: "notion_brief", label: "Notion Strategy", type: "db", icon: Database, x: 850, y: 180, subText: "Save Strategy Brief" }
    ],
    connections: [
      { from: "zoom_booking", to: "market_intel", type: "trigger" },
      { from: "market_intel", to: "clay_enrichment", type: "query" },
      { from: "clay_enrichment", to: "slack_prep_gate", type: "approve" },
      { from: "slack_prep_gate", to: "notion_brief", type: "sync" }
    ],
    steps: [
      { nodeId: "zoom_booking", log: "Zoom Trigger: Discovery call booked with 'Quantum AI' (CEO David Miller).", actionType: "think" },
      { nodeId: "market_intel", log: "✉ Market Intel Agent researching target company and competitor footprints. Invoking Clay waterfall enrichment.", actionType: "think" },
      { nodeId: "clay_enrichment", log: "⚙ [Tool Gateway] POSTing lead payload to Clay.com Monitor Webhook URL to trigger waterfall profile enrichments.", actionType: "call_tool" },
      { nodeId: "clay_enrichment", log: "⚡ [Tool Gateway] Clay webhook enrichment success. Company revenue ($85M), funding (Series C), and active tech stack resolved.", actionType: "done" },
      { nodeId: "slack_prep_gate", log: "💬 [Slack HITL Gate] Awaiting AE review of the customized competitor battlecard and prep document in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Market Intel (01d)", request: "Approve discovery briefing package for 'Quantum AI' meeting. Tech stack contains competitor Helix; customized battlecard prepared." } },
      { nodeId: "notion_brief", log: "✔ Approved! Discovery prep brief saved in Notion Strategy database and shared with AE calendar entry.", actionType: "done" }
    ]
  },
  {
    id: "p9_contract_redlining",
    name: "P9: Legal Redlining & Contract Generation",
    category: "SLG",
    description: "HubSpot Stage Shift ──► RevOps Lead (03e) ──► Notion Pricing ──► Legal Slack Gate ──► Gumloop Contract",
    nodes: [
      { id: "hubspot_negotiate", label: "HubSpot Negotiation", type: "trigger", icon: Zap, x: 50, y: 180, subText: "Stage Update" },
      { id: "revops_legal", label: "RevOps Lead (03e)", type: "agent", icon: Cpu, x: 250, y: 180, subText: "Legal Ops Router" },
      { id: "notion_pricing", label: "Notion Strategy", type: "tool", icon: Network, x: 450, y: 80, subText: "Pricing Search" },
      { id: "slack_legal_gate", label: "Legal Slack Gate", type: "gate", icon: MessageSquare, x: 650, y: 180, subText: "Counsel Sign-off" },
      { id: "gumloop_envelope", label: "Gumloop Pipeline", type: "db", icon: Database, x: 850, y: 180, subText: "Contract Generated" }
    ],
    connections: [
      { from: "hubspot_negotiate", to: "revops_legal", type: "trigger" },
      { from: "revops_legal", to: "notion_pricing", type: "query" },
      { from: "notion_pricing", to: "slack_legal_gate", type: "approve" },
      { from: "slack_legal_gate", to: "gumloop_envelope", type: "sync" }
    ],
    steps: [
      { nodeId: "hubspot_negotiate", log: "HubSpot Trigger: Opportunity shifted to 'Contract Negotiation' stage (Value: $120K).", actionType: "think" },
      { nodeId: "revops_legal", log: "✉ RevOps Lead Agent reviewing pricing discount thresholds. Querying Notion pricing database.", actionType: "think" },
      { nodeId: "notion_pricing", log: "⚙ [Tool Gateway] Invoking Notion REST API to verify approved discounting caps and service-level rules.", actionType: "call_tool" },
      { nodeId: "notion_pricing", log: "⚡ [Tool Gateway] Notion returned: 15% discount request within bounds. Clause 4b required for standard pilot support.", actionType: "done" },
      { nodeId: "slack_legal_gate", log: "💬 [Slack HITL Gate] Awaiting General Counsel review and contract draft approval in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "RevOps Lead (03e)", request: "Approve contract redline proposal. Value: $120k/yr, pricing discount: 15%, special Clause 4b (Premium SLA) appended." } },
      { nodeId: "gumloop_envelope", log: "✔ Approved! Gumloop contract generation pipeline completed and PDF envelope pushed for signature.", actionType: "done" }
    ]
  },
  {
    id: "p10_lost_reengage",
    name: "P10: Closed-Lost Re-engagement Prospecting",
    category: "SLG",
    description: "HubSpot Closed-Lost ──► CMO (01) ──► LinkedIn Retarget ──► Re-engage Slack Gate ──► Apollo Sequence",
    nodes: [
      { id: "lost_opportunity", label: "Closed-Lost Deal", type: "trigger", icon: Zap, x: 50, y: 180, subText: "HubSpot Trigger" },
      { id: "cmo_retarget", label: "CMO Agent (01)", type: "agent", icon: Cpu, x: 250, y: 180, subText: "Ad Coordinator" },
      { id: "linkedin_meta_retarget", label: "LinkedIn Retarget", type: "tool", icon: Network, x: 450, y: 80, subText: "API Matched Segment" },
      { id: "slack_reengage_gate", label: "Re-engage Gate", type: "gate", icon: MessageSquare, x: 650, y: 180, subText: "Outreach Approval" },
      { id: "apollo_resequence", label: "Apollo Nurture", type: "db", icon: Database, x: 850, y: 180, subText: "Resequenced CRM" }
    ],
    connections: [
      { from: "lost_opportunity", to: "cmo_retarget", type: "trigger" },
      { from: "cmo_retarget", to: "linkedin_meta_retarget", type: "query" },
      { from: "linkedin_meta_retarget", to: "slack_reengage_gate", type: "approve" },
      { from: "slack_reengage_gate", to: "apollo_resequence", type: "sync" }
    ],
    steps: [
      { nodeId: "lost_opportunity", log: "HubSpot Trigger: Opportunity 'Vanguard Logistics' closed 6 months ago due to 'No Budget'.", actionType: "think" },
      { nodeId: "cmo_retarget", log: "✉ CMO Agent scheduling retargeting campaigns. Exposing account contacts to LinkedIn matched ads.", actionType: "think" },
      { nodeId: "linkedin_meta_retarget", log: "⚙ [Tool Gateway] Invoking LinkedIn Marketing API (/adSegments) to push Vanguard executives to warm retargeting pool.", actionType: "call_tool" },
      { nodeId: "linkedin_meta_retarget", log: "⚡ [Tool Gateway] LinkedIn verified: Target segment activated. Retargeting ads showing custom cost-benefit ROI active.", actionType: "done" },
      { nodeId: "slack_reengage_gate", log: "💬 [Slack HITL Gate] Awaiting Account Director approval to start sales follow-up email campaign in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "CMO Agent (01)", request: "Approve outbound re-engagement for 'Vanguard Logistics'. Target has been warmed via LinkedIn ROI ads for 14 days." } },
      { nodeId: "apollo_resequence", log: "✔ Approved! New contact contacts extracted and Apollo warm nurture re-engagement sequence initiated.", actionType: "done" }
    ]
  },

  // --- COMMUNITY-LED PLAYBOOKS (P11 to P15) ---
  {
    id: "p11_slack_champ",
    name: "P11: Slack Community Signup to Champion",
    category: "Community",
    description: "Slack Member Joining ──► Head of Community ──► LinkedIn REST Search ──► VIP Slack Gate ──► HubSpot Ambassador",
    nodes: [
      { id: "slack_joining", label: "Slack Member In", type: "trigger", icon: Zap, x: 50, y: 180, subText: "New Community User" },
      { id: "community_head", label: "Head of Community", type: "agent", icon: Cpu, x: 250, y: 180, subText: "Advocacy Manager" },
      { id: "linkedin_profiles", label: "LinkedIn Search", type: "tool", icon: Network, x: 450, y: 80, subText: "Profile Lookups" },
      { id: "slack_invite_gate", label: "VIP Slack Gate", type: "gate", icon: MessageSquare, x: 650, y: 180, subText: "Invite Approval" },
      { id: "hubspot_champions", label: "Ambassadors DB", type: "db", icon: Database, x: 850, y: 180, subText: "Champion Directory" }
    ],
    connections: [
      { from: "slack_joining", to: "community_head", type: "trigger" },
      { from: "community_head", to: "linkedin_profiles", type: "query" },
      { from: "linkedin_profiles", to: "slack_invite_gate", type: "approve" },
      { from: "slack_invite_gate", to: "hubspot_champions", type: "sync" }
    ],
    steps: [
      { nodeId: "slack_joining", log: "Slack Trigger: New community registration 'alex_dev99' joined #general-dev.", actionType: "think" },
      { nodeId: "community_head", log: "✉ Head of Community checking user background. Querying LinkedIn search for professional profile matches.", actionType: "think" },
      { nodeId: "linkedin_profiles", log: "⚙ [Tool Gateway] Invoking LinkedIn REST API to resolve 'alex_dev99' to corporate profile 'Alex Mercer' (Principal Architect at Cisco).", actionType: "call_tool" },
      { nodeId: "linkedin_profiles", log: "⚡ [Tool Gateway] LinkedIn profile verified. High-value account fit confirmed.", actionType: "done" },
      { nodeId: "slack_invite_gate", log: "💬 [Slack HITL Gate] Awaiting approval to send VIP Champion Ambassador invite and swag package in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Head of Community", request: "Approve VIP Champion invite to Alex Mercer (Principal Architect, Cisco). Community active signups: 1." } },
      { nodeId: "hubspot_champions", log: "✔ Approved! Invited sent, and ambassador record saved in HubSpot CRM ambassador directory.", actionType: "done" }
    ]
  },
  {
    id: "p12_slack_qa",
    name: "P12: Slack Q&A Technical Support to Lead",
    category: "Community",
    description: "Slack Dev Support ──► Head of Community ──► Notion RAG MCP ──► Clay Check ──► Answer Slack Gate ──► HubSpot",
    nodes: [
      { id: "slack_support", label: "Support Query", type: "trigger", icon: Zap, x: 50, y: 180, subText: "Slack Support Channel" },
      { id: "community_bot", label: "Head of Community", type: "agent", icon: Cpu, x: 220, y: 180, subText: "Technical Liaison" },
      { id: "notion_rag", label: "Notion Strategy", type: "tool", icon: Network, x: 390, y: 80, subText: "RAG Strategy Lookup" },
      { id: "clay_check", label: "Clay Webhook", type: "tool", icon: Network, x: 560, y: 280, subText: "Profile Enrichment" },
      { id: "slack_answer_gate", label: "Answer Slack Gate", type: "gate", icon: MessageSquare, x: 730, y: 180, subText: "Answer Sign-off" },
      { id: "hubspot_oss", label: "HubSpot Lead", type: "db", icon: Database, x: 900, y: 180, subText: "OSS Lead Created" }
    ],
    connections: [
      { from: "slack_support", to: "community_bot", type: "trigger" },
      { from: "community_bot", to: "notion_rag", type: "query" },
      { from: "notion_rag", to: "clay_check", type: "delegate" },
      { from: "clay_check", to: "slack_answer_gate", type: "approve" },
      { from: "slack_answer_gate", to: "hubspot_oss", type: "sync" }
    ],
    steps: [
      { nodeId: "slack_support", log: "Slack Trigger: Community post in #oss-support: 'Does Synapse support custom MCP servers over SSE?'", actionType: "think" },
      { nodeId: "community_bot", log: "✉ Technical Advocate preparing AI-drafted reply. Querying Notion RAG database for product guides.", actionType: "think" },
      { nodeId: "notion_rag", log: "⚙ [Tool Gateway] Invoking Notion Strategy MCP server to extract official technical briefs on SSE endpoint support.", actionType: "call_tool" },
      { nodeId: "notion_rag", log: "⚡ [Tool Gateway] Notion returned detailed architectural guides confirming full SSE protocol support.", actionType: "done" },
      { nodeId: "clay_check", log: "⚙ [Tool Gateway] POSTing user metadata to Clay Monitor Webhook to verify organizational profile and account sizing.", actionType: "call_tool" },
      { nodeId: "clay_check", log: "⚡ [Tool Gateway] Clay returned: User is Lead Architect at 'Helix Tech' (potential enterprise deal).", actionType: "done" },
      { nodeId: "slack_answer_gate", log: "💬 [Slack HITL Gate] Awaiting Developer Advocate approval of the SSE technical answer in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Head of Community", request: "Approve technical SSE response to Helix Tech lead in Slack. Answer generated using Notion RAG docs." } },
      { nodeId: "hubspot_oss", log: "✔ Approved and posted to Slack! Technical lead registered in HubSpot CRM and routed to enterprise SDR.", actionType: "done" }
    ]
  },
  {
    id: "p13_content_promotion",
    name: "P13: Developer Content Promotion Pipeline",
    category: "Community",
    description: "Notion Wiki ──► CMO (01) ──► Gumloop Syndicate ──► Social Slack Gate ──► Google Sheets",
    nodes: [
      { id: "notion_wiki", label: "Notion Strategy", type: "trigger", icon: Zap, x: 50, y: 180, subText: "Content Strategic Wiki" },
      { id: "content_cmo", label: "CMO Agent (01)", type: "agent", icon: Cpu, x: 250, y: 180, subText: "Content Lead" },
      { id: "gumloop_syndicate", label: "Gumloop Run", type: "tool", icon: Network, x: 450, y: 80, subText: "Social Distribution" },
      { id: "slack_social_gate", label: "Social Slack Gate", type: "gate", icon: MessageSquare, x: 650, y: 180, subText: "Copy Review" },
      { id: "sheets_outreach", label: "Google Sheets", type: "db", icon: Database, x: 850, y: 180, subText: "Save Campaign Log" }
    ],
    connections: [
      { from: "notion_wiki", to: "content_cmo", type: "trigger" },
      { from: "content_cmo", to: "gumloop_syndicate", type: "query" },
      { from: "gumloop_syndicate", to: "slack_social_gate", type: "approve" },
      { from: "slack_social_gate", to: "sheets_outreach", type: "sync" }
    ],
    steps: [
      { nodeId: "notion_wiki", log: "Notion Trigger: Technical strategy document 'GTM Observability Guide' shifted to 'Approved'.", actionType: "think" },
      { nodeId: "content_cmo", log: "✉ CMO Agent designing syndication campaign. Deploying Gumloop pipeline to distribute copy drafts.", actionType: "think" },
      { nodeId: "gumloop_syndicate", log: "⚙ [Tool Gateway] Invoking Gumloop API /pipelines/run to rewrite content into Twitter threads, LinkedIn summaries, and Reddit briefs.", actionType: "call_tool" },
      { nodeId: "gumloop_syndicate", log: "⚡ [Tool Gateway] Gumloop returned 3 syndication-ready copy variations with tracking URLs generated.", actionType: "done" },
      { nodeId: "slack_social_gate", log: "💬 [Slack HITL Gate] Awaiting Content Director review of the Twitter thread and LinkedIn copies in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "CMO Agent (01)", request: "Approve developer promotion copies for 'GTM Observability Guide'. Syndicated copy variations: 3." } },
      { nodeId: "sheets_outreach", log: "✔ Approved and shared! Outreach logs saved in Google Sheets and dynamic UTM campaigns tracked in Google Analytics.", actionType: "done" }
    ]
  },
  {
    id: "p14_discord_launch",
    name: "P14: Discord / Slack Community Launch",
    category: "Community",
    description: "Launch Document ──► Head of Community ──► Google Sheets REST ──► Invite Slack Gate ──► Notion Wiki",
    nodes: [
      { id: "ambassador_launch", label: "Ambassador Plan", type: "trigger", icon: Zap, x: 50, y: 180, subText: "Notion Document" },
      { id: "advocacy_lead", label: "Head of Community", type: "agent", icon: Cpu, x: 250, y: 180, subText: "Program Lead" },
      { id: "sheets_cohort", label: "Sheets REST API", type: "tool", icon: Network, x: 450, y: 80, subText: "Cohort Directory" },
      { id: "slack_ambassador_gate", label: "Invite Slack Gate", type: "gate", icon: MessageSquare, x: 650, y: 180, subText: "Ambassador Check" },
      { id: "notion_strategy", label: "Notion Wiki", type: "db", icon: Database, x: 850, y: 180, subText: "Ambassador Database" }
    ],
    connections: [
      { from: "ambassador_launch", to: "advocacy_lead", type: "trigger" },
      { from: "advocacy_lead", to: "sheets_cohort", type: "query" },
      { from: "sheets_cohort", to: "slack_ambassador_gate", type: "approve" },
      { from: "slack_ambassador_gate", to: "notion_strategy", type: "sync" }
    ],
    steps: [
      { nodeId: "ambassador_launch", log: "Notion Trigger: 'Ambassador Cohort Q3' launch strategy finalized.", actionType: "think" },
      { nodeId: "advocacy_lead", log: "✉ Head of Community building registration sheet. Pulling potential ambassador contacts list.", actionType: "think" },
      { nodeId: "sheets_cohort", log: "⚙ [Tool Gateway] Invoking Google Sheets API `/v4/spreadsheets` to read candidate contacts matching high open-source contributions.", actionType: "call_tool" },
      { nodeId: "sheets_cohort", log: "⚡ [Tool Gateway] Google Sheets returned 15 top candidate profiles with Github records.", actionType: "done" },
      { nodeId: "slack_ambassador_gate", log: "💬 [Slack HITL Gate] Awaiting Community VP review of the ambassador launch list in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Head of Community", request: "Approve invitation launch for 15 Q3 developer ambassadors. Candidates extracted from Google Sheets records." } },
      { nodeId: "notion_strategy", log: "✔ Approved! Custom Slack invitations sent and new shared Notion wikis provisioned for active ambassadors.", actionType: "done" }
    ]
  },
  {
    id: "p15_github_contribution",
    name: "P15: Technical PR Contribution Qualified",
    category: "Community",
    description: "Slack PR Alert ──► Head of Community ──► Clay Domains ──► Code Review Gate ──► Zoom Debug",
    nodes: [
      { id: "github_pr", label: "Slack PR Alert", type: "trigger", icon: Zap, x: 50, y: 180, subText: "Github Webhook" },
      { id: "community_liaison", label: "Head of Community", type: "agent", icon: Cpu, x: 250, y: 180, subText: "Dev Relations Lead" },
      { id: "clay_domains", label: "Clay Domains", type: "tool", icon: Network, x: 450, y: 80, subText: "Company Check" },
      { id: "slack_pr_gate", label: "Code Review Gate", type: "gate", icon: MessageSquare, x: 650, y: 180, subText: "Advocate Sign-off" },
      { id: "zoom_debug", label: "Zoom Follow-up", type: "db", icon: Database, x: 850, y: 180, subText: "Book Debug Sync" }
    ],
    connections: [
      { from: "github_pr", to: "community_liaison", type: "trigger" },
      { from: "community_liaison", to: "clay_domains", type: "query" },
      { from: "clay_domains", to: "slack_pr_gate", type: "approve" },
      { from: "slack_pr_gate", to: "zoom_debug", type: "sync" }
    ],
    steps: [
      { nodeId: "github_pr", log: "Slack Trigger: Community PR #402 submitted by developer 'johndoe' to core adapter repository.", actionType: "think" },
      { nodeId: "community_liaison", log: "✉ Developer Advocate evaluating code contribution. Pushing developer domain to Clay webhook to check enterprise alignment.", actionType: "think" },
      { nodeId: "clay_domains", log: "⚙ [Tool Gateway] POSTing PR developer domain to Clay Table Webhook to enrich profile information.", actionType: "call_tool" },
      { nodeId: "clay_domains", log: "⚡ [Tool Gateway] Clay resolved: Developer is Lead Infrastructure Engineer at 'Apex Pay' (current high-value target account).", actionType: "done" },
      { nodeId: "slack_pr_gate", log: "💬 [Slack HITL Gate] Awaiting Head of engineering code review and debug session authorization in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Head of Community", request: "Approve contribution follow-up and Zoom debug call booking with John Doe (Apex Pay). PR #402 addresses core memory adapters." } },
      { nodeId: "zoom_debug", log: "✔ PR approved! Zoom calendar event generated, and custom developer feedback sent directly over Slack.", actionType: "done" }
    ]
  },

  // --- PARTNER-LED PLAYBOOKS (P16 to P20) ---
  {
    id: "p16_coselling_sync",
    name: "P16: Co-Selling Sync & Joint Opportunity",
    category: "Partner",
    description: "Make Webhook ──► Partner Lead ──► Market Intel ──► Notion Partners ──► Intro Slack Gate ──► HubSpot Joint Deal",
    nodes: [
      { id: "make_overlaps", label: "Make Webhook", type: "trigger", icon: Zap, x: 50, y: 180, subText: "On-Demand Trigger" },
      { id: "partner_manager", label: "Head of Partners", type: "agent", icon: Cpu, x: 220, y: 180, subText: "Co-Sell Manager" },
      { id: "market_intel_p", label: "Market Intel REST", type: "tool", icon: Network, x: 390, y: 80, subText: "Competitor Audit" },
      { id: "notion_partners", label: "Notion Strategy", type: "tool", icon: Network, x: 560, y: 280, subText: "Partner Database" },
      { id: "slack_partner_gate", label: "Warm Intro Gate", type: "gate", icon: MessageSquare, x: 730, y: 180, subText: "Intro Sign-off" },
      { id: "hubspot_deal_p", label: "HubSpot CRM", type: "db", icon: Database, x: 900, y: 180, subText: "Joint Opportunity" }
    ],
    connections: [
      { from: "make_overlaps", to: "partner_manager", type: "trigger" },
      { from: "partner_manager", to: "market_intel_p", type: "query" },
      { from: "market_intel_p", to: "notion_partners", type: "delegate" },
      { from: "notion_partners", to: "slack_partner_gate", type: "approve" },
      { from: "slack_partner_gate", to: "hubspot_deal_p", type: "sync" }
    ],
    steps: [
      { nodeId: "make_overlaps", log: "Make.com Trigger: Crossbeam overlap sync webhook triggered 14 co-selling account overlaps.", actionType: "think" },
      { nodeId: "partner_manager", log: "✉ Partnerships Lead auditing deal candidates. Querying competitor footprint via Google Search tool.", actionType: "think" },
      { nodeId: "market_intel_p", log: "⚙ [Tool Gateway] Invoking SerpAPI search client to verify target brand technology footprint and partner connections.", actionType: "call_tool" },
      { nodeId: "market_intel_p", log: "⚡ [Tool Gateway] Competitor footprints analyzed: Target is actively using legacy partners; warm introduction viable.", actionType: "done" },
      { nodeId: "notion_partners", log: "⚙ [Tool Gateway] Querying Notion REST database for reseller agreements and margin tiers of matching systems integrator.", actionType: "call_tool" },
      { nodeId: "notion_partners", log: "⚡ [Tool Gateway] Notion returned: Partner is Tier-1 reseller; eligible for 20% co-sell referral fee.", actionType: "done" },
      { nodeId: "slack_partner_gate", log: "💬 [Slack HITL Gate] Awaiting Alliance VP approval to initiate warm partner introduction sequence in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Head of Partnerships", request: "Approve warm referral request to partner Tier-1 Reseller for 14 joint account overlaps. Est. combined pipeline: $180,000." } },
      { nodeId: "hubspot_deal_p", log: "✔ Warm introduction approved! Joint opportunity records registered in HubSpot CRM, and reseller slack channel pinged.", actionType: "done" }
    ]
  },
  {
    id: "p17_ecosystem_plan",
    name: "P17: Ecosystem Account Plan Orchestration",
    category: "Partner",
    description: "HubSpot Target Co-Sell ──► Head of Partners ──► Ahrefs SEO REST ──► Plan Slack Gate ──► Notion Joint Strategy",
    nodes: [
      { id: "joint_candidate", label: "HubSpot Co-Sell", type: "trigger", icon: Zap, x: 50, y: 180, subText: "HubSpot Deal Candidate" },
      { id: "alliance_ops", label: "Head of Partners", type: "agent", icon: Cpu, x: 250, y: 180, subText: "Ecosystem Manager" },
      { id: "ahrefs_seo", label: "Ahrefs SEO API", type: "tool", icon: Network, x: 450, y: 80, subText: "Backlink Overlaps" },
      { id: "slack_plan_gate", label: "Plan Review Gate", type: "gate", icon: MessageSquare, x: 650, y: 180, subText: "Strategy Review" },
      { id: "notion_strategy_p", label: "Notion Strategy", type: "db", icon: Database, x: 850, y: 180, subText: "Save Joint Plan" }
    ],
    connections: [
      { from: "joint_candidate", to: "alliance_ops", type: "trigger" },
      { from: "alliance_ops", to: "ahrefs_seo", type: "query" },
      { from: "ahrefs_seo", to: "slack_plan_gate", type: "approve" },
      { from: "slack_plan_gate", to: "notion_strategy_p", type: "sync" }
    ],
    steps: [
      { nodeId: "joint_candidate", log: "HubSpot Trigger: Co-marketing candidate account 'Stripe' approved for ecosystem mapping.", actionType: "think" },
      { nodeId: "alliance_ops", log: "✉ Alliance Lead building target campaign plan. Invoking Ahrefs backlinks tool to analyze SEO overlapping authority.", actionType: "think" },
      { nodeId: "ahrefs_seo", log: "⚙ [Tool Gateway] Invoking Ahrefs REST API to crawl backlinks overlap and target keywords between company and Stripe.", actionType: "call_tool" },
      { nodeId: "ahrefs_seo", log: "⚡ [Tool Gateway] Ahrefs resolved: High backlink overlap found on terms 'payment orchestrations' and 'AI agent billing'.", actionType: "done" },
      { nodeId: "slack_plan_gate", log: "💬 [Slack HITL Gate] Awaiting Partner Marketing Director approval of the joint SEO content draft and budget in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Head of Partnerships", request: "Approve joint SEO account plan with Stripe. Targeted keywords: B2B payment orchestration, AI billing. Est. traffic boost: +45%." } },
      { nodeId: "notion_strategy_p", log: "✔ Ecosystem plan approved! Strategic blueprint written to Notion Joint Strategy repository and shared with Stripe marketing leads.", actionType: "done" }
    ]
  },
  {
    id: "p18_directory_routing",
    name: "P18: AppExchange Directory Listing Routing",
    category: "Partner",
    description: "Make.com Webhook ──► RevOps Lead (03e) ──► Clay Enrichment ──► Route Slack Gate ──► HubSpot Sync",
    nodes: [
      { id: "make_webhook", label: "Make Webhook", type: "trigger", icon: Zap, x: 50, y: 180, subText: "On-Demand Directory" },
      { id: "revops_router_p", label: "RevOps Lead (03e)", type: "agent", icon: Cpu, x: 250, y: 180, subText: "Distribution Lead" },
      { id: "clay_enrichment_p", label: "Clay Table Hook", type: "tool", icon: Network, x: 450, y: 80, subText: "Lead Waterfall" },
      { id: "slack_routing_gate", label: "Route Slack Gate", type: "gate", icon: MessageSquare, x: 650, y: 180, subText: "Partner Assignment" },
      { id: "hubspot_sync_p", label: "HubSpot CRM", type: "db", icon: Database, x: 850, y: 180, subText: "Partner Registered" }
    ],
    connections: [
      { from: "make_webhook", to: "revops_router_p", type: "trigger" },
      { from: "revops_router_p", to: "clay_enrichment_p", type: "query" },
      { from: "clay_enrichment_p", to: "slack_routing_gate", type: "approve" },
      { from: "slack_routing_gate", to: "hubspot_sync_p", type: "sync" }
    ],
    steps: [
      { nodeId: "make_webhook", log: "Make.com Trigger: Salesforce AppExchange installation webhook received from 'Beta Corp' (100+ seats).", actionType: "think" },
      { nodeId: "revops_router_p", log: "✉ RevOps Lead assessing installation scale. Invoking Clay enrichment waterfall to extract local corporate data.", actionType: "think" },
      { nodeId: "clay_enrichment_p", log: "⚙ [Tool Gateway] POSTing Beta Corp metadata to Clay Monitor Webhook URL to verify local resellers.", actionType: "call_tool" },
      { nodeId: "clay_enrichment_p", log: "⚡ [Tool Gateway] Clay resolved: Beta Corp headquarters in Munich, Germany; falls under Central European reseller.", actionType: "done" },
      { nodeId: "slack_routing_gate", log: "💬 [Slack HITL Gate] Awaiting Alliance Manager approval to route deal lead to reseller partner 'Munich Consult' in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "RevOps Lead (03e)", request: "Approve routing of Beta Corp lead (100+ seats, Munich) to Munich Consult reseller. Target geographic fit: 100%." } },
      { nodeId: "hubspot_sync_p", log: "✔ Routing approved! Deal successfully registered in HubSpot and Reseller Slack integration alert dispatched.", actionType: "done" }
    ]
  },
  {
    id: "p19_deal_conflict",
    name: "P19: Reseller Deal Conflict Check",
    category: "Partner",
    description: "Make Reseller Hook ──► Head of Partners ──► HubSpot Search ──► Exclusivity Slack Gate ──► Notion Pricing",
    nodes: [
      { id: "make_reseller", label: "Make Webhook", type: "trigger", icon: Zap, x: 50, y: 180, subText: "Reseller Inbound" },
      { id: "channel_director", label: "Head of Partners", type: "agent", icon: Cpu, x: 250, y: 180, subText: "Conflict Evaluator" },
      { id: "hubspot_conflicts", label: "HubSpot REST API", type: "tool", icon: Network, x: 450, y: 80, subText: "Conflict Check" },
      { id: "slack_desk_gate", label: "Exclusivity Gate", type: "gate", icon: MessageSquare, x: 650, y: 180, subText: "Margin Approval" },
      { id: "notion_pricing_p", label: "Notion Strategy", type: "db", icon: Database, x: 850, y: 180, subText: "Margin Approved" }
    ],
    connections: [
      { from: "make_reseller", to: "channel_director", type: "trigger" },
      { from: "channel_director", to: "hubspot_conflicts", type: "query" },
      { from: "hubspot_conflicts", to: "slack_desk_gate", type: "approve" },
      { from: "slack_desk_gate", to: "notion_pricing_p", type: "sync" }
    ],
    steps: [
      { nodeId: "make_reseller", log: "Make.com Trigger: Reseller submission webhook registered deal for 'Omega Logistics' by reseller 'Aero Partners'.", actionType: "think" },
      { nodeId: "channel_director", log: "✉ Partnerships Director checking potential direct sales channel collisions. Invoking CRM search REST API.", actionType: "think" },
      { nodeId: "hubspot_conflicts", log: "⚙ [Tool Gateway] Invoking HubSpot REST API /crm/v3/objects/contacts/search to query direct sales pipelines for Omega Logistics.", actionType: "call_tool" },
      { nodeId: "hubspot_conflicts", log: "⚡ [Tool Gateway] HubSpot CRM returned: Direct deal pipeline empty. No internal deal collisions detected.", actionType: "done" },
      { nodeId: "slack_desk_gate", log: "💬 [Slack HITL Gate] Awaiting Alliance VP approval to authorize Aero Partners reseller exclusivity and 25% margin in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "Head of Partnerships", request: "Approve 25% dealer margin exclusivity for Aero Partners on 'Omega Logistics' deal. Direct conflict query: Clear." } },
      { nodeId: "notion_pricing_p", log: "✔ Conflict check clear! Deal approved in HubSpot, and reseller tier updates committed to Notion strategy files.", actionType: "done" }
    ]
  },
  {
    id: "p20_integration_launch",
    name: "P20: Ecosystem Integration Co-Marketing",
    category: "Partner",
    description: "Notion strategy ──► CMO (01) ──► Ahrefs REST API ──► Launch Slack Gate ──► Google Ads live",
    nodes: [
      { id: "api_launch", label: "Notion Strategic", type: "trigger", icon: Zap, x: 50, y: 180, subText: "Notion Launch Guide" },
      { id: "cmo_marketer", label: "CMO Agent (01)", type: "agent", icon: Cpu, x: 250, y: 180, subText: "Campaign Planner" },
      { id: "ahrefs_backlinks", label: "Ahrefs API", type: "tool", icon: Network, x: 450, y: 80, subText: "SEO Brand Audit" },
      { id: "slack_launch_gate", label: "Launch Copy Gate", type: "gate", icon: MessageSquare, x: 650, y: 180, subText: "Budget Approval" },
      { id: "google_ads_p", label: "Google Ads", type: "db", icon: Database, x: 850, y: 180, subText: "Campaign Live" }
    ],
    connections: [
      { from: "api_launch", to: "cmo_marketer", type: "trigger" },
      { from: "cmo_marketer", to: "ahrefs_backlinks", type: "query" },
      { from: "ahrefs_backlinks", to: "slack_launch_gate", type: "approve" },
      { from: "slack_launch_gate", to: "google_ads_p", type: "sync" }
    ],
    steps: [
      { nodeId: "api_launch", log: "Notion Trigger: Ecosystem integration launch document 'Slack Integration v2' set to 'Ready for Promotion'.", actionType: "think" },
      { nodeId: "cmo_marketer", log: "✉ CMO Agent drafting multi-channel launch budget. Querying Ahrefs search metrics for partner intent keywords.", actionType: "think" },
      { nodeId: "ahrefs_backlinks", log: "⚙ [Tool Gateway] Invoking Ahrefs REST API to crawl top partner search queries and organic volumes.", actionType: "call_tool" },
      { nodeId: "ahrefs_backlinks", log: "⚡ [Tool Gateway] Ahrefs resolved: High monthly search volume for term 'Slack notifications for CRM' (12,000/mo).", actionType: "done" },
      { nodeId: "slack_launch_gate", log: "💬 [Slack HITL Gate] Awaiting CMO budget and ad-group allocation approval in #gtm-hitl-approvals...", actionType: "hitl", hitlDetails: { agent: "CMO Agent (01)", request: "Approve $5,000 launch budget for Google search ads on keyword 'Slack CRM integration v2'. Ahrefs SEO potential: High." } },
      { nodeId: "google_ads_p", log: "✔ Approved! Google Ads API updated, joint co-marketing campaign live, and partner press release published.", actionType: "done" }
    ]
  }
];

export default function SimulationPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook>(playbooks[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [currentNodeGlow, setCurrentNodeGlow] = useState<string | null>(null);
  const [awaitingApproval, setAwaitingApproval] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Whiteboard Zoom & Pan State
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.0);
  const [isPanning, setIsPanning] = useState(false);
  
  const panStartRef = useRef({ x: 0, y: 0 });
  const canvasPanelRef = useRef<HTMLDivElement>(null);

  // Mouse & Touch Whiteboard Drag / Panning Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Avoid panning if interacting with buttons, links, or node cards
    const target = e.target as HTMLElement;
    if (target.closest(".node-card") || target.closest("button") || target.closest("a") || target.closest(".slack-card")) {
      return;
    }
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    const newX = e.clientX - panStartRef.current.x;
    const newY = e.clientY - panStartRef.current.y;
    setPan({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
  };

  // Touch device panning support
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest(".node-card") || target.closest("button") || target.closest("a") || target.closest(".slack-card")) {
      return;
    }
    if (e.touches.length === 1) {
      setIsPanning(true);
      const touch = e.touches[0];
      panStartRef.current = { x: touch.clientX - pan.x, y: touch.clientY - pan.y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const newX = touch.clientX - panStartRef.current.x;
      const newY = touch.clientY - panStartRef.current.y;
      setPan({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
  };

  // Zoom HUD triggers
  const zoomIn = () => {
    setZoom(prev => Math.min(parseFloat((prev + 0.1).toFixed(2)), 1.8));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(parseFloat((prev - 0.1).toFixed(2)), 0.5));
  };

  const resetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  // Dynamic non-passive wheel listener to prevent body scroll while zooming
  useEffect(() => {
    const canvas = canvasPanelRef.current;
    if (!canvas) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = 0.04;
      let newZoom = zoom;
      if (e.deltaY < 0) {
        newZoom = Math.min(zoom + zoomFactor, 1.8);
      } else {
        newZoom = Math.max(zoom - zoomFactor, 0.5);
      }
      setZoom(parseFloat(newZoom.toFixed(2)));
    };

    canvas.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => {
      canvas.removeEventListener("wheel", handleNativeWheel);
    };
  }, [zoom]);

  // Auto scroll console to bottom
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [consoleLogs]);

  // Reset simulation when changing playbooks
  const handlePlaybookChange = (pb: Playbook) => {
    if (isRunning) return;
    setSelectedPlaybook(pb);
    setCurrentStepIndex(-1);
    setConsoleLogs([`Playbook '${pb.name}' selected. Ready for simulation.`]);
    setCurrentNodeGlow(null);
    setAwaitingApproval(false);
  };

  const handleCategoryChange = (cat: string) => {
    if (isRunning) return;
    setActiveCategory(cat);
    
    // Auto-select the first playbook in the filtered list
    const filtered = cat === "ALL" 
      ? playbooks 
      : playbooks.filter(pb => pb.category === cat);
    if (filtered.length > 0) {
      setSelectedPlaybook(filtered[0]);
      setCurrentStepIndex(-1);
      setConsoleLogs([`Category [${cat}] selected. Playbook '${filtered[0].name}' set as active.`]);
      setCurrentNodeGlow(null);
      setAwaitingApproval(false);
    }
  };

  const triggerSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStepIndex(0);
    setConsoleLogs([`Initializing Playbook Pipeline: ${selectedPlaybook.name}...`]);
    setAwaitingApproval(false);
  };

  useEffect(() => {
    if (!isRunning || currentStepIndex < 0) return;

    const currentStep = selectedPlaybook.steps[currentStepIndex];
    if (!currentStep) {
      // Completed!
      setConsoleLogs(prev => [...prev, "✔ Playbook Pipeline completed successfully."]);
      setIsRunning(false);
      setCurrentNodeGlow(null);
      return;
    }

    setCurrentNodeGlow(currentStep.nodeId);
    
    // Log write delay
    const timer = setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[${currentStep.nodeId.toUpperCase()}] ${currentStep.log}`]);
      
      if (currentStep.actionType === "hitl") {
        setAwaitingApproval(true);
      } else {
        // Proceed automatically
        setCurrentStepIndex(prev => prev + 1);
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [isRunning, currentStepIndex, selectedPlaybook]);

  const handleSlackApprove = () => {
    setAwaitingApproval(false);
    setConsoleLogs(prev => [...prev, "💬 [OPERATOR Slack Approval Received] - GTM Motion resumed by admin action."]);
    setCurrentStepIndex(prev => prev + 1);
  };

  const handleSlackDeny = () => {
    setAwaitingApproval(false);
    setConsoleLogs(prev => [...prev, "❌ [OPERATOR Slack Rejected] - Pipeline execution cancelled by operator."]);
    setIsRunning(false);
    setCurrentNodeGlow(null);
  };

  // Helper to draw visual connection paths reactively
  const getPathCoords = (fromNodeId: string, toNodeId: string) => {
    const fromNode = selectedPlaybook.nodes.find(n => n.id === fromNodeId);
    const toNode = selectedPlaybook.nodes.find(n => n.id === toNodeId);
    if (!fromNode || !toNode) return "";

    // Nodes are in a grid with coords: fromNode.x and fromNode.y relative positions
    // Node width/height is ~160px x 68px.
    // Connect center right of 'from' to center left of 'to'
    const x1 = fromNode.x + 80;
    const y1 = fromNode.y + 34;
    const x2 = toNode.x + 80;
    const y2 = toNode.y + 34;

    // Curved Bezier horizontal connection
    const dx = Math.abs(x2 - x1) * 0.5;
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  };

  return (
    <div className="simulator-container">
      {/* Header */}
      <header className="header-row">
        <div>
          <h1 className="title-glow">GTM Flow Simulator</h1>
          <p className="subtitle">Interactive visual multi-agent workflow testing canvas (n8n & Make-style).</p>
        </div>
        <div className="status-badge">
          <Activity size={14} className="active-icon" />
          <span>Interactive Sandbox</span>
        </div>
      </header>

      {/* Main Grid */}
      <div className="simulator-grid">
        {/* Left Side: Playbooks & triggers */}
        <section className="side-panel glass-panel">
          <div className="section-header">
            <h3>Active Playbooks</h3>
            <p>Select a playbook flow below to simulate</p>
          </div>

          {/* Horizontal tab pill selectors */}
          <div className="category-tabs">
            {["ALL", "PLG", "SLG", "Community", "Partner"].map(cat => (
              <button
                key={cat}
                className={`category-tab ${activeCategory === cat ? "active" : ""}`}
                onClick={() => handleCategoryChange(cat)}
                disabled={isRunning}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="playbook-list">
            {playbooks
              .filter(pb => activeCategory === "ALL" || pb.category === activeCategory)
              .map(pb => (
                <button 
                  key={pb.id}
                  className={`playbook-btn ${selectedPlaybook.id === pb.id ? "active" : ""}`}
                  onClick={() => handlePlaybookChange(pb)}
                  disabled={isRunning}
                >
                  <strong>{pb.name}</strong>
                  <p>{pb.description.slice(0, 75)}...</p>
                </button>
              ))}
          </div>

          <div className="trigger-container">
            <button 
              className={`trigger-action-btn ${isRunning ? 'running' : ''}`}
              onClick={triggerSimulation}
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <RefreshCw size={16} className="spin-icon" /> Running Simulation...
                </>
              ) : (
                <>
                  <Play size={16} fill="currentColor" /> Trigger GTM Playbook
                </>
              )}
            </button>
          </div>
        </section>

        {/* Center: Node Canvas */}
        <section 
          ref={canvasPanelRef}
          className={`canvas-panel glass-panel ${isPanning ? 'panning' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="canvas-grid-bg"></div>
          
          {/* Whiteboard HUD controls overlay */}
          <div className="canvas-hud">
            <button className="hud-btn" onClick={zoomOut} title="Zoom Out" aria-label="Zoom Out">
              <ZoomOut size={14} />
            </button>
            <span className="hud-scale">{Math.round(zoom * 100)}%</span>
            <button className="hud-btn" onClick={zoomIn} title="Zoom In" aria-label="Zoom In">
              <ZoomIn size={14} />
            </button>
            <div className="hud-divider"></div>
            <button className="hud-btn reset" onClick={resetView} title="Recenter View" aria-label="Recenter View">
              <Maximize size={14} />
            </button>
          </div>

          <div 
            className="canvas-wrapper"
            style={{ 
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              transformOrigin: "500px 200px",
              transition: isPanning ? "none" : "transform 0.15s cubic-bezier(0.1, 0.8, 0.25, 1)"
            }}
          >
            {/* SVG Connections overlay behind nodes */}
            <svg className="connections-svg" width="1000" height="400">
              <defs>
                <linearGradient id="grad-trigger" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#fca5a5" />
                </linearGradient>
                <linearGradient id="grad-delegate" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c7d2fe" />
                </linearGradient>
                <linearGradient id="grad-query" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#93c5fd" />
                </linearGradient>
                <linearGradient id="grad-approve" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fde68a" />
                </linearGradient>
                <linearGradient id="grad-sync" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#6ee7b7" />
                </linearGradient>
              </defs>
              {selectedPlaybook.connections.map((c, i) => {
                const isPathActive = isRunning && 
                  selectedPlaybook.steps.findIndex(s => s.nodeId === c.from) <= currentStepIndex && 
                  selectedPlaybook.steps.findIndex(s => s.nodeId === c.to) <= currentStepIndex &&
                  currentStepIndex !== -1;
                
                const gradientId = `grad-${c.type || 'delegate'}`;

                return (
                  <g key={i}>
                    {/* Background path line */}
                    <path 
                      d={getPathCoords(c.from, c.to)}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.05)"
                      strokeWidth="3"
                    />
                    {/* Glowing active path line */}
                    {isPathActive && (
                      <path 
                        d={getPathCoords(c.from, c.to)}
                        fill="none"
                        stroke={`url(#${gradientId})`}
                        strokeWidth="3"
                        className="active-connector-pulse"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Render Nodes absolute positioned */}
            {selectedPlaybook.nodes.map(node => {
              const IconComponent = node.icon;
              const isGlow = currentNodeGlow === node.id;
              const isStepDone = isRunning && 
                selectedPlaybook.steps.findIndex(s => s.nodeId === node.id) < currentStepIndex &&
                currentStepIndex !== -1;
              
              let typeClass = "";
              if (node.type === "trigger") typeClass = "node-trigger";
              if (node.type === "agent") typeClass = "node-agent";
              if (node.type === "tool") typeClass = "node-tool";
              if (node.type === "gate") typeClass = "node-gate";
              if (node.type === "db") typeClass = "node-db";

              return (
                <div 
                  key={node.id}
                  className={`node-card ${typeClass} ${isGlow ? 'glow' : ''} ${isStepDone ? 'done' : ''}`}
                  style={{ left: node.x, top: node.y }}
                >
                  <div className="node-icon-wrap">
                    <IconComponent size={16} />
                  </div>
                  <div className="node-content">
                    <span className="node-lbl">{node.label}</span>
                    <span className="node-sub">{node.subText}</span>
                  </div>
                  {isGlow && <span className="node-active-pulse"></span>}
                  {isStepDone && <span className="node-check-done">✓</span>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Side: Execution Console / Slack HITL card */}
        <section className="console-panel glass-panel">
          <div className="section-header">
            <div className="flex-align">
              <Terminal size={14} className="console-header-icon" />
              <h3>System Execution Logs</h3>
            </div>
            <span className="console-status-label">{isRunning ? "EXECUTION RUNNING" : "STANDBY"}</span>
          </div>

          <div className="console-logs-container">
            {consoleLogs.map((log, i) => {
              const isAgentToAgent = log.includes("✉") || log.includes("received") || log.includes("delegating") || log.includes("handover") || log.includes("handshake");
              const isTool = log.includes("[Tool Gateway]") || log.includes("API") || log.includes("invoking") || log.includes("POSTing");
              const isSuccess = log.includes("✔") || log.includes("completed successfully") || log.includes("LIVE") || log.includes("live") || log.includes("active") || log.includes("posted");
              let logClass = "console-log-line";
              if (isAgentToAgent) logClass += " log-agent-to-agent";
              else if (isTool) logClass += " log-tool-call";
              else if (isSuccess) logClass += " log-success";

              return (
                <div key={i} className={logClass}>
                  <span className="line-prefix">▶</span> {log}
                </div>
              );
            })}
            <div ref={consoleEndRef} />
          </div>

          {/* Interactive Slack human approval Gate overlay */}
          {awaitingApproval && (
            <div id="gtm-hitl-approvals" className="slack-approval-overlay animated-fade">
              <div className="slack-card">
                <div className="slack-card-header">
                  <div className="slack-team">
                    <MessageSquare className="slack-logo" size={16} />
                    <span>Slack Gate: <strong>#gtm-hitl-approvals</strong></span>
                  </div>
                  <span className="slack-alert-badge">Action Gated</span>
                </div>
                <div className="slack-card-body">
                  <p className="slack-warn"><strong>{selectedPlaybook.steps[currentStepIndex]?.hitlDetails?.agent || "Agent Requesting Action"}:</strong></p>
                  <p className="slack-desc">"{selectedPlaybook.steps[currentStepIndex]?.hitlDetails?.request || selectedPlaybook.steps[currentStepIndex]?.log}"</p>
                </div>
                <div className="slack-card-footer">
                  <button className="slack-action-btn reject" onClick={handleSlackDeny}>
                    <X size={14} /> Reject Execution
                  </button>
                  <button className="slack-action-btn approve" onClick={handleSlackApprove}>
                    <Check size={14} /> Approve Action
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        .simulator-container {
          padding-bottom: 80px;
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animated-fade {
          animation: fadeIn 0.25s ease-out;
        }
        .title-glow {
          margin: 0;
          font-size: 1.85rem;
          font-weight: 600;
          letter-spacing: -0.025em;
          background: linear-gradient(to right, #ffffff, #a1a1aa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtitle {
          margin: 0.35rem 0 0 0;
          color: #a1a1aa;
          font-size: 0.875rem;
        }
        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 1.5rem;
        }
        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
          padding: 0.45rem 1rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }
        .active-icon {
          animation: pulse-glow 2s infinite;
        }
        @keyframes pulse-glow {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }

        .simulator-grid {
          display: grid;
          grid-template-columns: 280px 1fr 340px;
          gap: 1.25rem;
          min-height: 520px;
        }
        .glass-panel {
          background: rgba(30, 30, 36, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.25rem;
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
        }
        .section-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          padding-bottom: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .section-header h3 {
          margin: 0;
          font-size: 0.9rem;
          color: #f4f4f5;
          font-weight: 600;
        }
        .section-header p {
          margin: 0.2rem 0 0 0;
          font-size: 0.7rem;
          color: #71717a;
        }

        /* HORIZONTAL PILL TABS */
        .category-tabs {
          display: flex;
          gap: 0.35rem;
          margin-bottom: 1rem;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          padding: 0.25rem;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .category-tabs::-webkit-scrollbar {
          display: none;
        }
        .category-tab {
          flex: 1;
          background: transparent;
          border: none;
          color: #71717a;
          padding: 0.35rem 0.5rem;
          font-size: 0.68rem;
          font-weight: 600;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          text-align: center;
        }
        .category-tab:hover {
          color: #e4e4e7;
          background: rgba(255, 255, 255, 0.03);
        }
        .category-tab.active {
          color: #ffffff;
          background: rgba(99, 102, 241, 0.2);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        .category-tab:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* PLAYBOOKS LIST */
        .playbook-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
          overflow-y: auto;
          max-height: 380px;
          scrollbar-width: thin;
        }
        .playbook-btn {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.25s;
          width: 100%;
        }
        .playbook-btn:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.06);
        }
        .playbook-btn.active {
          background: rgba(99, 102, 241, 0.08);
          border-color: rgba(99, 102, 241, 0.25);
        }
        .playbook-btn strong {
          display: block;
          font-size: 0.78rem;
          color: #e4e4e7;
          margin-bottom: 0.15rem;
        }
        .playbook-btn p {
          margin: 0;
          font-size: 0.65rem;
          color: #71717a;
          line-height: 1.35;
        }
        .playbook-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .trigger-container {
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          padding-top: 1rem;
          margin-top: 1rem;
        }
        .trigger-action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          border: 1px solid rgba(99, 102, 241, 0.4);
          color: #ffffff;
          border-radius: 10px;
          padding: 0.75rem;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25);
        }
        .trigger-action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
        }
        .trigger-action-btn:disabled {
          opacity: 0.5;
          transform: none;
          box-shadow: none;
          cursor: not-allowed;
        }
        .spin-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* CANVAS PANEL & WHITEBOARD CANVAS */
        .canvas-panel {
          flex: 1;
          position: relative;
          min-height: 480px;
          overflow: hidden;
          background: rgba(18, 18, 22, 0.6);
          cursor: grab;
          user-select: none;
        }
        .canvas-panel.panning {
          cursor: grabbing;
        }
        .canvas-grid-bg {
          position: absolute;
          inset: 0;
          background-size: 24px 24px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          pointer-events: none;
        }
        .canvas-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          will-change: transform;
        }
        
        /* Glassmorphic Whiteboard HUD */
        .canvas-hud {
          position: absolute;
          bottom: 1.25rem;
          right: 1.25rem;
          display: flex;
          align-items: center;
          background: rgba(30, 30, 36, 0.75);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 0.35rem;
          z-index: 50;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          pointer-events: auto;
        }
        .hud-btn {
          background: transparent;
          border: none;
          color: #a1a1aa;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .hud-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }
        .hud-btn.reset:hover {
          background: rgba(99, 102, 241, 0.15);
          color: #a5b4fc;
        }
        .hud-scale {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 600;
          color: #e4e4e7;
          min-width: 44px;
          text-align: center;
          user-select: none;
        }
        .hud-divider {
          width: 1px;
          height: 16px;
          background: rgba(255, 255, 255, 0.08);
          margin: 0 0.25rem;
        }
        .connections-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        .active-connector-pulse {
          stroke-dasharray: 6, 6;
          animation: dash-pulse 20s linear infinite;
        }
        @keyframes dash-pulse {
          from { stroke-dashoffset: 500; }
          to { stroke-dashoffset: 0; }
        }

        /* NODES */
        .node-card {
          position: absolute;
          width: 160px;
          height: 68px;
          background: rgba(30, 30, 36, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 0.65rem 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          z-index: 10;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .node-icon-wrap {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .node-content {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          min-width: 0;
        }
        .node-lbl {
          font-size: 0.75rem;
          font-weight: 600;
          color: #f4f4f5;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .node-sub {
          font-size: 0.6rem;
          color: #71717a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* NODE TYPE THEMING */
        .node-trigger .node-icon-wrap { background: rgba(239, 68, 68, 0.15); color: #f87171; }
        .node-agent .node-icon-wrap { background: rgba(99, 102, 241, 0.15); color: #a5b4fc; }
        .node-tool .node-icon-wrap { background: rgba(96, 165, 250, 0.15); color: #93c5fd; }
        .node-gate .node-icon-wrap { background: rgba(245, 158, 11, 0.15); color: #fde68a; }
        .node-db .node-icon-wrap { background: rgba(52, 211, 153, 0.15); color: #6ee7b7; }

        /* ACTIVE GLOW STATE */
        .node-card.glow {
          border-color: #818cf8;
          background: rgba(99, 102, 241, 0.12);
          box-shadow: 0 0 25px rgba(99, 102, 241, 0.35);
          transform: scale(1.03);
        }
        .node-active-pulse {
          position: absolute;
          inset: -4px;
          border: 1px solid #818cf8;
          border-radius: 16px;
          animation: ping-node 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          pointer-events: none;
        }
        @keyframes ping-node {
          75%, 100% { transform: scale(1.1); opacity: 0; }
        }

        /* COMPLETED STATE */
        .node-card.done {
          border-color: rgba(52, 211, 153, 0.35);
          background: rgba(52, 211, 153, 0.03);
        }
        .node-check-done {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 14px;
          height: 14px;
          background: #34d399;
          color: #121214;
          font-size: 0.65rem;
          font-weight: 800;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 8px rgba(52, 211, 153, 0.4);
        }

        /* CONSOLE PANEL */
        .console-panel {
          width: 340px;
          position: relative;
          background: rgba(30, 30, 36, 0.3);
        }
        .flex-align {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .console-header-icon {
          color: #a5b4fc;
        }
        .console-status-label {
          font-size: 0.6rem;
          font-family: monospace;
          color: #52525b;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        .console-logs-container {
          flex: 1;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 1rem;
          font-family: monospace;
          font-size: 0.72rem;
          color: #a1a1aa;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          overflow-y: auto;
          max-height: 480px;
        }
        .console-log-line {
          line-height: 1.45;
          word-break: break-word;
          transition: all 0.2s;
        }
        .log-agent-to-agent {
          color: #f472b6 !important;
          font-weight: 500;
          background: rgba(244, 114, 182, 0.06);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          border-left: 2px solid #f472b6;
        }
        .log-tool-call {
          color: #60a5fa !important;
          font-style: italic;
          background: rgba(96, 165, 250, 0.06);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          border-left: 2px solid #60a5fa;
        }
        .log-success {
          color: #34d399 !important;
          background: rgba(52, 211, 153, 0.06);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          border-left: 2px solid #34d399;
        }
        .line-prefix {
          color: #818cf8;
          margin-right: 0.35rem;
        }

        /* SLACK HITL CARD OVERLAY */
        .slack-approval-overlay {
          position: absolute;
          bottom: 1.25rem;
          left: 1.25rem;
          right: 1.25rem;
          background: rgba(18, 18, 22, 0.95);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          z-index: 100;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .slack-card {
          padding: 1.25rem;
        }
        .slack-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.5rem;
        }
        .slack-team {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: #a1a1aa;
        }
        .slack-logo {
          color: #e21b5a;
        }
        .slack-alert-badge {
          font-size: 0.65rem;
          color: #fb923c;
          background: rgba(251, 146, 60, 0.08);
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .slack-card-body {
          font-size: 0.78rem;
          color: #e4e4e7;
          line-height: 1.45;
          margin-bottom: 1rem;
        }
        .slack-warn {
          margin: 0 0 0.25rem 0;
          color: #fb923c;
        }
        .slack-desc {
          margin: 0;
          font-style: italic;
          background: rgba(0,0,0,0.25);
          padding: 0.6rem;
          border-radius: 6px;
        }
        .slack-card-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        .slack-action-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          border: none;
          padding: 0.45rem 0.85rem;
          border-radius: 8px;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .slack-action-btn.reject {
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
        }
        .slack-action-btn.reject:hover {
          background: rgba(239, 68, 68, 0.25);
        }
        .slack-action-btn.approve {
          background: rgba(52, 211, 153, 0.15);
          color: #6ee7b7;
        }
        .slack-action-btn.approve:hover {
          background: rgba(52, 211, 153, 0.25);
        }

        @media (max-width: 1100px) {
          .simulator-grid {
            grid-template-columns: 1fr;
          }
          .console-panel {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
