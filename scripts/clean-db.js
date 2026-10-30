const pool = require('../src/config/database');

async function cleanDb() {
  try {
    await pool.query(
      'TRUNCATE users, authentications, companies, categories, jobs, applications, bookmarks CASCADE'
    );
  } catch (error) {
    console.error('Failed to clean database:', error.message);
  } finally {
    await pool.end();
  }
}

cleanDb();
