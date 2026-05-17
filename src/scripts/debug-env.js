require('dotenv').config({ path: './.env.local' });
const fs = require('fs');

console.log('🔍 Debugging Environment...');
console.log('GCP_PROJECT_ID:', process.env.GCP_PROJECT_ID);
console.log('GCP_LOCATION:', process.env.GCP_LOCATION);
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  const exists = fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  console.log('Credential file exists:', exists);
  if (exists) {
    const stats = fs.statSync(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    console.log('File size:', stats.size, 'bytes');
  }
} else {
  console.log('❌ GOOGLE_APPLICATION_CREDENTIALS is not set!');
}
