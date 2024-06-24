const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

// Create a connection pool using mysql2/promise
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Ensure to handle errors in an async function
async function testDatabaseConnection() {
  let connection;
  try {
    // Get a connection from the pool
    connection = await pool.getConnection();

    // Query using the connection
    const [rows, fields] = await connection.query('SELECT * FROM Contacts');

    console.log(rows); // Output the query result

  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
    // Don't end the pool here; manage the pool lifecycle appropriately
  }
}

// Call the async function to test the database connection
testDatabaseConnection();
