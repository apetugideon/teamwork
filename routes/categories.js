const express   = require('express')
const router    = express.Router();
const auth      = require('../middleware/auth');

const categoriesController = require('../controllers/categoriesController');

router.get('/', auth, categoriesController.getAllCategories);
router.post('/', auth, categoriesController.createCategory);
router.get('/:id', auth, categoriesController.getOneCategory);
router.put('/:id', auth, categoriesController.modifyCategory);
router.delete('/:id', auth, categoriesController.deleteCategory);

module.exports = router;

