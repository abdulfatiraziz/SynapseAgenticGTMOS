import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    // 1. Exchange code for tokens
    const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.HUBSPOT_CLIENT_ID!,
        client_secret: process.env.HUBSPOT_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/hubspot/callback`,
        code,
        code_verifier: process.env.HUBSPOT_CODE_VERIFIER!,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to exchange token');
    }

    // 2. Store tokens in Supabase
    const { error: dbError } = await supabase
      .from('integrations')
      .upsert({
        name: 'hubspot',
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
        config: { scopes: data.scope },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'name' });

    if (dbError) {
      throw dbError;
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/org-map?success=hubspot_connected`);

  } catch (err: any) {
    console.error('HubSpot OAuth Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
