import { BaseAgent } from '../lib/agents/BaseAgent';
import { Orchestrator } from '../lib/orchestration/orchestrator';
import { SynapseConfig } from '../../synapse.config';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runSimulation() {
  console.log('🚀 --- STARTING SYNAPSE E2E DAILY SIMULATION --- 🚀\n');
  
  // Set budget appropriately for a massive stress test
  SynapseConfig.budgets.max_tokens_per_session = 100000;
  
  const results: any[] = [];

  try {
    // ---------------------------------------------------------
    // Scenario 1: Morning Sync (Strategy Layer)
    // ---------------------------------------------------------
    console.log('🌅 [SCENARIO 1] Morning Sync (Strategy Layer)');
    const cmo = new BaseAgent('01');
    const cmoPrompt = `A major competitor, LegacyTech, just dropped their pricing by 20%. 
    1. Delegate to Market Intel (01d) to research their new pricing page.
    2. Delegate to VP PMM (01b) to draft a competitive response brief.
    Use your tools to coordinate this.`;
    
    console.log('   → CMO (01) is thinking...');
    const cmoResult = await cmo.think(cmoPrompt, {
      type: 'object',
      properties: {
        strategy: { type: 'string' },
        delegations: { type: 'array', items: { type: 'string' } }
      }
    });
    console.log('   ✅ CMO completed Morning Sync.');
    results.push({ scenario: 1, agent: '01', status: 'PASS', summary: cmoResult.strategy });


    // ---------------------------------------------------------
    // Scenario 2: Lead Routing & Outbound (Execution Layer)
    // ---------------------------------------------------------
    console.log('\n📥 [SCENARIO 2] Lead Routing & Outbound (Execution Layer)');
    const revops = new BaseAgent('03e');
    const revopsPrompt = `We received 3 new leads from our webinar.
    Lead 1: VP of Ops at LogisticsCorp (Enterprise).
    Lead 2: Intern at StartupX (SMB).
    Lead 3: Director of Supply Chain at GlobalFreight (Mid-Market).
    Evaluate these leads. Route Lead 1 and 3 to SDR Manager (03a) for outbound.
    Route Lead 2 to Demand Gen (03b) for nurture. Use your tools to process this.`;
    
    console.log('   → RevOps (03e) is routing leads...');
    const revopsResult = await revops.think(revopsPrompt, {
      type: 'object',
      properties: {
        routed_outbound: { type: 'number' },
        routed_nurture: { type: 'number' }
      }
    });
    console.log(`   ✅ RevOps routed ${revopsResult.routed_outbound} to Outbound and ${revopsResult.routed_nurture} to Nurture.`);
    results.push({ scenario: 2, agent: '03e', status: 'PASS', summary: 'Leads routed successfully' });


    // ---------------------------------------------------------
    // Scenario 3: Content & Social Pulse (Channels Layer)
    // ---------------------------------------------------------
    console.log('\n✍️  [SCENARIO 3] Content & Social Pulse (Channels Layer)');
    const seo = new BaseAgent('03c');
    const seoPrompt = `We need a new blog post targeting 'Agentic GTM Automation'.
    Use Ahrefs to check keyword volume, then draft a 2-paragraph brief.
    Finally, coordinate with Community Lead (02c) to share it on Slack.`;
    
    console.log('   → Content & SEO (03c) is drafting...');
    const seoResult = await seo.think(seoPrompt, {
      type: 'object',
      properties: {
        keyword_volume: { type: 'string' },
        brief: { type: 'string' }
      }
    });
    console.log('   ✅ Content created and distributed.');
    results.push({ scenario: 3, agent: '03c', status: 'PASS', summary: seoResult.brief });


    // ---------------------------------------------------------
    // Scenario 4: Customer Health Check (CS Layer)
    // ---------------------------------------------------------
    console.log('\n🏥 [SCENARIO 4] Customer Health Check (CS Layer)');
    const vpcs = new BaseAgent('04a');
    const csPrompt = `Run a daily health check on Acme Corp.
    Use Gainsight/PostHog to check their adoption. 
    If health is bad, alert CSM (04b). If they are maxing out usage, alert Expansion AE (04c).`;
    
    console.log('   → VP CS (04a) is analyzing telemetry...');
    const csResult = await vpcs.think(csPrompt, {
      type: 'object',
      properties: {
        health_status: { type: 'string' },
        action_taken: { type: 'string' }
      }
    });
    console.log(`   ✅ VP CS finished analysis. Action: ${csResult.action_taken}`);
    results.push({ scenario: 4, agent: '04a', status: 'PASS', summary: csResult.action_taken });

    
    console.log('\n🏆 --- E2E SIMULATION COMPLETED SUCCESSFULLY --- 🏆\n');
    console.table(results);
    
  } catch (err: any) {
    console.error('\n❌ --- SIMULATION FAILED --- ❌');
    console.error(err.message);
    process.exit(1);
  }
}

runSimulation();
