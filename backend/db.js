const mysql = require('mysql2');

const db_connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nightin'
});

module.exports = db_connection;