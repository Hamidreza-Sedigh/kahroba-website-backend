const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");

const optionalAuth = require('../middlewares/optionalAuth');
const auth = require('../middlewares/auth');

router.get('/search', newsController.searchNews);
router.get('/latest', newsController.getLatestNews);
router.get('/popular', newsController.getPopularNews);
router.get('/getOneSourceNews/:sourceName', newsController.getOneSourceNews);

router.get('/id/:id', optionalAuth, newsController.getNewsById);// in fekonam baraye engine lazeme faghat

router.get('/:shortId', optionalAuth, newsController.getNewsByShortId);
router.post('/:shortId/visit', optionalAuth, newsController.registerVisit);

router.get('/:shortId/related', optionalAuth, newsController.getRelatedNews);

router.get('/', newsController.getFilteredNews);

module.exports = router;
