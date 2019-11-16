const express   = require('express')
const router    = express.Router();
const auth      = require('../middleware/auth');

const agflagsController = require('../controllers/agflagsController');

router.get('/', auth, agflagsController.getAllAgflags);
router.post('/', auth, agflagsController.createAgflag);
router.get('/:id', auth, agflagsController.getOneAgflag);
router.put('/:id', auth, agflagsController.modifyAgflag);
router.delete('/:id', auth, agflagsController.deleteAgflag);

module.exports = router;

