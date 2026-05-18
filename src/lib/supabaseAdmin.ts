import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Lazy Supabase admin client factory.
 *
 * Creates the client on first call (at request time), NOT at module load.
 * This prevents build-time errors when env vars aren't set during
 * Next.js static page data collection on Vercel.
 *
 * Usage: const db = getSupabaseAdmin();
 */
let _adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_adminClient) return _adminClient;

  let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
    console.warn(`[Supabase Admin] Invalid or missing URL. Falling back to placeholder for build.`);
    url = 'https://placeholder.supabase.co';
  }
  
  if (!key) {
    console.warn('[Supabase Admin] Missing Service Role Key. Falling back to placeholder for build.');
    key = 'placeholder-key';
  }

  _adminClient = createClient(url, key);
  return _adminClient;
}
