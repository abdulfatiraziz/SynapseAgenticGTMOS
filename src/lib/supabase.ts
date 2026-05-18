import { createClient } from '@supabase/supabase-js';

// Fallback to a placeholder URL during build-time static analysis.
// At runtime, NEXT_PUBLIC_SUPABASE_URL must be set in the environment.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
