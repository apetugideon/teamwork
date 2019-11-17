const express   = require('express')
const router    = express.Router();
const auth      = require('../middleware/auth');

const articlesController = require('../controllers/articlesController');

router.get('/', auth, articlesController.getAllArticles);
router.post('/', auth, articlesController.createArticle);
router.get('/:id', auth, articlesController.getOneArticle);
router.put('/:id', auth, articlesController.modifyArticle);
router.delete('/:id', auth, articlesController.deleteArticle);

//Comment
router.post('/:id/comment', auth, articlesController.createCommentArticle);

module.exports = router;

