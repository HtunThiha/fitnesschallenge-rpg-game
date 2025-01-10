const fs = require('fs');
const pool = require('../services/db.js');
const bcrypt = require('bcrypt');
require('dotenv').config();

const saltRounds = parseInt(process.env.SALT_ROUNDS);
const adminPassword = process.env.ADMIN_PASSWORD;

const callback = (error, results, fields) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Tables created successfully.", results);
    }
    process.exit();
};

bcrypt.hash(adminPassword, saltRounds, (error, hash) => {

    if (error) {
        console.error("Error hashing password in initTables:\n", error);
    } else {
        console.log("Password hashing successful.\n");

        let SQLSTATEMENT = fs.readFileSync('./src/config/initTables.sql', 'utf-8');
        SQLSTATEMENT += `
            INSERT INTO users (username, email, password, role)
            VALUES ("ADMIN", "admin@hotmail.com", "${hash}", "admin");
        `;

        pool.query(SQLSTATEMENT, callback);
    }
});