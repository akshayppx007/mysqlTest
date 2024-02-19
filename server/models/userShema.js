
const pool = require("../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

async function createUsersTable() {
  const connection = await pool.getConnection();
  await connection.query(`USE test_database`);


  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(255) NOT NULL UNIQUE,
        bio TEXT,
        password VARCHAR(255) NOT NULL,
        UNIQUE KEY (bio(255))
      )
    `;
    await connection.query(query);
  } finally {
    connection.release();
  }
}

  
  async function comparePassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }
  
  function getJwtToken(user) {
    return jwt.sign({ id: user.id}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    });
  }

module.exports = {
  createUsersTable,
  getJwtToken,
  comparePassword
};
