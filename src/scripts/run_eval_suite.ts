/**
 * CLI entry point for the Synapse Agent Quality Gate.
 *
 * Usage:
 *   npx dotenv-cli -e .env.local -- npx tsx src/scripts/run_eval_suite.ts
 *   npx dotenv-cli -e .env.local -- npx tsx src/scripts/run_eval_suite.ts --mode=llm_judge
 *   npx dotenv-cli -e .env.local -- npx tsx src/scripts/run_eval_suite.ts --filter=01d
 *   npx dotenv-cli -e .env.local -- npx tsx src/scripts/run_eval_suite.ts --filter=safety --verbose
 *   npx dotenv-cli -e .env.local -- npx tsx src/scripts/run_eval_suite.ts --no-db
 */

import { runEvalSuite } from '../lib/evaluation/evalRunner';
import { DATASET_STATS } from '../lib/evaluation/goldenDataset';
import { writeFileSync } from 'fs';
import { join } from 'path';

// ─── Parse CLI args ───────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (name: string) => args.find(a => a.startsWith(`--${name}=`))?.split('=')[1];
const hasFlag = (name: string) => args.includes(`--${name}`);

const mode = (getArg('mode') ?? 'structural') as 'structural' | 'llm_judge';
const filter = getArg('filter');
const verbose = hasFlag('verbose');
const writeToDb = !hasFlag('no-db');
const saveReport = hasFlag('save-report');

// ─── Print dataset summary ────────────────────────────────────────────────────
console.log(`\n  Dataset: ${DATASET_STATS.total} golden cases`);
console.log(`  By agent: ${JSON.stringify(DATASET_STATS.by_agent)}`);
if (filter) console.log(`  Filter: "${filter}"`);

// ─── Run ──────────────────────────────────────────────────────────────────────
runEvalSuite({ mode, filter, writeToDb, verbose })
  .then(({ passed, report }) => {
    if (saveReport) {
      const outPath = join(process.cwd(), 'eval-report.md');
      writeFileSync(outPath, report, 'utf-8');
      console.log(`Report saved to: ${outPath}`);
    }
    process.exit(passed ? 0 : 1);
  })
  .catch(err => {
    console.error('[EvalSuite] Fatal error:', err);
    process.exit(1);
  });
