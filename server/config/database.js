// database.js
const mysql = require('mysql2/promise');

const connectionUri = process.env.DB_URI;
const connectionDetails = new URL(connectionUri);

const connectionConfig = {
  host: connectionDetails.hostname,
  port: connectionDetails.port,
  user: connectionDetails.username,
  password: connectionDetails.password,
};

const pool = mysql.createPool({
  ...connectionConfig,
  connectionLimit: 10,
});

module.exports = pool;
