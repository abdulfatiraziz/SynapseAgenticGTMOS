import { BaseAgent } from './BaseAgent';

export class VpCsAgent extends BaseAgent {
  constructor() {
    super('04a'); // 04a is the VP of Customer Success
  }

  /**
   * Reviews escalated churn risks from CSMs and initiates executive-level save plays.
   */
  async reviewChurnEscalation(escalationData: any) {
    console.log(`[VP CS Agent] Reviewing churn escalation for account: ${escalationData.company_name}...`);

    const prompt = `
      You are the VP of Customer Success. You own the Net Retention Rate (NRR) and Net Promoter Score (NPS) across all customer tiers.
      A CSM has just escalated a critical churn risk.
      
      Escalation Data:
      ${JSON.stringify(escalationData, null, 2)}
      
      Decide the appropriate executive action. If the ARR is high or it's a strategic account, you should trigger an 'executive_alignment_call' (you personally joining the call).
      If the issue is primarily a technical blocker, you should 'escalate_to_product'.
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        action: { 
          type: "STRING", 
          enum: ["executive_alignment_call", "escalate_to_product", "approve_concession"],
          description: "Executive action to take." 
        },
        rationale: { type: "STRING", description: "Why this action is the best path to save the account." }
      },
      required: ["action", "rationale"]
    };

    const decision = await this.think(prompt, schema);
    console.log(`[VP CS Agent] Decision: ${decision.action}. Rationale: ${decision.rationale}`);

    // Log decision back into Gainsight
    await this.useTool('Gainsight', {
      action: 'LOG_EXECUTIVE_INTERVENTION',
      account_id: escalationData.account_id,
      decision: decision.action
    });

    return decision;
  }
}
