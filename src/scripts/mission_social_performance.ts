import { ToolGateway } from '../lib/tools/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runSocialMission() {
  console.log('--- [Content Lead 03c] Social Performance & Optimization Mission ---');
  
  try {
    // 1. Analyze Performance
    console.log('\nStep 1: Fetching Omni-channel Social Performance...');
    const performance = await ToolGateway.executeTool('03c', 'SocialHub', { 
      action: 'get_performance',
      time_range: 'last_30_days'
    });

    if (performance.status === 'success') {
      const topPost = performance.data.top_performing_post;
      console.log(`✅ Performance Retrieved. Top Platform: LinkedIn (Avg CTR: ${performance.data.summary.avg_ctr})`);
      console.log(`🔥 Top Performing Content: "${topPost.content}"`);

      // 2. Optimization Loop: Create Follow-up Post
      console.log('\nStep 2: Scheduling Optimized Follow-up Post...');
      const schedulePost = await ToolGateway.executeTool('03c', 'SocialHub', {
        action: 'post_content',
        platform: ['LinkedIn', 'Twitter'],
        content: `Following up on our top-performing topic: ${topPost.content}. Here are 3 more ways to optimize your GTM budget...`
      });

      if (schedulePost.status === 'success') {
        console.log(`✅ Success: Follow-up post scheduled with ID: ${schedulePost.data.post_id}`);
      }
    }
  } catch (err: any) {
    console.error('❌ Mission Failed:', err.message);
  }
}

runSocialMission();
