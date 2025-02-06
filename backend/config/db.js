const mysql = require('mysql8'); // Using mysql8 package
const dotenv = require('dotenv');

dotenv.config();

// Log database connection details for debugging
console.log("Connecting to DB:", process.env.DB_HOST, process.env.DB_USER, process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Manually wrap pool.getConnection in a Promise
const getConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
};

// Check if connection works
getConnection()
  .then(connection => {
    console.log("Connected to the database");
    connection.release(); // Always release the connection back to the pool
  })
  .catch(err => {
    console.error("Database connection failed:", err);
  });

module.exports = pool;
