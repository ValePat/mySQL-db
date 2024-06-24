const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.on('connection', (connection) => {
  console.log('MySQL pool connected: threadId ' + connection.threadId);
});

pool.on('error', (err) => {
  console.error('MySQL pool encountered an error:', err);
});

module.exports = pool.promise();