import { BaseAgent } from './BaseAgent';
import { Orchestrator } from '../orchestration/orchestrator';

export class CsmAgent extends BaseAgent {
  constructor(sessionId?: string) {
    super('04b', sessionId); // 04b is the Customer Success Manager
  }

  /**
   * Processes an account health alert (e.g., from Gainsight).
   * Decides on a save play and escalates if necessary.
   */
  async processHealthAlert(healthData: any) {
    console.log(`[CSM Agent] Analyzing health alert for account: ${healthData.company_name}...`);

    const prompt = `
      You are the Customer Success Manager. Your goal is to ensure value realization and prevent churn.
      An account in your book of business has triggered a health score alert.
      
      Account Data:
      ${JSON.stringify(healthData, null, 2)}
      
      Analyze the risk. If the account health is 'Red' (critical risk) or if they are a Strategic Tier account, you must initiate a 'save_play' and escalate to the VP of CS (04a).
      If the health is 'Yellow', trigger an 'adoption_nurture' without escalation.
      If there is an expansion signal (e.g., hitting usage limits), route to the Expansion AE (04c).
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        action: { 
          type: "STRING", 
          enum: ["execute_save_play", "execute_adoption_nurture", "route_to_expansion"],
          description: "Action to take based on the health data." 
        },
        requires_escalation: { type: "BOOLEAN", description: "True if the VP CS needs to be alerted." },
        rationale: { type: "STRING", description: "Why you made this decision." }
      },
      required: ["action", "requires_escalation", "rationale"]
    };

    const evaluation = await this.think(prompt, schema);
    console.log(`[CSM Agent] Action: ${evaluation.action}. Escalation: ${evaluation.requires_escalation}`);

    // Update Gainsight (Mock via Gateway)
    await this.useTool('Gainsight', {
      action: 'LOG_INTERVENTION',
      account_id: healthData.account_id,
      intervention_type: evaluation.action
    });

    // Handle A2A Routing
    if (evaluation.requires_escalation) {
      console.log(`[CSM Agent] Escalating to VP CS (04a)...`);
      await Orchestrator.dispatchTask(this.agentId, '04a', {
        title: `CRITICAL: Churn Risk Escalation - ${healthData.company_name}`,
        description: evaluation.rationale,
        priority: 'high',
        input_data: healthData
      }, this.sessionId);
    } else if (evaluation.action === 'route_to_expansion') {
      console.log(`[CSM Agent] Routing expansion signal to Expansion AE (04c)...`);
      await Orchestrator.dispatchTask(this.agentId, '04c', {
        title: `Expansion Signal: ${healthData.company_name}`,
        description: evaluation.rationale,
        priority: 'medium',
        input_data: healthData
      }, this.sessionId);
    }

    return evaluation;
  }
}
