const pool = require("../config/database");

async function setupDatabase() {
  const connection = await pool.getConnection();

  try {
    const databaseName = 'test_database';
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
    
  } finally {
    connection.release();
  }
}

module.exports = setupDatabase;

