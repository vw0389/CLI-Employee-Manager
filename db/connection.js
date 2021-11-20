const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  // Your MySQL username,
  user: 'khorne',
  // Your MySQL password
  password: 'password',
  database: 'employee'
});

module.exports = db;
