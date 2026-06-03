import { BaseAgent } from './BaseAgent';

export class ExpansionAeAgent extends BaseAgent {
  constructor(sessionId?: string) {
    super('04c', sessionId); // 04c is the Expansion Account Executive
  }

  /**
   * Processes an expansion signal routed from a CSM.
   * Formulates a commercial approach to upsell or cross-sell.
   */
  async processExpansionSignal(signalData: any) {
    console.log(`[Expansion AE Agent] Reviewing expansion signal for account: ${signalData.company_name}...`);

    const prompt = `
      You are the Expansion Account Executive. Your job is to drive expansion ARR (upsells and cross-sells) across the existing customer base.
      A CSM has routed an expansion signal to you.
      
      Signal Data:
      ${JSON.stringify(signalData, null, 2)}
      
      Based on the signal reason (e.g., hitting seat limits vs requesting API access), determine the best commercial play.
      Should you propose a 'seat_upsell', a 'product_cross_sell', or a 'tier_upgrade'?
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        play_type: { 
          type: "STRING", 
          enum: ["seat_upsell", "product_cross_sell", "tier_upgrade"],
          description: "The commercial play to run." 
        },
        estimated_arr_increase: { type: "INTEGER", description: "Estimated dollar amount increase." },
        rationale: { type: "STRING", description: "Why this is the correct commercial motion." }
      },
      required: ["play_type", "estimated_arr_increase", "rationale"]
    };

    const evaluation = await this.think(prompt, schema);
    console.log(`[Expansion AE Agent] Play: ${evaluation.play_type}. Rationale: ${evaluation.rationale}`);

    // Create an expansion opportunity in Salesforce
    await this.useTool('Salesforce', {
      action: 'CREATE_EXPANSION_OPPORTUNITY',
      account_id: signalData.account_id,
      type: evaluation.play_type,
      amount: evaluation.estimated_arr_increase
    });

    return evaluation;
  }
}
