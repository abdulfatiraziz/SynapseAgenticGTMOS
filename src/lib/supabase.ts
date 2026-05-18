import { createClient } from '@supabase/supabase-js';

// Fallback to a placeholder URL during build-time static analysis.
// At runtime, NEXT_PUBLIC_SUPABASE_URL must be set in the environment.
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Ensure the URL is valid to prevent build-time crashes on Vercel
if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  console.warn(`[Supabase] Invalid URL provided: "${supabaseUrl}". Falling back to placeholder for build.`);
  supabaseUrl = 'https://placeholder.supabase.co';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
