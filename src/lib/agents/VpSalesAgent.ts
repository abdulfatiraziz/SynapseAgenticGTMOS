import { BaseAgent } from './BaseAgent';
import { Orchestrator } from '../orchestration/orchestrator';

export class VpSalesAgent extends BaseAgent {
  constructor(sessionId?: string) {
    super('02a', sessionId); // 02a is the VP Sales
  }

  /**
   * Reviews high-value enterprise leads assigned to the Sales-Led Growth motion.
   */
  async reviewEnterprisePipeline(leadData: any) {
    console.log(`[VP Sales Agent] Reviewing new Enterprise pipeline...`);

    const prompt = `
      You are the VP of Sales. You own the enterprise Sales-Led Growth (SLG) motion.
      A high-intent enterprise lead has just been routed to your pipeline.
      
      Lead Data:
      ${JSON.stringify(leadData, null, 2)}
      
      Review the lead. Decide if it warrants a 'direct executive outreach' (you personally emailing their VP) or if it should be delegated to a Senior Account Executive.
      Provide a brief rationale.
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        action: { 
          type: "STRING", 
          enum: ["executive_outreach", "delegate_to_ae"],
          description: "The action to take on this lead." 
        },
        rationale: { type: "STRING", description: "Why you chose this action based on the lead's profile." }
      },
      required: ["action", "rationale"]
    };

    // 1. Analyze and decide
    console.log(`[VP Sales Agent] Thinking... reviewing lead value and strategy.`);
    const decision = await this.think(prompt, schema);
    console.log(`[VP Sales Agent] Decision: ${decision.action}. Rationale: ${decision.rationale}`);

    // 2. Update CRM (Salesforce)
    await this.useTool('Salesforce', {
      action: 'UPDATE_OPPORTUNITY',
      leadId: leadData.id,
      sales_action: decision.action
    });

    return decision;
  }
}
