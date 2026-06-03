import { BaseAgent } from './BaseAgent';

export class PricingManagerAgent extends BaseAgent {
  constructor(sessionId?: string) {
    super('01c', sessionId); // 01c is the Pricing & Packaging Manager
  }

  /**
   * Evaluates sales discount requests to ensure margin thresholds are met.
   */
  async evaluateDiscountRequest(requestData: any) {
    console.log(`[Pricing Manager Agent] Evaluating discount request for: ${requestData.company_name}...`);

    const prompt = `
      You are the Pricing & Packaging Manager. You own the financial architecture and discount governance.
      An AE has requested a discount for an enterprise deal.
      
      Request Data:
      ${JSON.stringify(requestData, null, 2)}
      
      Analyze the request. If the requested discount is >20% or the resulting margin drops below 70%, you must 'reject_and_escalate' to the CRO/VP Sales.
      Otherwise, if the metrics are healthy and the rationale is sound, 'approve_discount'.
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        decision: { 
          type: "STRING", 
          enum: ["approve_discount", "reject_and_escalate"],
          description: "Whether to approve the discount or escalate." 
        },
        rationale: { type: "STRING", description: "Why you made this decision based on unit economics." }
      },
      required: ["decision", "rationale"]
    };

    const evaluation = await this.think(prompt, schema);
    console.log(`[Pricing Manager Agent] Decision: ${evaluation.decision}. Rationale: ${evaluation.rationale}`);

    // Update Billing System (Mock via Gateway)
    await this.useTool('ProfitWell', {
      action: 'UPDATE_DISCOUNT_APPROVAL',
      opportunity_id: requestData.opportunity_id,
      status: evaluation.decision
    });

    return evaluation;
  }
}
