const express   = require('express')
const router    = express.Router();
const auth      = require('../middleware/auth');

const agflagsController = require('../controllers/agflagsController');

router.post('/', auth, agflagsController.createAgflag);
router.delete('/:id', auth, agflagsController.deleteAgflag);

module.exports = router;

