const express   = require('express')
const router    = express.Router();
const auth      = require('../middleware/auth');

const commentsController = require('../controllers/commentsController');

router.get('/', auth, commentsController.getAllComments);
router.post('/', auth, commentsController.createComment);
router.get('/:id', auth, commentsController.getOneComment);
router.put('/:id', auth, commentsController.modifyComment);
router.delete('/:id', auth, commentsController.deleteComment);

module.exports = router;

