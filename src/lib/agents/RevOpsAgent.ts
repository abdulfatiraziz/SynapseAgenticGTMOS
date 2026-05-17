import { BaseAgent } from './BaseAgent';
import { Orchestrator } from '../orchestration/orchestrator';

export class RevOpsAgent extends BaseAgent {
  constructor() {
    super('03e'); // 03e is the agent_id for Head of RevOps
  }

  /**
   * Processes a new inbound lead or signal.
   * Scores the lead and routes it to the appropriate downstream agent.
   */
  async processInboundLead(leadData: any) {
    console.log(`[RevOps Agent] Analyzing inbound lead: ${leadData.company_name}`);

    const prompt = `
      You are the RevOps Gatekeeper. Analyze this inbound lead data and decide where to route it.
      
      Routing Rules:
      1. If Intent Score > 80 AND Employee Count > 1000 -> Route to VP Sales (02a) for Enterprise Motion.
      2. If Intent Score > 50 -> Route to SDR Manager (03a) for Standard Outbound.
      3. If Intent Score < 50 -> Route to Demand Gen (03b) for Nurture.
      
      Lead Data:
      ${JSON.stringify(leadData, null, 2)}
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        score: { type: "INTEGER", description: "Calculated intent score" },
        decision: { type: "STRING", description: "Rationale for the routing decision" },
        route_to_agent_id: { type: "STRING", description: "The ID of the agent to route to (e.g., '02a', '03a', '03b')" }
      },
      required: ["score", "decision", "route_to_agent_id"]
    };

    // 1. Ask Gemini to evaluate and score
    const evaluation = await this.think(prompt, schema);
    console.log(`[RevOps Agent] Decision: Route to ${evaluation.route_to_agent_id}. Reason: ${evaluation.decision}`);

    // 2. Use Tool Gateway to Update CRM (Salesforce)
    await this.useTool('Salesforce', {
      action: 'UPDATE_LEAD',
      lead_id: leadData.id,
      assigned_to: evaluation.route_to_agent_id,
      score: evaluation.score
    });

    // 3. Dispatch the lead to the chosen agent via Orchestrator
    const task = await Orchestrator.dispatchTask(this.agentId, evaluation.route_to_agent_id, {
      title: `New Routed Lead: ${leadData.company_name}`,
      description: evaluation.decision,
      priority: evaluation.score > 80 ? 'high' : 'medium',
      input_data: leadData
    });

    return {
      evaluation,
      taskId: task.id
    };
  }
}
