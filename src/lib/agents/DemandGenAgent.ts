import { BaseAgent } from './BaseAgent';
import { Orchestrator } from '../orchestration/orchestrator';

export class DemandGenAgent extends BaseAgent {
  constructor(sessionId?: string) {
    super('03b', sessionId); // 03b is the Demand Gen Manager
  }

  /**
   * Evaluates inbound leads/MQLs from paid channels to ensure quality before passing to RevOps.
   */
  async evaluateInboundMQL(mqlData: any) {
    console.log(`[Demand Gen Agent] Evaluating inbound MQL from ${mqlData.source}...`);

    const prompt = `
      You are the Demand Generation Manager. Your job is to filter noise and pass high-quality MQLs.
      An inbound lead just engaged with your paid channel.
      
      MQL Data:
      ${JSON.stringify(mqlData, null, 2)}
      
      Decide if this lead should be passed to RevOps for routing (MQL -> SQL handoff) or if it should be added to a nurture campaign.
      Consider budget impact and Cost per Opportunity. If it's a student or non-business email with low intent, nurture it.
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        decision: { 
          type: "STRING", 
          enum: ["handoff_to_revops", "add_to_nurture", "disqualify"],
          description: "Action to take on this MQL." 
        },
        rationale: { type: "STRING", description: "Why you made this decision based on lead quality." }
      },
      required: ["decision", "rationale"]
    };

    const evaluation = await this.think(prompt, schema);
    console.log(`[Demand Gen Agent] Decision: ${evaluation.decision}. Rationale: ${evaluation.rationale}`);

    // Update Marketing Automation Platform (HubSpot via Gateway)
    await this.useTool('HubSpot', {
      action: 'UPDATE_LIFECYCLE_STAGE',
      leadId: mqlData.id,
      stage: evaluation.decision === 'handoff_to_revops' ? 'MQL' : 'Subscriber'
    });

    if (evaluation.decision === 'handoff_to_revops') {
      await Orchestrator.dispatchTask(this.agentId, '03e', {
        title: `New High-Quality MQL: ${mqlData.company_name}`,
        description: evaluation.rationale,
        priority: 'high',
        input_data: mqlData
      }, this.sessionId);
    }

    return evaluation;
  }
}
