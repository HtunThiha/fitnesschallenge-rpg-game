const pool = require('../services/db.js');
const fs = require('fs');

const initTablesSQL = fs.readFileSync('./src/config/initTables.sql', 'utf-8');

pool.query(initTablesSQL, (error, results) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Tables created successfully.", results);
    }
    process.exit();
});