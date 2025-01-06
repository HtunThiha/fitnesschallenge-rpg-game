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
                res.status(200).send(results);
            }
        }

        if (req.body.password_validation == true) {
            usersModel.selectUserByUserId(data, "private", callback);
        } else {
            usersModel.selectUserByUserId(data, "public", callback);
        }
}