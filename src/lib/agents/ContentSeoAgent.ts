import { BaseAgent } from './BaseAgent';
import { Orchestrator } from '../orchestration/orchestrator';

export class ContentSeoAgent extends BaseAgent {
  constructor(sessionId?: string) {
    super('03c', sessionId); // 03c is the Content & SEO Lead
  }

  /**
   * Generates a content brief based on the current GTM Strategy and SEO data.
   */
  async generateContentBrief(strategyData: any) {
    console.log(`[Content & SEO Agent] Reviewing strategy to generate organic content brief...`);

    const prompt = `
      You are the Content & SEO Lead. You need to write a content brief that aligns with the CMO's new strategy.
      
      CMO Strategy:
      ${JSON.stringify(strategyData, null, 2)}
      
      Determine the best Top-of-Funnel (TOFU) blog post title and a list of 3 target SEO keywords that align with this strategy.
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        blog_title: { type: "STRING", description: "Catchy, SEO-optimized blog post title." },
        keywords: { 
          type: "ARRAY", 
          items: { type: "STRING" },
          description: "Top 3 SEO keywords to target." 
        },
        brief_summary: { type: "STRING", description: "A 2-sentence summary of what the article should cover." }
      },
      required: ["blog_title", "keywords", "brief_summary"]
    };

    console.log(`[Content & SEO Agent] Thinking... analyzing SEO clusters.`);
    const brief = await this.think(prompt, schema);
    console.log(`[Content & SEO Agent] Brief generated: "${brief.blog_title}"`);

    // Log the brief to Contentful via Gateway
    await this.useTool('Contentful', {
      action: 'CREATE_PAGE',
      title: `Content Brief: ${brief.blog_title}`,
      content: brief
    });

    // We can also simulate querying Ahrefs for keyword difficulty
    await this.useTool('Ahrefs', {
      action: 'CHECK_KEYWORD_DIFFICULTY',
      keywords: brief.keywords
    });

    return brief;
  }
}
