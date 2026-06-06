import crypto from 'crypto';

/**
 * Checks if a token is empty, undefined, or matches typical local development placeholders.
 */
export function isPlaceholderOrMissingToken(token: string | undefined): boolean {
  if (!token) return true;
  const t = token.toLowerCase();
  return (
    t.includes('placeholder') ||
    t.includes('your_') ||
    t.includes('your-') ||
    t === 'true' ||
    t === 'false' ||
    t.length < 10
  );
}

/**
 * Validates a Bearer token in the Authorization header.
 * Automatically succeeds in local dev if no production key is configured.
 */
export function verifyBearerToken(req: Request): boolean {
  const expectedToken = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Local offline development fallback
  if (isPlaceholderOrMissingToken(expectedToken) || process.env.NODE_ENV === 'development') {
    return true;
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  return token === expectedToken;
}

/**
 * Generates an HMAC-SHA256 signature for a HITL decision.
 */
export function generateSignature(id: string, decision: string): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';
  return crypto
    .createHmac('sha256', key)
    .update(`${id}:${decision}`)
    .digest('hex');
}

/**
 * Verifies an HMAC-SHA256 signature for a HITL decision.
 * Automatically succeeds in local dev if no production key is configured.
 */
export function verifySignature(id: string, decision: string, signature: string | null): boolean {
  const expectedToken = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Local offline development fallback
  if (isPlaceholderOrMissingToken(expectedToken)) {
    return true;
  }

  if (!signature) {
    return false;
  }

  const expectedSignature = generateSignature(id, decision);
  
  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch {
    return false;
  }
}
