const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const gifsController = require('../controllers/gifsController');

router.post('/', auth, multer, gifsController.createGif);
router.delete('/:id', auth, gifsController.deleteGif);
router.get('/', auth, gifsController.getAllGifs);
router.put('/:id', auth, multer, gifsController.modifyGif);
router.get('/:id', auth, gifsController.getOneGif);

//Comment
router.post('/:id/comment', auth, gifsController.createCommentGif);

module.exports = router;
