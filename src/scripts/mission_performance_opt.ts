import { ToolGateway } from '../lib/tools/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runLiveAgentMission() {
  console.log('🚀 MISSION START: Lead Performance Optimization Loop');
  console.log('Agent: 03b (Demand Generation Manager)\n');

  try {
    // STEP 1: Fetch Meta Ads Insights
    console.log('--- [Step 1] Fetching Live Meta Ads Performance ---');
    const metaInsights = await ToolGateway.executeTool('03b', 'MetaAds', {
      endpoint: 'insights',
      fields: 'spend,impressions,clicks,cpc,reach',
      time_range: { 'since': '2024-05-01', 'until': '2024-05-16' }
    });

    if (metaInsights.status === 'success') {
      const data = metaInsights.data.data?.[0] || {};
      const cpc = parseFloat(data.cpc || '0');
      const spend = parseFloat(data.spend || '0');
      
      console.log(`✅ Performance Data Retrieved:`);
      console.log(`   Spend: $${spend}`);
      console.log(`   CPC: $${cpc.toFixed(2)}`);

      // STEP 2: Agent Logic (Optimization Check)
      const CPC_THRESHOLD = 2.50; // Max acceptable CPC
      console.log(`\n--- [Step 2] Analyzing Performance vs Threshold ($${CPC_THRESHOLD}) ---`);

      if (cpc > CPC_THRESHOLD || cpc === 0) {
        console.log(`⚠️ Alert: CPC ($${cpc.toFixed(2)}) exceeds target. Initiating Optimization Protocol...`);

        // STEP 3: Trigger Make.com Automation
        console.log('\n--- [Step 3] Triggering Make.com Optimization Scenario ---');
        const makeTrigger = await ToolGateway.executeTool('03b', 'Make', {
          action_id: 'performance_alert_handler',
          inputs: {
            agent_id: '03b',
            alert_type: 'HIGH_CPC_ALERT',
            metric_value: cpc.toFixed(2),
            ad_account: 'Synapse_Main_Account',
            recommmendation: 'Pause low-performing ad sets and reallocate budget to Search Brand Core.'
          }
        });

        if (makeTrigger.status === 'success') {
          console.log('✅ Mission Accomplished: Optimization scenario dispatched to Make.com.');
        } else {
          console.log('❌ Make.com Trigger Failed:', makeTrigger.message);
        }
      } else {
        console.log('✅ Performance is within targets. No action required.');
      }
    } else {
      console.log('❌ Failed to fetch Meta Ads data:', metaInsights.message);
    }
  } catch (err: any) {
    console.error('❌ Mission Aborted due to Error:', err.message);
  }

  console.log('\n🚀 MISSION COMPLETE');
}

runLiveAgentMission();
