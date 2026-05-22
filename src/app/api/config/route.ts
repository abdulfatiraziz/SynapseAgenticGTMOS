import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { SynapseConfig } from '../../../../synapse.config';
import { verifyBearerToken } from '@lib/security/authHelper';

export const dynamic = 'force-dynamic';

const CONFIG_PATH = path.join(process.cwd(), 'synapse.config.ts');

export async function GET() {
  try {
    // Return the current live configuration
    return NextResponse.json({ success: true, config: SynapseConfig });
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
    const { config } = body;

    if (!config) {
      return NextResponse.json({ success: false, error: 'No configuration provided' }, { status: 400 });
    }

    // Read the current file content to preserve the top comments and type definitions
    if (!fs.existsSync(CONFIG_PATH)) {
      return NextResponse.json({ success: false, error: 'Config file not found on disk' }, { status: 404 });
    }

    const currentFileContent = fs.readFileSync(CONFIG_PATH, 'utf-8');

    // Locate the start of the configuration block
    const configBlockStartIndicator = 'export const SynapseConfig: SynapseConfiguration = {';
    const index = currentFileContent.indexOf(configBlockStartIndicator);

    if (index === -1) {
      return NextResponse.json({
        success: false,
        error: 'Could not locate the SynapseConfig export block in synapse.config.ts'
      }, { status: 500 });
    }

    // Extract everything up to "export const SynapseConfig: SynapseConfiguration = "
    const fileHeader = currentFileContent.substring(0, index);

    // Format the config object nicely as a JS object literal
    const serializedConfig = JSON.stringify(config, null, 2);

    // Reconstruct the file content
    const updatedFileContent = `${fileHeader}export const SynapseConfig: SynapseConfiguration = ${serializedConfig};

// ─── Helper Functions ─────────────────────────────────────────────────────────

/** Returns the effective tool mode for a given tool name */
export function getToolMode(toolName: string): ToolMode {
  return SynapseConfig.tools.overrides[toolName] ?? SynapseConfig.tools.default_mode;
}

/** Returns true if this tool call should be HITL-gated */
export function isHitlGated(action: string): boolean {
  if (!SynapseConfig.hitl.enabled) return false;
  return SynapseConfig.hitl.gates.some(gate =>
    action.toLowerCase().includes(gate.toLowerCase())
  );
}

/** Returns true if the given agent ID is active */
export function isAgentActive(agentId: string): boolean {
  return SynapseConfig.agents.active.includes(agentId);
}
`;

    // Write back to disk
    fs.writeFileSync(CONFIG_PATH, updatedFileContent, 'utf-8');

    return NextResponse.json({ success: true, message: 'Configuration updated and persisted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
