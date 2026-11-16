// Test database connection
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  }
});

async function testConnection() {
  try {
    await client.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Connected to database!');
    console.log('Server time:', result.rows[0].now);
    await client.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
