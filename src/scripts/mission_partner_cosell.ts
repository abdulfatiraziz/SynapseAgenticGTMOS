import { ToolGateway } from '../lib/tools/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runPartnerMission() {
  console.log('--- [Partnerships 02d] Native Co-sell Mission ---');
  
  try {
    // 1. Query HubSpot for Partner Deals
    console.log('\nStep 1: Auditing HubSpot for Partner-Influenced Deals...');
    const result = await ToolGateway.executeTool('02d', 'HubSpot', { 
      action: 'get_partner_deals' 
    });

    if (result.status === 'success') {
      const deals = result.data.deals;
      console.log(`✅ Success: Found ${deals.length} deals with Partner/Evangelist influence.`);

      // 2. Strategic Leverage
      console.log('\nStep 2: Drafting Co-selling Strategy for High-Value Overlaps...');
      
      for (const deal of deals) {
        if (deal.status === 'evangelist') {
          console.log(`🔥 STRATEGY: Deal "${deal.name}" is influenced by an Evangelist. Recommendation: Request an intro from ${deal.partner}.`);
        } else {
          console.log(`🤝 CO-SELL: Deal "${deal.name}" is a ${deal.partner} referral. Recommendation: Schedule joint discovery call.`);
        }
      }
    }
  } catch (err: any) {
    console.error('❌ Mission Failed:', err.message);
  }
}

runPartnerMission();
