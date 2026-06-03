import { BaseAgent } from './BaseAgent';
import { Orchestrator } from '../orchestration/orchestrator';

export class CmoAgent extends BaseAgent {
  constructor(sessionId?: string) {
    super('01', sessionId); // 01 is the Chief Marketing Officer
  }

  /**
   * Processes market data to define or update the Ideal Customer Profile (ICP) and GTM Strategy.
   */
  async defineGtmStrategy(marketIntelData: any) {
    console.log(`[CMO Agent] Reviewing market intelligence to define GTM Strategy...`);

    const prompt = `
      You are the Chief Marketing Officer (CMO). You own the unified GTM strategy.
      Review the latest market intelligence provided by the Market Intel Analyst.
      
      Market Intel Data:
      ${JSON.stringify(marketIntelData, null, 2)}
      
      Based on this data, define the updated Ideal Customer Profile (ICP) and the primary messaging theme for the upcoming quarter.
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        icp_definition: { type: "STRING", description: "Detailed definition of the target ICP." },
        messaging_theme: { type: "STRING", description: "The core narrative/theme for marketing and sales." },
        budget_allocation_recommendation: { type: "STRING", description: "Where to allocate resources based on this strategy." }
      },
      required: ["icp_definition", "messaging_theme", "budget_allocation_recommendation"]
    };

    // 1. Analyze and define strategy
    console.log(`[CMO Agent] Thinking... finalizing ICP and messaging theme.`);
    const strategy = await this.think(prompt, schema);
    console.log(`[CMO Agent] Strategy locked. Theme: ${strategy.messaging_theme}`);

    // 2. Update Notion (Knowledge Base) via Tool Gateway
    console.log(`[CMO Agent] Updating corporate strategy in Knowledge Base (Notion)...`);
    await this.useTool('Notion', {
      action: 'UPDATE_PAGE',
      title: 'Q3 GTM Strategy & ICP',
      content: strategy
    });

    // 3. Dispatch task to VP Product Marketing (01b) to translate this into battlecards
    await Orchestrator.dispatchTask(this.agentId, '01b', {
      title: 'New GTM Strategy - Require Battlecards',
      description: `CMO has finalized the strategy. Theme: ${strategy.messaging_theme}. Please create product narratives and battlecards.`,
      priority: 'high',
      input_data: strategy
    }, this.sessionId);

    return strategy;
  }
}
