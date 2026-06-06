import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyBearerToken } from '@lib/security/authHelper';

export const dynamic = 'force-dynamic';

const ENV_PATH = path.join(process.cwd(), '.env.local');

// Helper to parse key-value pairs from .env format
function parseEnv(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }
      result[key] = value;
    }
  }
  return result;
}

// Helper to serialize key-value pairs back to .env format
function serializeEnv(existingContent: string, updates: Record<string, string>): string {
  let content = existingContent;
  const parsed = parseEnv(content);
  
  for (const [key, val] of Object.entries(updates)) {
    // If key has placeholder, skip updating it
    if (val === '••••••••') continue;
    
    if (parsed[key] !== undefined) {
      // Key exists, replace it in the file text
      const regex = new RegExp(`^${key}\\s*=.*$`, 'm');
      content = content.replace(regex, `${key}=${val}`);
    } else {
      // Key does not exist, append to end of file
      if (content && !content.endsWith('\n')) {
        content += '\n';
      }
      content += `${key}=${val}\n`;
    }
  }
  return content;
}

export async function GET() {
  try {
    let content = '';
    if (fs.existsSync(ENV_PATH)) {
      content = fs.readFileSync(ENV_PATH, 'utf-8');
    } else {
      // Fallback to example if local doesn't exist
      const examplePath = path.join(process.cwd(), '.env.example');
      if (fs.existsSync(examplePath)) {
        content = fs.readFileSync(examplePath, 'utf-8');
      }
    }
    const env = parseEnv(content);
    
    // Return keys and masked value indicators
    const result: Record<string, { exists: boolean, value: string }> = {};
    for (const [key, value] of Object.entries(env)) {
      result[key] = {
        exists: value.trim().length > 0 && !value.includes('your_') && !value.includes('placeholder'),
        value: value.trim().length > 0 && !value.includes('your_') && !value.includes('placeholder') ? '••••••••' : ''
      };
    }
    return NextResponse.json({ success: true, credentials: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!verifyBearerToken(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { credentials } = body;

    if (!credentials) {
      return NextResponse.json({ success: false, error: 'No credentials provided' }, { status: 400 });
    }

    let existingContent = '';
    if (fs.existsSync(ENV_PATH)) {
      existingContent = fs.readFileSync(ENV_PATH, 'utf-8');
    } else {
      const examplePath = path.join(process.cwd(), '.env.example');
      if (fs.existsSync(examplePath)) {
        existingContent = fs.readFileSync(examplePath, 'utf-8');
      }
    }

    const updatedContent = serializeEnv(existingContent, credentials);
    fs.writeFileSync(ENV_PATH, updatedContent, 'utf-8');

    return NextResponse.json({ success: true, message: 'Credentials updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
