import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:3000/api/config';
const CONFIG_PATH = path.join(process.cwd(), 'synapse.config.ts');

async function runTest() {
  console.log('\n🚀 Starting E2E Integration Test for GTM Control Room API & Hot-Reloading...\n');

  // Step 1: Verify the server is running and fetch the initial configuration
  console.log('📡 [1/6] Fetching current configuration from Next.js server...');
  let initialConfigRes;
  try {
    const res = await fetch(API_BASE);
    initialConfigRes = await res.json();
  } catch (error: any) {
    console.error(`❌ Error connecting to development server at ${API_BASE}. Make sure 'npm run dev' is running!`);
    console.error(error.message);
    process.exit(1);
  }

  if (!initialConfigRes.success || !initialConfigRes.config) {
    console.error('❌ Failed to fetch config. Server response:', initialConfigRes);
    process.exit(1);
  }

  const originalConfig = initialConfigRes.config;
  console.log(`✅ Connection established! Current Company: "${originalConfig.company.name}"`);
  console.log(`✅ Active Agents count: ${originalConfig.agents.active.length}`);
  console.log(`✅ Global Tool Mode: "${originalConfig.tools.default_mode}"`);

  // Step 2: Make modifications to test serialization
  console.log('\n📝 [2/6] Preparing modified configuration payload...');
  const testConfig = JSON.parse(JSON.stringify(originalConfig));

  // Change company name, toggle an agent state, and change a safeguard setting
  const originalName = testConfig.company.name;
  testConfig.company.name = `${originalName} (Test Mode Active)`;
  
  // Toggle the first agent in ALL_AGENTS (CMO: id "01")
  const agentIndex = testConfig.agents.active.indexOf('01');
  if (agentIndex > -1) {
    testConfig.agents.active.splice(agentIndex, 1); // Temporarily deactivate
    console.log(' - Action: Deactivating CMO Agent ("01")');
  } else {
    testConfig.agents.active.push('01'); // Temporarily activate
    console.log(' - Action: Activating CMO Agent ("01")');
  }

  // Change cost budget slightly
  const originalBudget = testConfig.budgets.max_tokens_per_session;
  testConfig.budgets.max_tokens_per_session = originalBudget + 1000;
  console.log(` - Action: Updating token budget from ${originalBudget} to ${testConfig.budgets.max_tokens_per_session}`);

  // Step 3: Send POST request to serialize to disk
  console.log('\n💾 [3/6] Sending POST request to serialize changes to synapse.config.ts...');
  const saveRes = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ config: testConfig })
  });

  const saveResult = await saveRes.json();
  if (!saveResult.success) {
    console.error('❌ Save API failed:', saveResult);
    process.exit(1);
  }
  console.log('✅ Configuration saved successfully!');

  // Step 4: Verify disk persistence
  console.log('\n📂 [4/6] Verifying file persistence on local disk...');
  const fileContent = fs.readFileSync(CONFIG_PATH, 'utf-8');
  if (fileContent.includes(`"name": "${testConfig.company.name}"`)) {
    console.log('✅ Changes successfully serialized to synapse.config.ts on disk!');
  } else {
    console.error('❌ synapse.config.ts does not contain the updated company name!');
    console.exit(1);
  }

  // Step 5: Verify Hot-Reloading/HMR by refetching configuration
  console.log('\n🔥 [5/6] Verifying Next.js Hot-Module Replacement (HMR)...');
  console.log('Wait 1.5 seconds for Next.js to compile the updated module...');
  await new Promise(resolve => setTimeout(resolve, 1500));

  const secondRes = await fetch(API_BASE);
  const reloadedRes = await secondRes.json();
  if (!reloadedRes.success) {
    console.error('❌ Failed to refetch config:', reloadedRes);
    process.exit(1);
  }

  const reloadedConfig = reloadedRes.config;
  if (reloadedConfig.company.name === testConfig.company.name) {
    console.log(`✅ HMR Success! Next.js hot-reloaded the updated config. Live Company is now: "${reloadedConfig.company.name}"`);
  } else {
    console.warn('⚠️ HMR did not complete in time. Let\'s try one more fetch...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    const thirdRes = await fetch(API_BASE);
    const finalReloaded = await thirdRes.json();
    if (finalReloaded.config.company.name === testConfig.company.name) {
      console.log(`✅ HMR Success (delayed)! Live Company is now: "${finalReloaded.config.company.name}"`);
    } else {
      console.error('❌ Next.js application state did not update the imported configuration.');
      process.exit(1);
    }
  }

  // Step 6: Restore original state to ensure workspace is clean
  console.log('\n🧹 [6/6] Cleaning up workspace by restoring original configuration...');
  const restoreRes = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ config: originalConfig })
  });

  const restoreResult = await restoreRes.json();
  if (restoreResult.success) {
    console.log('✅ Workspace configuration successfully restored to original state!');
  } else {
    console.error('❌ Cleanup failed! Original config could not be restored:', restoreResult);
    process.exit(1);
  }

  console.log('\n🎉 ALL TESTS PASSED! The GTM Control Center API Gateway and Hot-Reload synchronization is 100% operational!\n');
}

runTest();
