const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// const gifsController = require('../controllers/gifs');
const gifsController = require('../controllers/gifsController');

router.post('/', auth, multer, gifsController.createGif);
router.delete('/:id', auth, gifsController.deleteGif);
router.get('/', auth, gifsController.getAllGifs);
router.put('/:id', auth, gifsController.modifyGif);
router.get('/:id', auth, gifsController.getOneGif);

/* router.post('/', gifsController.createGif);
router.delete('/:id', gifsController.deleteGif);
router.get('/', gifsController.getAllGifs);
router.put('/:id', gifsController.modifyGif);
router.get('/:id', gifsController.getOneGif); */

module.exports = router;
