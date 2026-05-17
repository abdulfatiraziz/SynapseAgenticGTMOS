import { BaseAgent } from './BaseAgent';
import { Orchestrator } from '../orchestration/orchestrator';

export class CommunityAgent extends BaseAgent {
  constructor() {
    super('02c'); // 02c is the Head of Community
  }

  /**
   * Evaluates community engagement signals to identify power users or expansion opportunities.
   */
  async processCommunitySignal(signalData: any) {
    console.log(`[Head of Community Agent] Analyzing community signal from: ${signalData.user_name}...`);

    const prompt = `
      You are the Head of Community. You build evangelism and track community-sourced pipeline.
      A user has engaged heavily in the community forum/Slack.
      
      Signal Data:
      ${JSON.stringify(signalData, null, 2)}
      
      Analyze the engagement. If the user is asking advanced implementation questions or answering questions for others, they are a 'power_user'.
      If they are a 'power_user' at a target ICP account, decide to 'alert_sales_for_expansion'.
      Otherwise, 'invite_to_advocacy_program'.
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        decision: { 
          type: "STRING", 
          enum: ["alert_sales_for_expansion", "invite_to_advocacy_program", "monitor"],
          description: "Action to take based on the community engagement." 
        },
        rationale: { type: "STRING", description: "Why you made this decision." }
      },
      required: ["decision", "rationale"]
    };

    const evaluation = await this.think(prompt, schema);
    console.log(`[Head of Community Agent] Decision: ${evaluation.decision}. Rationale: ${evaluation.rationale}`);

    if (evaluation.decision === 'alert_sales_for_expansion') {
      await Orchestrator.dispatchTask(this.agentId, '04c', {
        title: `Community Signal: Expansion Opportunity at ${signalData.company_name}`,
        description: evaluation.rationale,
        priority: 'medium',
        input_data: signalData
      });
    } else if (evaluation.decision === 'invite_to_advocacy_program') {
      await this.useTool('Zapier', {
        action: 'TRIGGER_WEBHOOK',
        contact_id: signalData.contact_id,
        event: 'Advocate Invite Sent'
      });
    }

    return evaluation;
  }
}
