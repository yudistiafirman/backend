const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "syartikaa28*",
  port: 3306,
  database: "auth",
});

module.exports = db;
