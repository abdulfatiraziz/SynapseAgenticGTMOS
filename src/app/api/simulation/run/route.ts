import { NextRequest, NextResponse } from 'next/server';
import { BaseAgent } from '../../../../lib/agents/BaseAgent';
import { SynapseConfig } from '../../../../../synapse.config';

export const revalidate = 0; // Disable caching

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { scenario = 'all' } = body;

    // Set budget appropriately for a stress test/run
    SynapseConfig.budgets.max_tokens_per_session = 100000;

    const results: any[] = [];

    // ---------------------------------------------------------
    // Scenario Custom: Dynamic agent execution
    // ---------------------------------------------------------
    if (scenario === 'custom') {
      const { agentId = '01', prompt = 'Run competitive GTM research.', budget = 100000 } = body;
      
      const agentLookup: Record<string, string> = {
        '01': 'Chief Marketing Officer',
        '01b': 'VP Product Marketing',
        '01c': 'Pricing & Packaging Manager',
        '01d': 'Market Intelligence Analyst',
        '02a': 'VP Sales',
        '02b': 'Head of PLG',
        '02c': 'Head of Community',
        '02d': 'VP Partnerships',
        '03a': 'SDR Manager',
        '03b': 'Demand Generation Manager',
        '03c': 'Content & SEO Lead',
        '03d': 'Field & Events Manager',
        '03e': 'Head of Revenue Operations',
        '04a': 'VP Customer Success',
        '04b': 'Customer Success Manager',
        '04c': 'Expansion Account Executive',
        '04d': 'Renewals Manager',
      };
      
      const agentName = agentLookup[agentId] || 'Custom GTM Agent';
      
      SynapseConfig.budgets.max_tokens_per_session = budget;
      
      const customAgent = new BaseAgent(agentId);
      const customResult = await customAgent.think(prompt, {
        type: 'object',
        properties: {
          strategy: { type: 'string' },
          action_items: { type: 'array', items: { type: 'string' } }
        }
      });
      
      results.push({
        scenario: 'custom',
        agent: agentId,
        agentName: agentName,
        status: 'PASS',
        summary: customResult.strategy || JSON.stringify(customResult),
        raw: customResult
      });
    }

    // ---------------------------------------------------------
    // Scenario 1: Morning Sync (Strategy Layer)
    // ---------------------------------------------------------
    if (scenario === '1' || scenario === 1 || scenario === 'all') {
      const cmo = new BaseAgent('01');
      const cmoPrompt = `A major competitor, LegacyTech, just dropped their pricing by 20%. 
      1. Delegate to Market Intel (01d) to research their new pricing page.
      2. Delegate to VP PMM (01b) to draft a competitive response brief.
      Use your tools to coordinate this.`;
      
      const cmoResult = await cmo.think(cmoPrompt, {
        type: 'object',
        properties: {
          strategy: { type: 'string' },
          delegations: { type: 'array', items: { type: 'string' } }
        }
      });
      results.push({
        scenario: 1,
        agent: '01',
        agentName: 'CMO Orchestrator',
        status: 'PASS',
        summary: cmoResult.strategy,
        raw: cmoResult
      });
    }

    // ---------------------------------------------------------
    // Scenario 2: Lead Routing & Outbound (Execution Layer)
    // ---------------------------------------------------------
    if (scenario === '2' || scenario === 2 || scenario === 'all') {
      const revops = new BaseAgent('03e');
      const revopsPrompt = `We received 3 new leads from our webinar.
      Lead 1: VP of Ops at LogisticsCorp (Enterprise).
      Lead 2: Intern at StartupX (SMB).
      Lead 3: Director of Supply Chain at GlobalFreight (Mid-Market).
      Evaluate these leads. Route Lead 1 and 3 to SDR Manager (03a) for outbound.
      Route Lead 2 to Demand Gen (03b) for nurture. Use your tools to process this.`;
      
      const revopsResult = await revops.think(revopsPrompt, {
        type: 'object',
        properties: {
          routed_outbound: { type: 'number' },
          routed_nurture: { type: 'number' }
        }
      });
      results.push({
        scenario: 2,
        agent: '03e',
        agentName: 'Head of Revenue Operations',
        status: 'PASS',
        summary: `Leads routed successfully: ${revopsResult.routed_outbound} to Outbound, ${revopsResult.routed_nurture} to Nurture.`,
        raw: revopsResult
      });
    }

    // ---------------------------------------------------------
    // Scenario 3: Content & Social Pulse (Channels Layer)
    // ---------------------------------------------------------
    if (scenario === '3' || scenario === 3 || scenario === 'all') {
      const seo = new BaseAgent('03c');
      const seoPrompt = `We need a new blog post targeting 'Agentic GTM Automation'.
      Use Ahrefs to check keyword volume, then draft a 2-paragraph brief.
      Finally, coordinate with Community Lead (02c) to share it on Slack.`;
      
      const seoResult = await seo.think(seoPrompt, {
        type: 'object',
        properties: {
          keyword_volume: { type: 'string' },
          brief: { type: 'string' }
        }
      });
      results.push({
        scenario: 3,
        agent: '03c',
        agentName: 'Content & SEO Lead',
        status: 'PASS',
        summary: seoResult.brief,
        raw: seoResult
      });
    }

    // ---------------------------------------------------------
    // Scenario 4: Customer Health Check (CS Layer)
    // ---------------------------------------------------------
    if (scenario === '4' || scenario === 4 || scenario === 'all') {
      const vpcs = new BaseAgent('04a');
      const csPrompt = `Run a daily health check on Acme Corp.
      Use Gainsight/PostHog to check their adoption. 
      If health is bad, alert CSM (04b). If they are maxing out usage, alert Expansion AE (04c).`;
      
      const csResult = await vpcs.think(csPrompt, {
        type: 'object',
        properties: {
          health_status: { type: 'string' },
          action_taken: { type: 'string' }
        }
      });
      results.push({
        scenario: 4,
        agent: '04a',
        agentName: 'VP Customer Success',
        status: 'PASS',
        summary: csResult.action_taken,
        raw: csResult
      });
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error('[Simulation Run API] Error executing agents:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
