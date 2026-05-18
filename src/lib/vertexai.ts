import { GoogleGenAI } from '@google/genai';

const project = process.env.GCP_PROJECT_ID || '';   // Required: set GCP_PROJECT_ID in .env.local
const location = process.env.GCP_LOCATION || 'us-central1';

// Initialize the client for Vertex AI
// vertexai: true enables Vertex AI mode; project + location are top-level constructor params
export const aiClient = new GoogleGenAI({
  vertexai: true,
  project,
  location,
});

export const getGeminiPro = () => 'gemini-2.5-pro';
export const getGeminiFlash = () => 'gemini-2.5-flash';
