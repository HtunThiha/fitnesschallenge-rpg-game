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
        AND status = "unread"
        ORDER BY received_on DESC;

        SELECT title, description, received_on FROM user_inbox
        WHERE user_id = ?
        AND status = "read"
        ORDER BY received_on DESC;

        UPDATE user_inbox
        SET status = "read"
        WHERE status = "unread";
    `;

    const VALUES = [data.user_id, data.user_id];

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

module.exports.updateUsernameByUserId = (data, callback) => {

    const SQLSTATEMENT = `

        SET @formerUsername = (
            SELECT username FROM users
            WHERE user_id = ?
        );

        UPDATE users
        SET username = ?
        WHERE user_id = ?;

        SELECT user_id, username AS new_username, level FROM users
        WHERE user_id = ?;

        SET @newUsername = (
            SELECT username FROM users
            WHERE user_id = ?
        );

        SET @description = CONCAT("Username has changed from ", @formerUsername, " to ", @newUsername, ".");

        INSERT INTO user_inbox(user_id, title, description)
        VALUES (?, "Username updated successfully.", @description);
    `;

    const VALUES = [data.user_id, data.username, data.user_id, data.user_id, data.user_id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}