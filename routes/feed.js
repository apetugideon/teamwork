const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const feedController = require('../controllers/feedController');

router.get('/', auth, feedController.getFeeds);

module.exports = router;
