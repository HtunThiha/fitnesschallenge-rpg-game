const express = require('express');
const challengesController = require('../controllers/challengesController.js');

const router = express.Router();

router.get('/', 
    challengesController.readAllChallenges
);

module.exports = router;