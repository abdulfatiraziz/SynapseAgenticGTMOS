import { BaseAgent } from './BaseAgent';

export interface TraceAuditScorecard {
  plan_quality: { score: number; feedback: string };
  tool_usage: { score: number; feedback: string };
  context_handling: { score: number; feedback: string };
  efficiency: { score: number; feedback: string };
  overall_score: number;
  critical_anomalies: string[];
  recommendations: string[];
}

export class CriticAgent extends BaseAgent {
  constructor() {
    super('critic'); // 'critic' is the Critic Agent (Agent-as-a-Judge)
  }

  /**
   * Analyzes an execution trajectory (array of trace events) and outputs an audit scorecard.
   */
  async auditTrajectory(traces: any[]): Promise<TraceAuditScorecard> {
    console.log(`[Critic Agent] Auditing execution trajectory with ${traces.length} trace events...`);

    const prompt = `
      You are the Critic Agent (Agent-as-a-Judge) for our enterprise GTM system.
      Your task is to analyze the step-by-step execution trajectory of a playbook run and grade its performance.
      
      Review the list of chronological trace events (thoughts, tool starts, tool ends, tool errors/denials, security alerts):
      ${JSON.stringify(traces, null, 2)}
      
      Auditing Guidelines:
      1. Plan Quality: Was the initial thought/plan logical, aligned with ICP, and direct?
      2. Tool Usage: Did the agent choose the correct tools? Did it make redundant calls or parameterization mistakes?
      3. Context Handling: Did it utilize past session memories and system parameters effectively?
      4. Efficiency: How long did steps take (duration_ms)? Were there slow connections or loops?
      
      Output a structured JSON scorecard strictly conforming to our response schema.
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        plan_quality: {
          type: "OBJECT",
          properties: {
            score: { type: "INTEGER", description: "Grade from 0 to 100" },
            feedback: { type: "STRING", description: "Feedback on reasoning logical flow" }
          },
          required: ["score", "feedback"]
        },
        tool_usage: {
          type: "OBJECT",
          properties: {
            score: { type: "INTEGER", description: "Grade from 0 to 100" },
            feedback: { type: "STRING", description: "Feedback on tool selection and arguments" }
          },
          required: ["score", "feedback"]
        },
        context_handling: {
          type: "OBJECT",
          properties: {
            score: { type: "INTEGER", description: "Grade from 0 to 100" },
            feedback: { type: "STRING", description: "Feedback on RAG memory usage and inputs" }
          },
          required: ["score", "feedback"]
        },
        efficiency: {
          type: "OBJECT",
          properties: {
            score: { type: "INTEGER", description: "Grade from 0 to 100" },
            feedback: { type: "STRING", description: "Feedback on duration_ms and timing" }
          },
          required: ["score", "feedback"]
        },
        overall_score: { type: "INTEGER", description: "Weighted average score (0-100)" },
        critical_anomalies: { type: "ARRAY", items: { type: "STRING" }, description: "Specific anomalies or execution bugs flagged." },
        recommendations: { type: "ARRAY", items: { type: "STRING" }, description: "Concrete technical adjustments or prompt overrides to improve performance." }
      },
      required: [
        "plan_quality",
        "tool_usage",
        "context_handling",
        "efficiency",
        "overall_score",
        "critical_anomalies",
        "recommendations"
      ]
    };

    console.log(`[Critic Agent] Invoking judge model...`);
    const scorecard = await this.think(prompt, schema);
    console.log(`[Critic Agent] Trajectory Audit Complete. Overall Score: ${scorecard.overall_score}/100.`);
    return scorecard;
  }
}
