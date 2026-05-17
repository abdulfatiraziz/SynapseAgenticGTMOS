import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { ToolGateway } from '../lib/tools/gateway';

const HUB_PAGE_ID = '362bf56c1add8013a5f7d3daddf66bb1';

const STRATEGY_PAGES = [
  {
    title: "Ideal Customer Profile (ICP)",
    icon: "🎯",
    content: [
      { type: "heading_1", text: "Target Accounts (Tier 1)" },
      { type: "bulleted_list_item", text: "Industry: B2B SaaS, Fintech, AI Infra" },
      { type: "bulleted_list_item", text: "Stage: Series B to Series D" },
      { type: "bulleted_list_item", text: "Headcount: 100 - 500 employees" },
      { type: "bulleted_list_item", text: "Tech Stack: HubSpot/Salesforce, Apollo, Gong" },
      { type: "heading_2", text: "Key Personas" },
      { type: "bulleted_list_item", text: "Primary: VP of Sales, Head of Revenue Operations" },
      { type: "bulleted_list_item", text: "Secondary: CMO, VP of Demand Gen" }
    ]
  },
  {
    title: "Messaging & Positioning",
    icon: "💬",
    content: [
      { type: "heading_1", text: "Core Value Proposition" },
      { type: "paragraph", text: "Synapse AI provides an autonomous 17-agent GTM team that manages your entire revenue engine—from discovery to retention—without increasing headcount." },
      { type: "heading_2", text: "The Narrative" },
      { type: "bulleted_list_item", text: "Traditional GTM is broken by human latency." },
      { type: "bulleted_list_item", text: "Synapse AI agents work 24/7 with zero data rot." },
      { type: "bulleted_list_item", text: "Outcome-driven: We don't sell software; we sell pipeline." }
    ]
  },
  {
    title: "Pricing & Packaging",
    icon: "💰",
    content: [
      { type: "heading_1", text: "Unit Economics" },
      { type: "paragraph", text: "Our pricing is designed to align with your growth. No seat-based costs." },
      { type: "heading_2", text: "Packages" },
      { type: "bulleted_list_item", text: "Growth: $2,500/mo (Includes Outbound + HubSpot Sync)" },
      { type: "bulleted_list_item", text: "Enterprise: $5,000/mo (Full 17-agent ecosystem + Custom Workflows)" },
      { type: "bulleted_list_item", text: "Performance: Custom % of generated pipeline (The 'Skin in the Game' model)" }
    ]
  },
  {
    title: "GTM Guidelines",
    icon: "📜",
    content: [
      { type: "heading_1", text: "Agent Interaction Protocol" },
      { type: "bulleted_list_item", text: "Tone: Professional, expert, and data-driven." },
      { type: "bulleted_list_item", text: "Rule: Every lead must be enriched by Clay before outreach." },
      { type: "bulleted_list_item", text: "Rule: Any discount > 20% requires manual human approval via Slack." },
      { type: "bulleted_list_item", text: "Safety: Never mention competitor pricing directly; focus on value gap." }
    ]
  }
];

async function bootstrapNotion() {
  console.log("🚀 Starting Notion Strategy Bootstrapping...\n");

  try {
    for (const page of STRATEGY_PAGES) {
      console.log(`📡 Creating Page: ${page.title}...`);
      
      const result = await ToolGateway.executeTool('01', 'Notion', {
        method: 'POST',
        endpoint: '/v1/pages',
        body: {
          parent: { page_id: HUB_PAGE_ID },
          icon: { type: "emoji", emoji: page.icon },
          properties: {
            title: [
              {
                text: { content: page.title }
              }
            ]
          },
          children: page.content.map(c => ({
            object: "block",
            type: c.type,
            [c.type]: {
              rich_text: [{ type: "text", text: { content: c.text } }]
            }
          }))
        }
      });

      if (result.status === 'success') {
        console.log(`   ✨ Created! URL: ${result.data.url}`);
      } else {
        console.error(`   ❌ Failed:`, JSON.stringify(result.data));
      }
    }

    console.log("\n🎉 Notion Bedrock is ready! Your agents now have a brain.");

  } catch (err: any) {
    console.error("❌ Bootstrapping Failed:", err.message);
  }
}

bootstrapNotion();
