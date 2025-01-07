const challengesModel = require('../models/challengesModel.js');

module.exports.readAllChallenges = (req, res, next) => {

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error reading all chalenges: \n", error);
            res.status(500).json({message: "Internal server error."});
        } else {
            res.status(200).json(results);
        }
    }

    challengesModel.selectAllChallenges(callback);
}