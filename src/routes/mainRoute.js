const express = require('express');
const usersRoutes = require('./usersRoutes.js');

const router = express.Router();

router.use('/users', usersRoutes);

module.exports = router;