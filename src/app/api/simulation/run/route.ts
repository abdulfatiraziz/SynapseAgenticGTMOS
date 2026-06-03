import { NextRequest, NextResponse } from 'next/server';
import { BaseAgent } from '../../../../lib/agents/BaseAgent';
import { SynapseConfig } from '../../../../../synapse.config';
import { verifyBearerToken } from '@lib/security/authHelper';

export const revalidate = 0; // Disable caching

export async function POST(req: NextRequest) {
  try {
    if (!verifyBearerToken(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

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
      const { CmoAgent } = await import('../../../../lib/agents/CmoAgent');
      const cmo = new CmoAgent();
      
      const cmoResult = await cmo.defineGtmStrategy({
        competitor: 'LegacyTech',
        action: 'pricing_drop',
        amount: '20%'
      });
      results.push({
        scenario: 1,
        agent: '01',
        agentName: 'CMO Orchestrator',
        status: 'PASS',
        summary: `GTM Strategy defined: Theme is "${cmoResult.messaging_theme}". Delegated to VP PMM (01b).`,
        raw: cmoResult
      });
    }

    // ---------------------------------------------------------
    // Scenario 2: Lead Routing & Outbound (Execution Layer)
    // ---------------------------------------------------------
    if (scenario === '2' || scenario === 2 || scenario === 'all') {
      const { RevOpsAgent } = await import('../../../../lib/agents/RevOpsAgent');
      const revops = new RevOpsAgent();
      
      const revopsResult = await revops.processInboundLead({
        id: 'lead_991',
        company_name: 'LogisticsCorp',
        employee_count: 1200,
        intent_score: 85,
        source: 'webinar'
      });
      results.push({
        scenario: 2,
        agent: '03e',
        agentName: 'Head of Revenue Operations',
        status: 'PASS',
        summary: `Inbound lead evaluated (Score: ${revopsResult.evaluation.score}). Routed to agent ${revopsResult.evaluation.route_to_agent_id}.`,
        raw: revopsResult
      });
    }

    // ---------------------------------------------------------
    // Scenario 3: Content & Social Pulse (Channels Layer)
    // ---------------------------------------------------------
    if (scenario === '3' || scenario === 3 || scenario === 'all') {
      const { ContentSeoAgent } = await import('../../../../lib/agents/ContentSeoAgent');
      const seo = new ContentSeoAgent();
      
      const seoResult = await seo.generateContentBrief({
        messaging_theme: 'Agentic GTM Automation',
        target_personas: ['Growth Lead', 'VP of Sales']
      });
      results.push({
        scenario: 3,
        agent: '03c',
        agentName: 'Content & SEO Lead',
        status: 'PASS',
        summary: `Content brief generated for blog: "${seoResult.blog_title}". Keywords: ${seoResult.keywords.join(', ')}.`,
        raw: seoResult
      });
    }

    // ---------------------------------------------------------
    // Scenario 4: Customer Health Check (CS Layer)
    // ---------------------------------------------------------
    if (scenario === '4' || scenario === 4 || scenario === 'all') {
      const { VpCsAgent } = await import('../../../../lib/agents/VpCsAgent');
      const vpcs = new VpCsAgent();
      
      const csResult = await vpcs.reviewChurnEscalation({
        account_id: 'acme_101',
        company_name: 'Acme Corp',
        health_status: 'Red',
        days_until_renewal: 60,
        arr: 120000
      });
      results.push({
        scenario: 4,
        agent: '04a',
        agentName: 'VP Customer Success',
        status: 'PASS',
        summary: `Executive action taken: ${csResult.action}. Rationale: ${csResult.rationale}`,
        raw: csResult
      });
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error('[Simulation Run API] Error executing agents:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
