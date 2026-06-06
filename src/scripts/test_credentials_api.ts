import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:3000/api/config/credentials';
const ENV_PATH = path.join(process.cwd(), '.env.local');

async function runTest() {
  console.log('\n🚀 Starting E2E Integration Test for GTM Credentials Configuration API...\n');

  // Backup existing .env.local
  let originalEnv = '';
  const envExists = fs.existsSync(ENV_PATH);
  if (envExists) {
    originalEnv = fs.readFileSync(ENV_PATH, 'utf-8');
    console.log('💾 Backed up existing .env.local');
  } else {
    console.log('ℹ️ No existing .env.local found. Will create one during test.');
  }

  // Step 1: Fetch current credentials
  console.log('📡 [1/5] Fetching current credentials status from Next.js server...');
  let initialRes;
  try {
    const res = await fetch(API_BASE);
    initialRes = await res.json();
  } catch (error: any) {
    console.error(`❌ Error connecting to development server at ${API_BASE}. Make sure 'npm run dev' is running!`);
    console.error(error.message);
    process.exit(1);
  }

  if (!initialRes.success) {
    console.error('❌ Failed to fetch credentials. Server response:', initialRes);
    process.exit(1);
  }

  console.log('✅ Connection established! Current credentials parsed keys count:', Object.keys(initialRes.credentials || {}).length);

  // Step 2: Post updates to credentials
  console.log('\n📝 [2/5] Updating test credentials (APOLLO_API_KEY & AHREFS_API_KEY)...');
  const updates = {
    APOLLO_API_KEY: 'test-apollo-key-12345',
    AHREFS_API_KEY: 'test-ahrefs-key-abcde'
  };

  const updateRes = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credentials: updates })
  });

  const updateResult = await updateRes.json();
  if (!updateResult.success) {
    console.error('❌ Failed to update credentials:', updateResult);
    // Restore backup
    if (envExists) fs.writeFileSync(ENV_PATH, originalEnv, 'utf-8');
    process.exit(1);
  }
  console.log('✅ POST /api/config/credentials returned success.');

  // Step 3: Verify disk persistence
  console.log('\n📂 [3/5] Verifying environment persistence on local disk (.env.local)...');
  if (!fs.existsSync(ENV_PATH)) {
    console.error('❌ .env.local file was not created on disk!');
    if (envExists) fs.writeFileSync(ENV_PATH, originalEnv, 'utf-8');
    process.exit(1);
  }

  const fileContent = fs.readFileSync(ENV_PATH, 'utf-8');
  if (fileContent.includes('APOLLO_API_KEY=test-apollo-key-12345') && fileContent.includes('AHREFS_API_KEY=test-ahrefs-key-abcde')) {
    console.log('✅ Credentials successfully persisted to .env.local on disk!');
  } else {
    console.error('❌ .env.local does not contain the updated credential values! Content:\n', fileContent);
    if (envExists) fs.writeFileSync(ENV_PATH, originalEnv, 'utf-8');
    process.exit(1);
  }

  // Step 4: Verify masking on GET
  console.log('\n🔒 [4/5] Verifying credential masking (••••••••) on GET...');
  const secondRes = await fetch(API_BASE);
  const secondResult = await secondRes.json();
  if (!secondResult.success) {
    console.error('❌ Failed to fetch credentials after update:', secondResult);
    if (envExists) fs.writeFileSync(ENV_PATH, originalEnv, 'utf-8');
    process.exit(1);
  }

  const apolloCred = secondResult.credentials.APOLLO_API_KEY;
  const ahrefsCred = secondResult.credentials.AHREFS_API_KEY;

  if (apolloCred?.value === '••••••••' && ahrefsCred?.value === '••••••••') {
    console.log('✅ Security masking is functional. Credentials returned as placeholder (••••••••).');
  } else {
    console.error('❌ Credentials were not masked properly! Returned:');
    console.error('APOLLO_API_KEY:', apolloCred);
    console.error('AHREFS_API_KEY:', ahrefsCred);
    if (envExists) fs.writeFileSync(ENV_PATH, originalEnv, 'utf-8');
    process.exit(1);
  }

  // Step 5: Restore original state to ensure workspace is clean
  console.log('\n🧹 [5/5] Cleaning up workspace by restoring original .env.local...');
  if (envExists) {
    fs.writeFileSync(ENV_PATH, originalEnv, 'utf-8');
    console.log('✅ Original .env.local restored.');
  } else {
    if (fs.existsSync(ENV_PATH)) {
      fs.unlinkSync(ENV_PATH);
    }
    console.log('✅ Created .env.local deleted.');
  }

  console.log('\n🎉 ALL CREDENTIALS TESTS PASSED! API reading, writing, and masking are fully operational!\n');
}

runTest();
