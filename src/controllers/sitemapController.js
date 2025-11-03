const News = require('../models/News');

const BASE_URL = 'http://kahrobanet.ir';
const MAX_URLS_PER_FILE = 5000; // هر فایل حداکثر ۵۰۰۰ خبر

// helper برای ساخت XML یک فایل
function generateSitemapXml(urls) {
  const urlset = urls.map(news => {
    const loc = `${BASE_URL}/news/${news.shortId}`;
    const lastmod = news.updatedAt.toISOString().split('T')[0];
    return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;
}

// main controller برای فایل اصلی (index)
exports.getSitemapIndex = async (req, res) => {
  try {
    const totalNews = await News.countDocuments();
    const totalFiles = Math.ceil(totalNews / MAX_URLS_PER_FILE);
    let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    for (let i = 1; i <= totalFiles; i++) {
      sitemapIndex += `
  <sitemap>
    <loc>${BASE_URL}/sitemap-news-${i}.xml</loc>
  </sitemap>`;
    }

    sitemapIndex += `</sitemapindex>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemapIndex);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

// controller برای هر فایل جزئی
exports.getSitemapFile = async (req, res) => {
  try {
    const fileNum = parseInt(req.params.fileNum);
    const skip = (fileNum - 1) * MAX_URLS_PER_FILE;
    const newsList = await News.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(MAX_URLS_PER_FILE)
      .select('shortId updatedAt');

    const xml = generateSitemapXml(newsList);

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};
