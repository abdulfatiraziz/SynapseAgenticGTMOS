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
        } else if (text.includes('co-selling') || text.includes('02d') || text.includes('Snowflake') || text.includes('Overlap')) {
          mockResponse = JSON.stringify({
            partnerOverlapMatch: true,
            warmIntroFeasible: true,
            introChannel: "Slack Shared Connect Channel with Snowflake Partner Account Lead (VP of Alliances)",
            coSellValueProposition: "Snowflake owns active customer relationship with Stripe. Synapse GTM OS integration with Snowflake allows Stripe to automate data sharing out-of-the-box.",
            recommendedNextStep: "Request partnership lead to trigger Slack joint introduction message with Snowflake AE."
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
