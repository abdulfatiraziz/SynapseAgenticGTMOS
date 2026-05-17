import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { supabase } from '../lib/supabase';

async function testHubSpotLive() {
  console.log("🚀 Testing Live HubSpot Integration...\n");

  try {
    // 1. Fetch access token from Supabase
    const { data: integration, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('name', 'hubspot')
      .single();

    if (error || !integration) {
      throw new Error("HubSpot integration not found in database. Did you authorize the app?");
    }

    console.log("✅ Retrieved access token from Supabase.");

    // 2. Call HubSpot API (Get first 5 contacts)
    console.log("📡 Fetching latest 5 contacts from HubSpot...");
    
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts?limit=5', {
      headers: {
        'Authorization': `Bearer ${integration.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HubSpot API Error: ${data.message || response.statusText}`);
    }

    // 3. Print Results
    console.log(`\n🎉 Success! Found ${data.results.length} contacts.`);
    
    if (data.results.length > 0) {
      console.log("\nSample Contacts:");
      data.results.forEach((contact: any, index: number) => {
        console.log(`${index + 1}. ID: ${contact.id} | Properties:`, contact.properties);
      });
    } else {
      console.log("No contacts found in your portal yet.");
    }

  } catch (err: any) {
    console.error("❌ Live Test Failed:", err.message);
  }
}

testHubSpotLive();
