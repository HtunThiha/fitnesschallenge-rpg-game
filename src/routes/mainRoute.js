const express = require('express');
const usersRoute = require('./usersRoute.js');

const router = express.Router();

router.use('/users', usersRoute);

module.exports = router;