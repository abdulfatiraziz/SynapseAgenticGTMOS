import { BaseAgent } from './BaseAgent';
import { Orchestrator } from '../orchestration/orchestrator';

export class SdrManagerAgent extends BaseAgent {
  constructor() {
    super('03a'); // 03a is the SDR Manager
  }

  /**
   * Processes a routed account.
   * Identifies the correct target personas and queries Apollo for contacts.
   */
  async processAssignedAccount(accountData: any) {
    console.log(`[SDR Manager] Analyzing routed account: ${accountData.company_name}`);

    const prompt = `
      You are the SDR Manager Agent. You have been assigned a new account to target.
      Based on the company data, determine the 2 best personas (job titles) to target for outbound outreach.
      
      Account Data:
      ${JSON.stringify(accountData, null, 2)}
      
      Return a JSON object with a list of target 'titles' and a brief 'rationale'.
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        titles: { 
          type: "ARRAY", 
          items: { type: "STRING" },
          description: "Specific job titles to search for (e.g., 'VP of Engineering', 'Director of Marketing')"
        },
        rationale: { type: "STRING", description: "Why these personas are the best fit for this account." }
      },
      required: ["titles", "rationale"]
    };

    // 1. Ask Gemini to identify personas
    console.log(`[SDR Manager] Thinking... identifying target personas.`);
    const targeting = await this.think(prompt, schema);
    console.log(`[SDR Manager] Decided to target: ${targeting.titles.join(', ')}`);

    // 2. Query Apollo.io (via Gateway) to find these contacts
    console.log(`[SDR Manager] Using Tool Gateway to search Apollo.io for contacts...`);
    const apolloResults = await this.useTool('Apollo', {
      action: 'SEARCH_CONTACTS',
      company: accountData.company_name,
      titles: targeting.titles
    });

    // 3. Draft the Sequence / Personalization (in a real scenario, this would be another LLM call or a handoff)
    // Here we just log the action and push to the CRM / Outreach.
    await this.useTool('Salesforce', {
      action: 'LOG_PROSPECTS',
      accountId: accountData.id,
      prospects_found: apolloResults.data
    });

    console.log(`[SDR Manager] Successfully processed account ${accountData.company_name} and queued outbound sequence.`);

    return {
      targeting,
      apolloResults
    };
  }
}
