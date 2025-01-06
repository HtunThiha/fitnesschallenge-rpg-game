const pool = require('../services/db.js');

module.exports.selectAllUsers = (callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, username, level FROM users
        WHERE user_id != 1;
    `;

    pool.query(SQLSTATEMENT, callback);
}

module.exports.selectUsernameByUserId = (data, callback, queryParameter) => {

    const SQLSTATEMENT = `
        SELECT username FROM users
        WHERE ${queryParameter} = ?;
    `;

    const VALUES = [data[queryParameter]];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.selectUserByUserId = (data, access, callback) => {

    const SQLSTATEMENT1 = `
        SELECT user_id, username, skillpoints, gold, diamond, level, DATEDIFF(CURRENT_DATE(), created_on) AS account_age FROM users
        WHERE user_id = ?;
    `;
    const SQLSTATEMENT2 = `
        SELECT user_id, username, level FROM users
        WHERE user_id = ?;
    `;

    const VALUES = [data.user_id];

    if (access == "private") {
        pool.query(SQLSTATEMENT1, VALUES, callback);
    } else if (access == "public") {
        pool.query(SQLSTATEMENT2, VALUES, callback);
    }
}

module.exports.selectPasswordByUserId = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT password FROM users
        WHERE user_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.selectInboxMessagesByUserId = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT title, description, received_on FROM user_inbox
        WHERE user_id = ?
        ORDER BY received_on DESC;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.insertSingleUser = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO users(username, password)
        VALUES(?, ?);

        SELECT user_id, username, level FROM users
        WHERE user_id = LAST_INSERT_ID();
    `;

    const VALUES = [data.username, data.password];

    pool.query(SQLSTATEMENT, VALUES, callback);
}