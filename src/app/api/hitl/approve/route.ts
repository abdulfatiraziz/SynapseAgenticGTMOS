import { NextRequest, NextResponse } from 'next/server';
import { HitlGateway } from '../../../../lib/hitl/hitlGateway';
import { verifySignature, isPlaceholderOrMissingToken } from '@lib/security/authHelper';

/**
 * GET /api/hitl/approve?id=<approvalId>&decision=approved|denied&by=<userId>
 *
 * Called when a user clicks Approve or Deny in the Slack message.
 * Records the decision in Supabase — the polling loop in HitlGateway
 * picks this up and unblocks the waiting tool call.
 *
 * Note: This uses GET (not POST) intentionally — Slack button URLs
 * use GET requests. In production, protect this with a Slack signing
 * secret verification or a short-lived signed token in the URL.
 */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const decision = req.nextUrl.searchParams.get('decision') as 'approved' | 'denied' | null;
  const by = req.nextUrl.searchParams.get('by') ?? 'slack_user';
  const note = req.nextUrl.searchParams.get('note') ?? undefined;

  if (!id || !decision || !['approved', 'denied'].includes(decision)) {
    return NextResponse.json(
      { error: 'Required params: id, decision (approved|denied)' },
      { status: 400 }
    );
  }

  const signature = req.nextUrl.searchParams.get('signature');
  if (!verifySignature(id, decision, signature)) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing signature' },
      { status: 401 }
    );
  }

  await HitlGateway.recordDecision(id, decision, by, note);

  // Return a friendly confirmation page (rendered in browser when user clicks Slack button)
  const icon = decision === 'approved' ? '✅' : '❌';
  const message = decision === 'approved'
    ? 'Action approved. The agent will proceed.'
    : 'Action denied. The agent has been blocked.';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Synapse HITL — Decision Recorded</title>
  <style>
    body { font-family: -apple-system, sans-serif; display: flex; justify-content: center;
           align-items: center; height: 100vh; margin: 0; background: #f8fafc; }
    .card { background: white; border-radius: 12px; padding: 40px 48px; text-align: center;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08); max-width: 400px; }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 20px; margin: 0 0 8px; color: #1a202c; }
    p { color: #718096; margin: 0; }
    .badge { display: inline-block; margin-top: 16px; padding: 4px 12px; border-radius: 20px;
             font-size: 12px; font-weight: 600; background: ${decision === 'approved' ? '#c6f6d5' : '#fed7d7'};
             color: ${decision === 'approved' ? '#276749' : '#9b2c2c'}; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h1>Decision Recorded</h1>
    <p>${message}</p>
    <div class="badge">${decision.toUpperCase()}</div>
    <br><br>
    <p style="font-size: 12px; color: #a0aec0">You can close this tab.</p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}

/** POST /api/hitl/approve — Alternative for Slack Interactive Components */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { approval_id, decision, decided_by, note, signature } = body;

    if (!approval_id || !decision) {
      return NextResponse.json({ error: 'approval_id and decision required' }, { status: 400 });
    }

    // Auth verification
    const expectedToken = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const isTokenConfigured = !isPlaceholderOrMissingToken(expectedToken);
    
    let isAuthorized = false;
    if (!isTokenConfigured) {
      isAuthorized = true;
    } else {
      // 1. Check Bearer token
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader === `Bearer ${expectedToken}`) {
        isAuthorized = true;
      }
      // 2. Check signature in body
      if (!isAuthorized && signature) {
        if (verifySignature(approval_id, decision, signature)) {
          isAuthorized = true;
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await HitlGateway.recordDecision(approval_id, decision, decided_by ?? 'api', note);
    return NextResponse.json({ ok: true, decision });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
