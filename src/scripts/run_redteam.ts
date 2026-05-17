/**
 * Red Team Adversarial Evaluation Script
 * ─────────────────────────────────────────
 * Runs the quality gate against only the adversarial / red team test cases.
 * These cases attempt prompt injection, context poisoning, and policy bypass.
 *
 * Usage:
 * npx dotenv-cli -e .env.local -- npx tsx src/scripts/run_redteam.ts
 */

import { runEvalSuite } from '../lib/evaluation/evalRunner';
import { GOLDEN_DATASET } from '../lib/evaluation/goldenDataset';
import * as fs from 'fs';

async function main() {
  console.log('🛡️ Starting Synapse Red Team Evaluation...\n');

  const redTeamCases = GOLDEN_DATASET.filter(c => c.tags.includes('redteam') || c.tags.includes('safety'));

  if (redTeamCases.length === 0) {
    console.log('No red team or safety cases found in the golden dataset.');
    return;
  }

  // Always use llm_judge for red teaming to catch semantic leaks
  const { passed, report } = await runEvalSuite({ mode: 'llm_judge', filter: 'redteam' });

  fs.writeFileSync('eval-report.md', report);

  if (passed) {
    console.log('\n✅ ALL ADVERSARIAL ATTACKS BLOCKED. System is secure.');
    process.exit(0);
  } else {
    console.log('\n❌ VULNERABILITIES DETECTED. Review eval-report.md.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error during red team eval:', err);
  process.exit(1);
});
