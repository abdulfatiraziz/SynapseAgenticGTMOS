import { BaseAgent } from './BaseAgent';
import { Orchestrator } from '../orchestration/orchestrator';

export class VpPmmAgent extends BaseAgent {
  constructor(sessionId?: string) {
    super('01b', sessionId); // 01b is the VP Product Marketing
  }

  /**
   * Processes the strategy from the CMO to create tactical messaging and battlecards.
   */
  async createMessagingFramework(strategyData: any) {
    console.log(`[VP PMM Agent] Receiving GTM Strategy to build messaging framework...`);

    const prompt = `
      You are the VP of Product Marketing (VP PMM). You translate product capabilities into buyer-facing narratives.
      The CMO has just updated the GTM Strategy.
      
      CMO Strategy Data:
      ${JSON.stringify(strategyData, null, 2)}
      
      Create a focused messaging framework based on this strategy. Lead with pain, follow with proof.
      Include a short "elevator pitch" and 2 key value propositions for sales enablement.
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        elevator_pitch: { type: "STRING", description: "Short, punchy pitch for SDRs to use." },
        value_prop_1: { type: "STRING", description: "First key value proposition highlighting pain/proof." },
        value_prop_2: { type: "STRING", description: "Second key value proposition highlighting pain/proof." }
      },
      required: ["elevator_pitch", "value_prop_1", "value_prop_2"]
    };

    // 1. Generate Messaging Framework
    console.log(`[VP PMM Agent] Thinking... drafting sales enablement content.`);
    const messaging = await this.think(prompt, schema);
    console.log(`[VP PMM Agent] Messaging framework completed.`);

    // 2. Distribute to Highspot / Notion via Tool Gateway
    console.log(`[VP PMM Agent] Uploading battlecard to Highspot/Notion...`);
    await this.useTool('Notion', {
      action: 'UPDATE_PAGE',
      title: 'Q3 Sales Messaging & Battlecards',
      content: messaging
    });

    // 3. Dispatch alert to SDR Manager (03a) that new messaging is ready for sequences
    await Orchestrator.dispatchTask(this.agentId, '03a', {
      title: 'New Messaging Framework Available',
      description: `VP PMM has updated the messaging framework. Please update your outbound sequences to use this new elevator pitch.`,
      priority: 'medium',
      input_data: messaging
    }, this.sessionId);

    return messaging;
  }
}
