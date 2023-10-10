const mysql = require('mysql2');
require('dotenv').config();

const db_connection = mysql.createConnection({
    host: "nightin.mysql.database.azure.com",
    user: "ishkhan",
    password: "PlatinuM19941!",
    database: "nightin"
});

module.exports = db_connection;