const express = require("express");
const router = express.Router();
// const { getAllNews, getNewsById } = require("../controllers/newsController");
const newsController = require("../controllers/newsController");

const optionalAuth = require('../middlewares/optionalAuth');
const auth = require('../middlewares/auth');


router.get("/", optionalAuth, newsController.getAllNews);
router.get("/:id", optionalAuth, newsController.getNewsById);
router.delete("/:shortId", auth, newsController.deleteNews);


module.exports = router;
