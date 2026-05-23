import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@lib/supabaseAdmin';
import { verifyBearerToken } from '@lib/security/authHelper';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('playbooks')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, playbooks: data ?? [] });
  } catch (err: any) {
    console.warn('[api/playbooks] Database query failed or database not configured:', err.message);
    // Clean fallback for offline/local development: return empty array with success
    return NextResponse.json({ success: true, playbooks: [], note: 'Database offline fallback' });
  }
}

export async function POST(request: Request) {
  try {
    if (!verifyBearerToken(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, category, description, nodes, connections, steps } = body;

    if (!id || !name || !category || !description) {
      return NextResponse.json({ success: false, error: 'Missing required fields (id, name, category, description)' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('playbooks')
      .upsert({
        id,
        name,
        category,
        description,
        nodes: nodes ?? [],
        connections: connections ?? [],
        steps: steps ?? [],
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, playbook: data?.[0] });
  } catch (err: any) {
    console.error('[api/playbooks] Failed to save playbook:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!verifyBearerToken(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing playbook ID parameter' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('playbooks')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, message: `Playbook ${id} deleted successfully` });
  } catch (err: any) {
    console.error('[api/playbooks] Failed to delete playbook:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
