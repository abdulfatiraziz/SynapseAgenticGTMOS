import { ToolGateway } from '../lib/tools/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runAlignmentMission() {
  console.log('--- [PLG 02b & Demand Gen 03b] Revenue Alignment Mission ---');
  
  try {
    console.log('\nStep 1: [Demand Gen 03b] Fetching GA4 Traffic Sources...');
    const ga4Data = await ToolGateway.executeTool('03b', 'GoogleAnalytics', { 
      action: 'get_traffic_sources' 
    });

    if (ga4Data.status === 'success') {
      console.log('✅ GA4 Data Retrieved.');

      console.log('\nStep 2: [Head of PLG 02b] Identifying High-Activity PQLs...');
      const posthogData = await ToolGateway.executeTool('02b', 'PostHog', { 
        action: 'identify_pqls' 
      });

      if (posthogData.status === 'success') {
        const pqls = posthogData.data.pqls;
        console.log('✅ PostHog Data Retrieved.');

        console.log('\nStep 3: Performing Strategic Attribution...');
        const sources = ga4Data.data.sources;
        const linkedin = sources.find((s: any) => s.source === 'linkedin');
        const cr = (linkedin.conversions / linkedin.users) * 100;
        
        console.log(`💡 INSIGHT: LinkedIn traffic conversion is ${cr.toFixed(1)}%.`);
        console.log(`💡 PQL ALERT: User "${pqls[0].email}" performed a "${pqls[0].event}".`);
      }
    }
  } catch (err: any) {
    console.error('❌ Mission Failed:', err.message);
  }
}

runAlignmentMission();
