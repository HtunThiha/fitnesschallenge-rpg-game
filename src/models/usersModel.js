const pool = require('../services/db.js');

module.exports.selectAllUsers = (callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, username, level FROM users
        WHERE user_id != 1;
    `;

    pool.query(SQLSTATEMENT, callback);
}