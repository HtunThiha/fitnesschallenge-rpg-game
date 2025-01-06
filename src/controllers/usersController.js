const usersModel = require('../models/usersModel.js');

module.exports.readAllUsers = (req, res, next) => {

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error reading all users: \n", error);
            res.status(500).json({message: "Internal server error."});
        } else {
            res.status(200).send(results);
        }
    }

    usersModel.selectAllUsers(callback);
}