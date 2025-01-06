const usersModel = require('../models/usersModel.js');
const dateFormatter = require('./dateFormatter.js');

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
        usersModel.selectUsernameByUserId(data, callback);
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
            if (results[0].password != data.password) {
                res.status(403).json({message: "Incorrect password."});
            } else {
                req.body.password_validation = true;
                next();
            }
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
            results.map(record => {
                record.description = (record.description == null) ? "":record.description;
                record.received_on = dateFormatter.formatDate(record.received_on);
            });

            if (results.length == 0) {
                results = "No messages in the inbox yet.";
            }

            res.status(200).json({messages: results});
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
        usersModel.selectUsernameByUserId(data, callback);
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
        usersModel.insertSingleUser(data, callback);
    }
}