import { CriticAgent } from '../lib/agents/CriticAgent';

async function runAudit() {
  console.log('=== [GTM Agent-as-a-Judge Trajectory Audit] ===');

  const critic = new CriticAgent();
  await critic.initialize();

  // Create a realistic GTM playbook execution trajectory to audit
  const mockTraces = [
    {
      event_type: 'think_start',
      input_summary: 'Target Account: TechCorp (Series B SaaS, 120 employees). Prepare personalized email outbound targeting VP sales.',
      status: 'success',
      timestamp: new Date().toISOString()
    },
    {
      event_type: 'think_end',
      output_summary: 'Thought: Let us use Apollo search to find the name of the VP Sales at TechCorp, then Clay to verify email, then Notion to write the sequence draft.',
      duration_ms: 1200,
      token_count: 850,
      status: 'success',
      timestamp: new Date().toISOString()
    },
    {
      event_type: 'tool_start',
      tool_name: 'Apollo_search_people',
      input_summary: 'company_name: TechCorp, title: VP Sales',
      status: 'success',
      timestamp: new Date().toISOString()
    },
    {
      event_type: 'tool_end',
      tool_name: 'Apollo_search_people',
      output_summary: 'Status: 200 OK. Found Contact: John Doe, Email: john@techcorp.com, Job Title: VP of Global Sales.',
      duration_ms: 3200,
      status: 'success',
      timestamp: new Date().toISOString()
    },
    {
      event_type: 'tool_start',
      tool_name: 'Notion_create_page',
      input_summary: 'parent_id: Q3_sequences, title: TechCorp John Doe Outreach, content: Personalized draft sequence.',
      status: 'success',
      timestamp: new Date().toISOString()
    },
    {
      event_type: 'tool_end',
      tool_name: 'Notion_create_page',
      output_summary: 'Status: 200 OK. Page created successfully.',
      duration_ms: 1500,
      status: 'success',
      timestamp: new Date().toISOString()
    },
    {
      event_type: 'session_end',
      status: 'success',
      timestamp: new Date().toISOString()
    }
  ];

  try {
    const scorecard = await critic.auditTrajectory(mockTraces);
    console.log('\n=== [AUDIT SCORECARD RESULTS] ===');
    console.log(`Overall Score: ${scorecard.overall_score}/100`);
    console.log('\n--- 4-Pillar Performance Grades ---');
    console.log(`Plan Quality:     ${scorecard.plan_quality.score}/100 - ${scorecard.plan_quality.feedback}`);
    console.log(`Tool Usage:       ${scorecard.tool_usage.score}/100 - ${scorecard.tool_usage.feedback}`);
    console.log(`Context Handling: ${scorecard.context_handling.score}/100 - ${scorecard.context_handling.feedback}`);
    console.log(`Efficiency:       ${scorecard.efficiency.score}/100 - ${scorecard.efficiency.feedback}`);

    console.log('\n--- Flaged Anomalies ---');
    if (scorecard.critical_anomalies.length > 0) {
      scorecard.critical_anomalies.forEach((a, i) => console.log(`${i+1}. [ANOMALY] ${a}`));
    } else {
      console.log('None.');
    }

    console.log('\n--- Recommendations for Optimization ---');
    scorecard.recommendations.forEach((r, i) => console.log(`${i+1}. ${r}`));
  } catch (err: any) {
    console.error('Audit failed:', err.message);
  }
}

runAudit().catch(err => {
  console.error('Fatal error running critic test:', err);
  process.exit(1);
});
