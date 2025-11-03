const News = require('../models/News');

const BASE_URL = 'http://kahrobanet.ir';
const MAX_URLS_PER_FILE = 10000;

// ساخت XML برای یک فایل جزئی
function generateSitemapXml(newsList) {
  const urlset = newsList.map(news => {
    const loc = `${BASE_URL}/news/${news.shortId}`;
    const lastmod = (news.updatedAt || news.createdAt || new Date()).toISOString().split('T')[0];
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


// index sitemap
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
    console.error('Error generating sitemap index:', err);
    res.status(500).end();
  }
};

// فایل جزئی
exports.getSitemapFile = async (req, res) => {
  try {
    const fileNum = parseInt(req.params.fileNum);
    const skip = (fileNum - 1) * MAX_URLS_PER_FILE;

    const totalNews = await News.countDocuments();
    if (skip >= totalNews) return res.status(404).send('Sitemap file not found');

    const newsList = await News.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(MAX_URLS_PER_FILE)
      .select('shortId updatedAt');

    const xml = generateSitemapXml(newsList);
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.log('Error happend');
    console.error('Error generating sitemap file:', err);
    res.status(500).end();
  }
};
