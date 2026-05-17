const { GoogleGenAI } = require('@google/genai');
const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

async function healthCheck() {
  console.log('🚀 Starting Synapse Enterprise Health Check (2026 Attempt 4)...\n');

  // 1. Supabase Check
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

  console.log('📡 Checking Supabase Connection...');
  const { data: agents, error: supabaseError } = await supabase.from('agents').select('*');

  if (supabaseError) {
    console.error('❌ Supabase Error:', supabaseError.message);
  } else {
    console.log(`✅ Supabase Connected! Found ${agents.length} agents in the database.`);
  }

  // 2. Gemini 3.1 Check
  console.log('\n🧠 Checking Gemini 3.1 Flash Lite (Vertex AI) Connection...');
  try {
    // Attempting the "vertexai: true" pattern
    const aiClient = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCP_PROJECT_ID,
      location: process.env.GCP_LOCATION || 'us-central1',
    });

    console.log('⏳ Sending test prompt to Gemini 3.1...');
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: 'Verify Synapse GTM System status.',
    });

    console.log(`✅ Vertex AI Online! Response: "${response.text.trim()}"`);
  } catch (error) {
    console.error('❌ Vertex AI Error:', error.message);
    console.log('💡 Note: Trying the "vertexai: { project, location }" pattern next if this fails...');
  }

  console.log('\n🏁 Health Check Complete.');
}

healthCheck();
