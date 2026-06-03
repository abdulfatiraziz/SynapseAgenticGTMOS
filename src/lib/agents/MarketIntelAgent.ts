import { BaseAgent } from './BaseAgent';
import { Orchestrator } from '../orchestration/orchestrator';

export class MarketIntelAgent extends BaseAgent {
  constructor(sessionId?: string) {
    super('01d', sessionId); // 01d is the Market Intelligence Analyst
  }

  /**
   * Processes a raw market signal (e.g., news article, job posting, funding round).
   * Calculates an intent score and dispatches it to RevOps if the score is high enough.
   */
  async processMarketSignal(signalData: any) {
    console.log(`[Market Intel] Scanning raw market signal for ${signalData.company_name}...`);

    const prompt = `
      You are the Market Intelligence Analyst. Your job is to analyze raw market signals and determine if they represent a buying opportunity.
      
      Our Ideal Customer Profile (ICP):
      - B2B Software or Enterprise Tech
      - Over 50 employees
      - Key triggers: Hiring for RevOps/Sales, Recent Series A/B funding, Implementation of complex CRMs.
      
      Raw Signal Data:
      ${JSON.stringify(signalData, null, 2)}
      
      Analyze the signal and calculate an intent score from 0 to 100 based on how well it matches our ICP and buying triggers.
      Provide a brief rationale for the score.
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        intent_score: { type: "INTEGER", description: "Calculated intent score (0-100)" },
        rationale: { type: "STRING", description: "Why this score was given based on the ICP and signal triggers." },
        is_actionable: { type: "BOOLEAN", description: "True if intent_score is >= 50" }
      },
      required: ["intent_score", "rationale", "is_actionable"]
    };

    // 1. Analyze the signal using Gemini
    console.log(`[Market Intel] Thinking... calculating intent score.`);
    const analysis = await this.think(prompt, schema);
    console.log(`[Market Intel] Scored ${analysis.intent_score}/100. Actionable: ${analysis.is_actionable}`);
    console.log(`[Market Intel] Rationale: ${analysis.rationale}`);

    // 2. Dispatch to RevOps (03e) if Actionable
    let taskId = null;
    if (analysis.is_actionable) {
      console.log(`[Market Intel] High intent detected. Dispatching to RevOps (03e)...`);
      
      // Structure the lead payload for RevOps
      const leadPayload = {
        company_name: signalData.company_name,
        industry: signalData.industry || 'Unknown',
        employee_count: signalData.employee_count || 0,
        intent_score: analysis.intent_score,
        source: signalData.source_type,
        signal_details: analysis.rationale
      };

      const task = await Orchestrator.dispatchTask(this.agentId, '03e', {
        title: `Actionable Market Signal: ${signalData.company_name}`,
        description: `Market Intel generated an intent score of ${analysis.intent_score}.`,
        priority: analysis.intent_score > 80 ? 'high' : 'medium',
        input_data: leadPayload
      }, this.sessionId);
      taskId = task.id;
    } else {
      console.log(`[Market Intel] Signal ignored. Intent score below threshold.`);
    }

    return {
      analysis,
      taskId
    };
  }
}
