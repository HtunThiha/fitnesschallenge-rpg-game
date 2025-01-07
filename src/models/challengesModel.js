const pool = require('../services/db.js');

module.exports.selectAllChallenges = (callback) => {

    const SQLSTATEMENT = `
        SELECT c.challenge_id, u.username AS challenge_creator, c.challenge, c.skillpoints
        FROM challenges AS c
        INNER JOIN users AS u
        ON c.creator_id = u.user_id;
    `;

    pool.query(SQLSTATEMENT, callback);
}