import { BaseAgent } from './BaseAgent';

export class RenewalsManagerAgent extends BaseAgent {
  constructor(sessionId?: string) {
    super('04d', sessionId); // 04d is the Renewals Manager
  }

  /**
   * Reviews upcoming renewals (90-180 days out) and initiates the renewal contract process.
   */
  async processUpcomingRenewal(renewalData: any) {
    console.log(`[Renewals Manager Agent] Processing upcoming renewal for: ${renewalData.company_name}...`);

    const prompt = `
      You are the Renewals Manager. Your job is to defend Net Retention Rate (NRR) by ensuring accounts renew on time.
      A customer's contract is coming up for renewal soon.
      
      Renewal Data:
      ${JSON.stringify(renewalData, null, 2)}
      
      Analyze the account's health score and days until renewal. 
      If the health is 'Green' and days_until_renewal < 90, you should 'draft_renewal_contract'.
      If the health is 'Red' or 'Yellow', you should 'flag_for_csm_intervention' to ensure the account is saved before discussing contracts.
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        action: { 
          type: "STRING", 
          enum: ["draft_renewal_contract", "flag_for_csm_intervention", "monitor"],
          description: "Action to take based on the renewal risk." 
        },
        rationale: { type: "STRING", description: "Why you chose this action." }
      },
      required: ["action", "rationale"]
    };

    const evaluation = await this.think(prompt, schema);
    console.log(`[Renewals Manager Agent] Action: ${evaluation.action}. Rationale: ${evaluation.rationale}`);

    if (evaluation.action === 'draft_renewal_contract') {
      await this.useTool('DocuSign', {
        action: 'GENERATE_CONTRACT',
        account_id: renewalData.account_id,
        contract_type: 'Standard Renewal'
      });
    } else if (evaluation.action === 'flag_for_csm_intervention') {
      await this.useTool('ChurnZero', {
        action: 'FLAG_RENEWAL_RISK',
        account_id: renewalData.account_id
      });
    }

    return evaluation;
  }
}
