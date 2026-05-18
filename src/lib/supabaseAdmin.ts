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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      '[Supabase] NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables.'
    );
  }

  _adminClient = createClient(url, key);
  return _adminClient;
}
