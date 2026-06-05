import { NextRequest, NextResponse } from 'next/server';
import { aiClient } from '@lib/vertexai';

export const dynamic = 'force-dynamic';

const AGENT_PROFILES: Record<string, {
  name: string;
  role: string;
  department: string;
  description: string;
  logic: string;
  kpis: string[];
}> = {
  cmo: {
    name: "CMO Agent",
    role: "Chief Marketing Officer",
    department: "C-Suite",
    description: "Aligns marketing strategy, lockers ICPs, and allocates ad budgets.",
    logic: "IF Console routes GTM instruction → Trigger Organic and Paid alignment",
    kpis: ["Marketing pipeline value", "CAC", "Win-rate %"]
  },
  vp_sales: {
    name: "VP Sales Agent",
    role: "VP of Sales (SLG)",
    department: "C-Suite",
    description: "Oversees enterprise accounts, sales pipeline, and Outbound SDR quotas.",
    logic: "IF Console routes GTM instruction → Trigger SDR sequences updates in Sales Bay",
    kpis: ["Meetings booked", "Sales cycle length", "Pipeline ARR"]
  },
  vp_cs: {
    name: "VP CS Agent",
    role: "VP of Customer Success",
    department: "C-Suite",
    description: "Maintains Net Revenue Retention (NRR), save cycles, and CSM allocations.",
    logic: "IF health index drops below 50 → Assign CS save target in Support Cabin",
    kpis: ["NRR (target 110%+)", "Retention rate", "Time-to-onboard"]
  },
  vp_partnerships: {
    name: "VP Partnerships Agent",
    role: "VP of Partnerships",
    department: "C-Suite",
    description: "Designs co-sell alliances, Crossbeam maps, and warm partner intro systems.",
    logic: "IF active deal → Initiate Crossbeam partner overlapping scans",
    kpis: ["Partner revenue %", "Alliance count"]
  },
  critic: {
    name: "Critic Agent",
    role: "Strategy Evaluator",
    department: "C-Suite",
    description: "Audits feasibility of GTM playbooks and runs red-team system diagnostics.",
    logic: "IF alignment playbook proposed → Score feasibility & detect pipeline faults",
    kpis: ["Vulnerability detection rate", "Playbook accuracy"]
  },
  seo: {
    name: "SEO Agent",
    role: "Organic SEO Specialist",
    department: "Marketing",
    description: "Monitors search queries, posts daily articles, and drives organic traffic.",
    logic: "IF CMO routes task → Optimize organic search keywords and LinkedIn posting",
    kpis: ["Organic traffic growth", "Inbound lead count"]
  },
  demand_gen: {
    name: "Demand Gen Agent",
    role: "Demand Gen Manager",
    department: "Marketing",
    description: "Deploys search engine ad copy, monitors campaign budgets, and paid channels ROI.",
    logic: "IF CAC exceeds $500 threshold → Pause LinkedIn paid groups",
    kpis: ["MQL volume", "ROAS target", "Cost per lead"]
  },
  vp_pmm: {
    name: "VP PMM Agent",
    role: "VP of Product Marketing",
    department: "C-Suite",
    description: "Creates market battlecards, pricing models, and GTM positioning playbooks.",
    logic: "IF competitor pivots features → Auto-update sales battlecard script",
    kpis: ["Win-rate on competitor deals", "Asset usage %"]
  },
  market_intel: {
    name: "Market Intel Agent",
    role: "Market Analyst",
    department: "Marketing",
    description: "Runs real-time grounded search to track competitor updates and pricing strategies.",
    logic: "ALWAYS search competitor profiles every 24h",
    kpis: ["ICP match rate", "Competitive win-rate trend"]
  },
  sdr_mgr: {
    name: "SDR Manager Agent",
    role: "SDR Manager Lead",
    department: "Sales",
    description: "Orchestrates cold emailing sequences, Clay lead enrichment, and booked meetings.",
    logic: "IF VP Sales routes task → Launch sequence and personalization scripts in Sales Bay",
    kpis: ["Meetings booked", "Outbound reply rate"]
  },
  outbound_sdr: {
    name: "Outbound SDR",
    role: "Outbound outreach coordinator",
    department: "Sales",
    description: "Executes automated sequencing, email delivery, and follow-ups.",
    logic: "IF contact matches ICP -> Enqueue in daily email send campaign list",
    kpis: ["Email delivery count", "Meeting book rate %"]
  },
  expansion_ae: {
    name: "Expansion AE Agent",
    role: "Expansion Account Executive",
    department: "Sales",
    description: "Identifies seat limits, triggers cross-sell, and manages contract expansions.",
    logic: "IF customer seats reach 90% limit → Draft upsell contract proposal",
    kpis: ["Expansion ARR", "Upsell win rate", "Contract amendment speed"]
  },
  revops: {
    name: "RevOps Agent",
    role: "Revenue Operations Specialist",
    department: "Operations",
    description: "Maintains CRM syncing gateways, lead routing algorithms, and API integrations.",
    logic: "IF signup source = 'Webinar' → Route lead immediately to CSM pipeline",
    kpis: ["Lead routing speed", "CRM completeness", "Integration uptime %"]
  },
  plg: {
    name: "PLG Agent",
    role: "Head of Product-Led Growth",
    department: "Operations",
    description: "Computes user activation metrics, identifies PQL spikes, and triggers Slack alerts.",
    logic: "IF workspace invites > 3 teammates → Flag PQL and alert Sales representatives",
    kpis: ["Activation rate", "PQL to SQL rate", "Product sourced revenue %"]
  },
  broker: {
    name: "Broker Agent",
    role: "System Handoff Coordinator",
    department: "Operations",
    description: "Acts as a central communication relay between disparate agent networks.",
    logic: "IF agent payload received → Relay and check integration parameters",
    kpis: ["Relay latency", "Sync efficiency", "Database updates"]
  },
  csm: {
    name: "CSM Agent",
    role: "Customer Success Manager",
    department: "Support",
    description: "Automates customer onboarding, schedules check-ins, and manages renewals.",
    logic: "IF usage drops 20% → Route priority support ticket to renewals manager",
    kpis: ["Renewal rate", "CSAT score", "Average health score"]
  },
  renewals: {
    name: "Renewals Agent",
    role: "Renewals Manager",
    department: "Support",
    description: "Manages contract expiries, forecasts NRR defense, and protects accounts.",
    logic: "IF renewal within 90 days → Initiate multi-year contract dialogue",
    kpis: ["NRR defense", "Renewal rate", "Negotiation speed"]
  },
  community: {
    name: "Community Agent",
    role: "Community Signals Analyst",
    department: "Support",
    description: "Listens to public Slack and LinkedIn channels for intent keyword mentions.",
    logic: "IF keyword 'pricing' is detected in Slack → Route alert to CSM queue",
    kpis: ["Community DAU", "Brand sentiment score", "Referral lead count"]
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, message, history = [] } = body;

    if (!agentId || !message) {
      return NextResponse.json({ error: 'Missing agentId or message' }, { status: 400 });
    }

    const profile = AGENT_PROFILES[agentId];
    if (!profile) {
      return NextResponse.json({ error: `Unknown agent ID: ${agentId}` }, { status: 404 });
    }

    const systemPrompt = `You are the "${profile.name}" (${profile.role}) in the Synpase Agentic GTM system.
Department: ${profile.department}
Description: ${profile.description}
Operational Logic: ${profile.logic}
KPIs: ${profile.kpis.join(', ')}

Please reply to the user's message as this agent.
Keep your response short and highly contextual, limited to 1 or 2 concise sentences. Do NOT output markdown code blocks or JSON wrappers. Just output the clean text reply.`;

    const chatHistoryPrompt = history.map((h: any) => `${h.sender === 'user' ? 'User' : profile.name}: ${h.text}`).join('\n');
    const prompt = `${systemPrompt}\n\nChat History:\n${chatHistoryPrompt}\nUser: ${message}\n${profile.name}:`;

    // Query Gemini
    const res = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let reply = res.text || '';
    
    // In case the offline mock returns a mock JSON string, parse it cleanly
    if (reply.startsWith('{')) {
      try {
        const parsed = JSON.parse(reply);
        reply = parsed.strategy || parsed.action_taken || parsed.suggestedAnswer || reply;
      } catch (e) {
        // use raw string
      }
    }

    if (!reply.trim()) {
      reply = `I am currently coordinating GTM actions for the ${profile.department} department. Let's make sure our metrics align!`;
    }

    return NextResponse.json({ reply: reply.trim() });
  } catch (error: any) {
    console.error('[agent-chat-route] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
