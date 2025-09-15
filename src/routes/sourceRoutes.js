const express = require("express");
const router = express.Router();
const sourceController = require('../controllers/sourceController');
const auth = require('../middlewares/auth');

// همه‌ی مسیرهای این روتر محافظت‌شده‌اند
// router.use(auth);

router.get('/distinct',  sourceController.getDistinctSources);
router.get('/:sourceName',  sourceController.getOneSource);


module.exports = router;
