import { ToolGateway } from '../lib/tools/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runDirectLinkedInMission() {
  console.log('--- [Content Lead 03c] Direct LinkedIn Performance Mission ---');
  
  try {
    // 1. Create Native Post
    console.log('\nStep 1: Publishing Direct LinkedIn Post...');
    const post = await ToolGateway.executeTool('03c', 'LinkedIn', { 
      action: 'create_post',
      content: 'B2B GTM is shifting from API-first to Agent-first. Here is why.'
    });

    if (post.status === 'success') {
      console.log(`✅ Success: Post Published. URN: ${post.data.urn}`);

      // 2. Fetch Native Engagement
      console.log('\nStep 2: Fetching Granular Engagement Metrics...');
      const engagement = await ToolGateway.executeTool('03c', 'LinkedIn', {
        action: 'get_engagement',
        post_id: post.data.urn
      });

      if (engagement.status === 'success') {
        console.log(`📊 LinkedIn Engagement: ${engagement.data.reactions} Reactions, ${engagement.data.comments} Comments.`);
        console.log('💡 Insight: High comment-to-reaction ratio indicates high-intent discussion.');
      }
    }
  } catch (err: any) {
    console.error('❌ Mission Failed:', err.message);
  }
}

runDirectLinkedInMission();
