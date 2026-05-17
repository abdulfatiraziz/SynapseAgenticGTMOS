import { GoogleGenAI } from '@google/genai';

const project = process.env.GCP_PROJECT_ID || 'level-up-life-j44w4';
const location = process.env.GCP_LOCATION || 'us-central1';

// Initialize the client for Vertex AI
export const aiClient = new GoogleGenAI({
  vertexai: { project, location },
  project,
  location
});

export const getGeminiPro = () => aiClient.models.get('gemini-3.1-pro');
export const getGeminiFlash = () => aiClient.models.get('gemini-3.1-flash-lite');
