const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

const db_connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    encrypt: true,
});

module.exports = db_connection;
