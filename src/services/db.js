const mysql = require('mysql2');
require('dotenv').config();

const setting = {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true,
    dateStrings: true
}

console.log(`Database Settings: `, setting, "\n");

const pool = mysql.createPool(setting);

module.exports = pool;