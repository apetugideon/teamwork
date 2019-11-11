const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const usersController = require('../controllers/users');

router.post('/create-user', usersController.signup);
router.post('/signin', usersController.signin);
router.delete('/deleteuser/:id', auth, usersController.deleteTestUserNow);

module.exports = router;
