const express   = require('express')
const router    = express.Router();
const auth      = require('../middleware/auth');

const usersController = require('../controllers/users');

router.post('/create-user', usersController.signup);
router.post('/signin', usersController.signin);

module.exports = router;

