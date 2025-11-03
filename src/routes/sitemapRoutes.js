const express = require('express');
const router = express.Router();
const sitemapController = require('../controllers/sitemapController');

// فایل اصلی index
router.get('/sitemap-news.xml', sitemapController.getSitemapIndex);

// فایل‌های جزئی (multi-file)
router.get('/sitemap-news-:fileNum.xml', sitemapController.getSitemapFile);

module.exports = router;
