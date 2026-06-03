import { GoogleGenAI } from '@google/genai';

const project = process.env.GCP_PROJECT_ID || '';   // Required: set GCP_PROJECT_ID in .env.local
const location = process.env.GCP_LOCATION || 'us-central1';
const apiKey = process.env.GEMINI_API_KEY || '';

let clientInstance: any;

const hasCredentials = project && project !== 'your-gcp-project-id';

if (hasCredentials) {
  try {
    clientInstance = new GoogleGenAI({
      vertexai: true,
      project,
      location,
    });
  } catch (err) {
    console.warn('[vertexai] Failed to initialize GoogleGenAI client with Vertex AI, trying API key fallback...', err);
  }
}

if (!clientInstance && apiKey && apiKey !== 'PASTE_YOUR_GEMINI_API_KEY') {
  try {
    clientInstance = new GoogleGenAI({
      apiKey,
    });
    console.log('[vertexai] Initialized GoogleGenAI client using GEMINI_API_KEY (AI Studio fallback)');
  } catch (err) {
    console.warn('[vertexai] Failed to initialize GoogleGenAI client with GEMINI_API_KEY:', err);
  }
}

if (!clientInstance) {
  console.log('[vertexai] Using Mock GoogleGenAI client (offline/test mode)');
  clientInstance = {
    models: {
      generateContent: async ({ model, contents, config }: any) => {
        const text = contents ? String(contents) : '';
        let mockResponse = '{}';

        if (text.includes('Morning Sync') || text.includes('competitor') || text.includes('01')) {
          mockResponse = JSON.stringify({
            strategy: 'LegacyTech pricing drop of 20% matched by shift to premium value features. Retargeting enterprise and mid-market accounts.',
            delegations: ['01d', '01b']
          });
        } else if (text.includes('webinar') || text.includes('leads') || text.includes('03e')) {
          mockResponse = JSON.stringify({
            routed_outbound: 2,
            routed_nurture: 1
          });
        } else if (text.includes('GTM Automation') || text.includes('Ahrefs') || text.includes('03c')) {
          mockResponse = JSON.stringify({
            keyword_volume: '4.2k monthly searches',
            brief: 'Deploying agentic GTM workflows allows B2B SaaS teams to autonomously qualify, enrich, and nurture pipelines.'
          });
        } else if (text.includes('health check') || text.includes('Acme') || text.includes('04a')) {
          mockResponse = JSON.stringify({
            health_status: 'excellent',
            action_taken: 'Alerted Expansion AE (04c) due to maximum usage capacity hit'
          });
        } else if (text.includes('co-selling') || text.includes('02d') || text.includes('Snowflake') || text.includes('Overlap') || text.includes('Crossbeam')) {
          mockResponse = JSON.stringify({
            partnerOverlapMatch: true,
            warmIntroFeasible: true,
            introChannel: "Slack Shared Connect Channel with Snowflake Partner Account Lead (VP of Alliances)",
            coSellValueProposition: "Snowflake owns active customer relationship with Stripe. Synapse GTM OS integration with Snowflake allows Stripe to automate data sharing out-of-the-box.",
            recommendedNextStep: "Request partnership lead to trigger Slack joint introduction message with Snowflake AE."
          });
        } else if (text.includes('keyword') || text.includes('ad-copy') || text.includes('Ahrefs') || text.includes('sem-optimizer') || text.includes('SEM')) {
          mockResponse = JSON.stringify({
            keyword: "AI agents for GTM",
            volume: "8.4k",
            difficulty: 45,
            cpc: "$4.20",
            headlines: [
              "Scale Pipelines with GTM AI",
              "Synapse Autonomous GTM OS",
              "Qualify & Enrich Leads 24/7"
            ],
            descriptions: [
              "Deploy autonomous AI agents to qualify leads, enrich account data via Clay, and sync pipelines to HubSpot in real-time.",
              "Eliminate manual pipeline management. Integrate the 17-agent sales, marketing, and CS decision tree out-of-the-box."
            ],
            ctaUrl: "https://synapse.ai/demo"
          });
        } else if (text.includes('plg') || text.includes('amplitude') || text.includes('PQL') || text.includes('02b')) {
          mockResponse = JSON.stringify({
            isQualified: true,
            score: 94,
            matchedConstraints: "Workspace invites (8) > 5, features used (6) > 3",
            suggestedAction: "Enrich via Clay and create Enterprise Upsell Deal in HubSpot CRM",
            assignee: "Expansion AE (04c)"
          });
        } else if (text.includes('community') || text.includes('Discord') || text.includes('02c') || text.includes('forum')) {
          mockResponse = JSON.stringify({
            resolved: true,
            category: "Technical Support",
            ambassadorScore: 88,
            suggestedAnswer: "Hey there! Yes, Synapse GTM OS fully supports remote Server-Sent Events (SSE) connections. You can expose any agent by calling toA2a(agent, port) and mapping the route dynamically inside Next.js API networks. Let us know if you need our sample deployment template!",
            followUpAction: "Notify SDR Manager to flag as high-intent builder account"
          });
        } else if (text.includes('webinar') || text.includes('no-show') || text.includes('event') || text.includes('03d')) {
          mockResponse = JSON.stringify({
            noShowCount: 142,
            tier1NoShows: ["cyberdyne.com", "weyland-yutani.com"],
            followUpSubject: "Missed you at our GTM Automation Briefing",
            followUpTemplate: "Hi {{First_Name}},\n\nSorry you couldn't make it to our live session. We covered how autonomous AI agents automate Apollo lookup and Clay enrichments. Here is your custom replay link: https://synapse.ai/replay\n\nBest,\nField Operations Team",
            nextStep: "Trigger custom cold SDR sequence via Apollo.io"
          });
        }

        return {
          text: mockResponse
        };
      }
    }
  };
}

export const aiClient = clientInstance;

export const getGeminiPro = () => 'gemini-2.5-pro';
export const getGeminiFlash = () => 'gemini-2.5-flash';
