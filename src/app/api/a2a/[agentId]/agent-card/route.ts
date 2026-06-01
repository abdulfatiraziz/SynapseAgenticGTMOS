import { NextRequest, NextResponse } from 'next/server';
import { BaseAgent } from '../../../../../lib/agents/BaseAgent';

export const revalidate = 0; // Disable cache

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;

    // Instantiate agent to fetch dynamic settings & names
    const agent = new BaseAgent(agentId);
    await agent.initialize();

    if (!agent.name) {
      return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 });
    }

    // Mapping agent ID to targeted technical skills
    const skillsMap: Record<string, Array<{ id: string; name: string; description: string }>> = {
      '01': [
        { id: 'gtm_strategy', name: 'Strategic GTM Orchestration', description: 'Sets target ICP profiles and directs campaign pipelines.' }
      ],
      '01b': [
        { id: 'pmm_positioning', name: 'Product Marketing & Positioning', description: 'Translates technical features into value messaging.' }
      ],
      '01d': [
        { id: 'market_intel', name: 'Market Intelligence Monitoring', description: 'Scans raw signals, job hires, and funding triggers.' }
      ],
      '03a': [
        { id: 'lead_enrichment', name: 'Outbound Prospecting', description: 'Enriches contacts via Apollo and schedules outbound templates.' }
      ],
      '03e': [
        { id: 'lead_routing', name: 'RevOps Lead Triage', description: 'Evaluates and routes leads dynamically to outbound or nurture channels.' }
      ],
      '04a': [
        { id: 'cs_health', name: 'NRR Optimization & Retention', description: 'Monitors product adoption metrics to trigger health scoring and alerts.' }
      ]
    };

    const skills = skillsMap[agentId] || [
      { id: 'gtm_automation', name: 'General GTM Automation', description: `Executes specialized operations as part of the ${agent.name} team.` }
    ];

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';

    const card = {
      name: agent.name.toLowerCase().replace(/\s+/g, '_'),
      version: '1.0.0',
      description: agent.systemPrompt || `Exposed microservice for ${agent.name}.`,
      capabilities: {
        tools: agent.tools
      },
      securitySchemes: {
        agent_oauth_2_0: {
          type: 'oauth2'
        }
      },
      defaultInputModes: ['text/plain', 'application/json'],
      defaultOutputModes: ['application/json'],
      skills,
      url: `${protocol}://${host}/api/a2a/${agentId}`
    };

    return NextResponse.json(card, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
      }
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
