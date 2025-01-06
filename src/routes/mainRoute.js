const express = require('express');
const usersRoutes = require('./usersRoutes.js');
const challengesRoutes = require('./challengesRoutes.js');

const router = express.Router();

router.use('/users', usersRoutes);
router.use('/challenges', challengesRoutes);

module.exports = router;