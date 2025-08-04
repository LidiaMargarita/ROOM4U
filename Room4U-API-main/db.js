const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'mysql.carlosernestoem.live',
  user: 'room4u',
  password: 'Ceehicee2',
  database: 'room4u',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
