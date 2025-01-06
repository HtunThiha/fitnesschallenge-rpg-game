const express = require('express');
const usersController = require('../controllers/usersController.js');

const router = express.Router();

router.get('/', 
    usersController.readAllUsers
);

router.get('/:user_id',
    usersController.checkUserExistsByUserId,
    usersController.readUserByUserId
);

router.get('/:user_id/details', 
    usersController.checkUserExistsByUserId,
    usersController.validatePasswordByUserId,
    usersController.readUserByUserId
);

router.get('/:user_id/inbox', 
    usersController.checkUserExistsByUserId,
    usersController.validatePasswordByUserId,
    usersController.readInboxMessagesByUserId
);

router.post('/', 
    usersController.checkUsernameAlreadyExists,
    usersController.createNewUser
);

module.exports = router;