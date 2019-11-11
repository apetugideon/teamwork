const express   = require('express')
const router    = express.Router();
const auth      = require('../middleware/auth');
const multer    = require('../middleware/multer-config');

const gifsController = require('../controllers/gifs');

router.post('/', multer, gifsController.createGif);


/*router.get('/', auth, gifsController.getAllGifs);
router.post('/', auth, multer, gifsController.createGif);
router.get('/:id', auth, gifsController.getOneGif);
router.put('/:id', auth, multer, gifsController.modifyGif);
router.delete('/:id', auth, gifsController.deleteGif);*/

module.exports = router;

