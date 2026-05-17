import * as dotenv from 'dotenv';
import path from 'path';
import { supabase } from '../lib/supabase';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkAgents() {
  const { data, error } = await supabase.from('agents').select('agent_id, name');
  if (error) {
    console.error("Error fetching agents:", error);
    return;
  }
  console.log("Current Agents in Database:");
  console.table(data);
}

checkAgents();
