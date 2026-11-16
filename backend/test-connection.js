const { execSync } = require('child_process');

console.log('Testing database connection...\n');

// Try different connection formats
const testUrls = [
  // Original with URL encoding
  process.env.DATABASE_URL,
  // With sslmode=require
  process.env.DATABASE_URL?.replace('?schema=public', '?schema=public&sslmode=require'),
];

for (const url of testUrls) {
  if (!url) continue;
  
  console.log('Testing:', url.replace(/:[^:@]+@/, ':****@'));
  
  try {
    // Quick test using psql
    execSync(`psql "${url}" -c "SELECT 1" 2>&1`, { 
      timeout: 10000,
      stdio: 'pipe'
    });
    console.log('✅ Success!\n');
  } catch (error) {
    console.log('❌ Failed:', error.message.substring(0, 200), '\n');
  }
}
