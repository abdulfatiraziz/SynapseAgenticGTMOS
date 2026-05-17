import { BaseAgent } from './BaseAgent';
import { Orchestrator } from '../orchestration/orchestrator';

export class VpPartnershipsAgent extends BaseAgent {
  constructor() {
    super('02d'); // 02d is the VP Partnerships
  }

  /**
   * Evaluates partner overlap data to suggest co-sell opportunities.
   */
  async processPartnerOverlap(overlapData: any) {
    console.log(`[VP Partnerships Agent] Analyzing partner overlap for account: ${overlapData.company_name}...`);

    const prompt = `
      You are the VP of Partnerships. You drive partner-sourced and partner-influenced revenue.
      You have received account mapping data from a partner (e.g., via Crossbeam).
      
      Overlap Data:
      ${JSON.stringify(overlapData, null, 2)}
      
      Analyze the overlap. If the partner has an 'active_customer' status with this account and the account is in our ICP, you should recommend a 'co_sell_motion'.
      If they are just a prospect for the partner as well, recommend 'monitor'.
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        decision: { 
          type: "STRING", 
          enum: ["co_sell_motion", "monitor"],
          description: "Whether to initiate a co-sell motion." 
        },
        rationale: { type: "STRING", description: "Why you chose this partner strategy." }
      },
      required: ["decision", "rationale"]
    };

    const evaluation = await this.think(prompt, schema);
    console.log(`[VP Partnerships Agent] Decision: ${evaluation.decision}. Rationale: ${evaluation.rationale}`);

    if (evaluation.decision === 'co_sell_motion') {
      await Orchestrator.dispatchTask(this.agentId, '02a', {
        title: `Partner Co-Sell Opportunity: ${overlapData.company_name}`,
        description: `Partner ${overlapData.partner_name} has a strong relationship here. Let's co-sell. Rationale: ${evaluation.rationale}`,
        priority: 'high',
        input_data: overlapData
      });
    }

    // Log to Partner portal
    await this.useTool('Crossbeam', {
      action: 'LOG_OVERLAP_DECISION',
      account_id: overlapData.account_id,
      decision: evaluation.decision
    });

    return evaluation;
  }
}
