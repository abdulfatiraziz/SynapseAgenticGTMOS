import { BaseAgent } from './BaseAgent';
import { Orchestrator } from '../orchestration/orchestrator';

export class PlgAgent extends BaseAgent {
  constructor(sessionId?: string) {
    super('02b', sessionId); // 02b is the Head of PLG
  }

  /**
   * Evaluates product usage telemetry to identify Product-Qualified Leads (PQLs) and trigger in-app actions.
   */
  async evaluateProductTelemetry(telemetryData: any) {
    console.log(`[Head of PLG Agent] Evaluating product telemetry for account: ${telemetryData.account_id}...`);

    const prompt = `
      You are the Head of Product-Led Growth (PLG). You own product-led acquisition and expansion.
      Review this recent product telemetry data.
      
      Telemetry Data:
      ${JSON.stringify(telemetryData, null, 2)}
      
      Your goal is to identify if this account has reached a "PQL" (Product Qualified Lead) threshold.
      A PQL is defined as an account that has added more than 5 users, used the 'Premium Feature X' at least twice, or hit a usage limit.
      
      Decide whether to alert Sales (SDR Manager) for an upgrade conversation, or trigger an in-app messaging flow (Appcues) to drive further adoption.
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        is_pql: { type: "BOOLEAN", description: "True if the account meets PQL criteria." },
        decision: { 
          type: "STRING", 
          enum: ["alert_sales", "trigger_in_app_flow", "monitor"],
          description: "Action to take based on the usage data." 
        },
        rationale: { type: "STRING", description: "Why you made this decision." }
      },
      required: ["is_pql", "decision", "rationale"]
    };

    const evaluation = await this.think(prompt, schema);
    console.log(`[Head of PLG Agent] Decision: ${evaluation.decision}. Rationale: ${evaluation.rationale}`);

    // Track decision in Amplitude (Mock via Gateway)
    await this.useTool('Amplitude', {
      action: 'LOG_EVENT',
      event_type: 'PQL_Evaluated',
      account_id: telemetryData.account_id,
      result: evaluation.decision
    });

    if (evaluation.decision === 'alert_sales') {
      console.log(`[Head of PLG Agent] PQL identified! Alerting SDR Manager (03a)...`);
      await Orchestrator.dispatchTask(this.agentId, '03a', {
        title: `🔥 Hot PQL Alert: Account ${telemetryData.account_id}`,
        description: `Account has hit product limits or activation milestones. Rationale: ${evaluation.rationale}`,
        priority: 'high',
        input_data: telemetryData
      }, this.sessionId);
    } else if (evaluation.decision === 'trigger_in_app_flow') {
      console.log(`[Head of PLG Agent] Triggering Appcues flow to drive adoption...`);
      await this.useTool('Appcues', {
        action: 'TRIGGER_FLOW',
        flow_id: 'adoption_nurture_01',
        account_id: telemetryData.account_id
      });
    }

    return evaluation;
  }
}
