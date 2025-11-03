const express = require('express');
const router = express.Router();
const sitemapController = require('../controllers/sitemapController');

// index sitemap
router.get('/sitemap-news.xml', sitemapController.getSitemapIndex);

// فایل‌های جزئی
router.get('/sitemap-news-:fileNum.xml', sitemapController.getSitemapFile);

module.exports = router;
