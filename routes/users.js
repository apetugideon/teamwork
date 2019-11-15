const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const usersController = require('../controllers/users');

router.post('/create-user', auth, usersController.signup);
router.post('/signin', usersController.signin);

module.exports = router;
