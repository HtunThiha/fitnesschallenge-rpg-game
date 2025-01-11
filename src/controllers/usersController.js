const usersModel = require('../models/usersModel.js');
const dateFormatter = require('./dateFormatter.js');
const bcrypt = require('bcrypt');

module.exports.readAllUsers = (req, res, next) => {

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error reading all users: \n", error);
            res.status(500).json({message: "Internal server error."});
        } else {
            res.status(200).json(results);
        }
    }

    usersModel.selectAllUsers(callback);
}

module.exports.checkUserExistsByUserId = (req, res, next) => {

    const data = {
        user_id: (req.body.user_id == undefined) ? req.params.user_id:req.body.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checking user's presence in database: \n", error);
            res.status(500).json({message: "Internal server error."});
        } else {
            if (results.length == 0) {
                res.status(404).json({message: `User_id ${data.user_id} not found.`});
            } else {
                next();
            }
        }
    }
    if (data.user_id == undefined) {
        res.status(400).json({message: "User_id not provided."});
    } else {
        usersModel.selectUsernameByUserId(data, callback, "user_id");
    }
}

module.exports.validatePasswordByUserId = (req, res, next) => {

    const data = {
        user_id: (req.body.user_id == undefined) ? req.params.user_id:req.body.user_id,
        password: req.body.password
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error validating password by user_id: \n", error);
            res.status(500).json({message: "Internal server error."});
        } else {
            let hashedPassword = results[0].password
            let inputPassword = req.body.password

            bcrypt.compare(inputPassword, hashedPassword, (error, isMatch) => {
                if (error) {
                    console.error("Error validating password: \n", error);
                    res.status(500).json({message: "Internal server error."});
                } else {
                    if (isMatch) {
                        req.body.password_validation = true;
                        next();
                    } else {
                        res.status(401).json({message: "Incorrect password."});
                    }
                }
            });
        }
    }

    if (data.password == undefined) {
        res.status(400).json({message: "Password not provided."});
    } else {
        usersModel.selectPasswordByUserId(data, callback);
    }
}

module.exports.readUserByUserId = (req, res, next) => {

        const data = {
            user_id: req.params.user_id
        }

        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error reading user by user_id: \n", error);
                res.status(500).json({message: "Internal server error."});
            } else {
                res.status(200).json(results);
            }
        }

        if (req.body.password_validation == true) {
            usersModel.selectUserByUserId(data, "private", callback);
        } else {
            usersModel.selectUserByUserId(data, "public", callback);
        }
}

module.exports.readInboxMessagesByUserId = (req, res, next) => {

    const data = {
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error reading inbox messages by user_id: \n", error);
            res.status(500).json({message: "Internal server error."});
        } else {

            for(let i = 0; i <= 1; i++) {
                results[i].map(record => {
                    record.description = (record.description == null) ? "":record.description;
                    record.received_on = dateFormatter.formatDate(record.received_on);
                });
            }
            if (results.length == 0) {
                results = "No messages in the inbox yet.";
            }

            res.status(200).json({
                new_messages: (results[0].length == 0) ? "No new messages received":results[0],
                read_messages: results[1]
            });
        }
    }

    usersModel.selectInboxMessagesByUserId(data, callback);
}

module.exports.checkUsernameAlreadyExists = (req, res, next) => {

    const data = {
        username: req.body.username
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checking username presence in database: \n", error);
            res.status(500).json({message: "Internal server error."});
        } else {
            if (results.length !== 0) {
                res.status(409).json({message: `Username ${data.username} already exists.`});
            } else {
                next();
            }
        }
    }

    if (data.username == undefined) {
        res.status(400).json({message: "Username not provided."});
    } else {
        usersModel.selectUsernameByUserId(data, callback, "username");
    }
}

module.exports.createNewUser = (req, res, next) => {

    const data = {
        username: req.body.username,
        password: req.body.password
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error creating new user: \n", error);
            res.status(500).json({message: "Internal server error."});
        } else {
            res.status(201).json({
                message: "User created successfully.",
                new_user: results[1][0]
            });
        }
    }

    if (data.username == undefined) {
        res.status(400).json({message: "Username not provided."});
    } else if (data.password == undefined) {
        res.status(400).json({message: "Password not provided."});
    } else {
        bcrypt.hash(data.password, parseInt(process.env.SALT_ROUNDS), (error, hash) => {
            if (error) {
                console.error("Error hashing password for creating user:\n", error);
            } else {
                data.password = hash;
                usersModel.insertSingleUser(data, callback);
            }
        });
    }
}

module.exports.updateUsernameByUserId = (req, res, next) => {

    const data = {
        user_id: req.body.user_id,
        username: req.body.username,
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updating user by user_id: \n", error);
            res.status(500).json({message: "Internal server error."});
        } else {
            res.status(200).json({
                message: "Username updated successfully.",
                updated_user: results[2][0]
            });
        }
    }

    usersModel.updateUsernameByUserId(data, callback);
}