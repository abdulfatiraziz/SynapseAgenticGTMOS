const { GoogleGenAI } = require('@google/genai');
require('dotenv').config({ path: './.env.local' });

async function listModels() {
  try {
    const aiClient = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCP_PROJECT_ID,
      location: process.env.GCP_LOCATION || 'us-central1',
    });

    const response = await aiClient.models.list();
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listModels();
