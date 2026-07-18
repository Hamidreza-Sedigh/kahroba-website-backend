const News = require('../models/News');
const ReadHistory = require('../models/ReadHistory');
const mongoose = require("mongoose");

const relatedCache = {}; // { shortId: { data: [...], time: timestamp } }
const CACHE_DURATION = 15 * 60 * 1000; // 15 دقیقه

module.exports = {
    // دریافت همه خبرها
    async getAllNews(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;
            const skip = (page - 1) * limit;

            const news = await News.find()
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit);

            res.json(news);
        } catch (err) {
            console.error('❌ خطا در getAllNews:', err.message);
            res.status(500).json({ error: 'مشکلی در دریافت اخبار پیش آمد' });
        }
    },

    // دریافت یک خبر با shortId
    async getNewsById(req, res) {
        try {
            const news = await News.findOne({ shortId: req.params.id });
            if (!news) {
                return res.status(404).json({ error: 'خبر پیدا نشد' });
            }
            res.json(news);
        } catch (err) {
            console.error('❌ خطا در getNewsById:', err.message);
            res.status(500).json({ error: 'مشکلی در دریافت خبر پیش آمد' });
        }
    },

    async deleteNews(req, res) {
        try {
        const { shortId } = req.params;

        const deletedNews = await News.findOneAndDelete({ shortId });

        if (!deletedNews) {
            return res.status(404).json({ message: "خبر یافت نشد" });
        }

        res.json({
            message: "خبر با موفقیت حذف شد",
            deletedNews
        });
        } catch (err) {
        console.error("❌ Error in deleteNews:", err);
        res.status(500).json({ message: "خطا در حذف خبر" });
        }
    },

    async searchNews(req, res) {
        console.log("Test. searchNews");
        const { q, page = 1, pageSize = 2 } = req.query;
        console.log("Test. searchNews:q:", q);
      
        if (!q) return res.status(400).json({ error: "Search query is required" });
      
        try {
          // شمارش کل نتایج
          const total = await News.countDocuments({ $text: { $search: q } });
      
          // دریافت نتایج صفحه فعلی
          const results = await News.find(
            { $text: { $search: q } },
            { score: { $meta: "textScore" } }
          )
            .sort({ score: { $meta: "textScore" } })
            .skip((page - 1) * pageSize)
            .limit(Number(pageSize));
      
          res.json({
            results,
            total, // 👈 اضافه شد
            page: Number(page),
            pageSize: Number(pageSize),
          });
        } catch (err) {
          console.error("ERR", err);
          res.status(500).json({ error: err.message });
        }
    },

    async getLatestNews(req,res){
        console.log("Test. getLatestNews");
        try {
            const news = await News.find({}).sort({ date: -1 }).limit(20);
            if(news){
                //console.log({news});
                return res.json( news )
            }    
        } catch (error) {
            console.log("ERROR in getNews:", error);
            return res.status(500).json({ message: 'we dont have any news yet'});
        }

    },

    async getPopularNews(req,res){
        console.log("Test. getPopularNews");
        try {
            const limit = parseInt(req.query.limit) || 5;
            const period = req.query.period || "day"; // day / week / month
            let dateThreshold;
            const now = new Date();

            switch (period) {
            case "week":
                dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "month":
                dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case "day":
            default:
                dateThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            }
            
            const popularNews = await News.find({
                date: { $gte: dateThreshold }
            })
                .sort({ views: -1 })
                .limit(limit);
        
            res.json(popularNews);
        } catch (err) {
            console.error('Error fetching popular news:', err);
            res.status(500).json({ error: 'Server error' });
        }

    },

    async getFilteredNews(req, res) {
        console.log("TEST CONTROLLER");
        console.log(req.query);
      
        const { category, page = 1, pageSize = 20 } = req.query;
      
        const filter = {};
        if (category) filter.category = category;      
        console.log("Test-getFilteredNews-filter:", filter);
      
        try {
          const skip = (parseInt(page) - 1) * parseInt(pageSize);
      
          // مجموع کل خبرها برای محاسبه تعداد صفحات
          const total = await News.countDocuments(filter);
      
          // گرفتن اخبار با صفحه‌بندی
          const news = await News.find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(parseInt(pageSize))
            .lean();
      
          if (!news || news.length === 0) {
            return res.status(200).json({
              news: [],
              total: 0,
            });
          }
      
          res.json({
            news,
            total,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
          });
      
        } catch (err) {
          console.error("Error in getFilteredNews:", err);
          res.status(500).json({ message: "خطا در دریافت اخبار filtered" });
        }
    },

    async getNewsByShortId(req, res) {
        console.log("getNewsByShortId started..");
        try {
          const { shortId } = req.params;
      
          // افزایش view قبل از ارسال خبر
          const newsItem = await News.findOneAndUpdate(
            { shortId },
            { $inc: { views: 1 } }, // افزایش بازدید
            { new: true }           // بازگرداندن سند بروز شده
          );
      
          if (!newsItem) {
            return res.status(404).json({ error: 'خبر پیدا نشد' });
          }
      
          res.json(newsItem); // ارسال خبر به فرانت‌اند
        } catch (error) {
          console.error('❌ Error fetching news:', error.message);
          res.status(500).json({ error: 'خطا در سرور' });
        }
      },
	  async registerVisit(req, res) {
        console.log("registerVisit started..");
        try {
          console.log("req.params:", req.params);
          console.log("req.user:", req.user);
          const { shortId } = req.params;
          const userId = req.user?.userId;
          console.log("registerVisit test 2");
          // فقط برای اطمینان خبر موجود است، view را افزایش نمی‌دهیم
          const newsItem = await News.findOne({ shortId });
          console.log("registerVisit test 3");
          if (!newsItem) {
            return res.status(404).json({ error: "خبر پیدا نشد" });
          }
          console.log("registerVisit test 4");
          // ثبت یا آپدیت تاریخچه خوانده شده برای کاربر لاگین شده
          if (userId) {
            console.log("registerVisit test 5");
            try {
              console.log("registerVisit test 6");
              await ReadHistory.findOneAndUpdate(
                {
                  user: new mongoose.Types.ObjectId(userId),
                  news: new mongoose.Types.ObjectId(newsItem._id),
                },
                { readAt: new Date() },
                { upsert: true, new: true }
              );
              console.log("registerVisit test 6");
            } catch (err) {
              console.error("❌ خطا در ثبت تاریخچه:", err.message);
            }
          }
      
          res.json({ message: "تاریخچه خوانده شده ثبت شد" });
        } catch (error) {
          console.error("❌ Error registering visit:", error.message);
          res.status(500).json({ error: "خطا در ثبت تاریخچه" });
        }
      },

    async getOneSourceNews(req, res) {
        try {
            const sourceName = req.params.sourceName;

            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;

            const skip = (page - 1) * pageSize;

            const [news, total] = await Promise.all([
            News.find({ sourceName })
                .sort({ date: -1 })
                .skip(skip)
                .limit(pageSize),
            News.countDocuments({ sourceName }),
            ]);

            return res.status(200).json({
                news,
                total,
                currentPage: page,
                pageSize,
                });
        } catch (error) {
            console.error("خطا در getOneSourceNews:", error);
            return res.status(500).json({ message: "خطای سرور" });
        }
    },

    async getRelatedNews(req, res) {
      console.log("getRelatedNews called.");
      try {
        const { shortId } = req.params;
        // بررسی کش
        if (relatedCache[shortId] && Date.now() - relatedCache[shortId].time < CACHE_DURATION) {
          return res.json({ related: relatedCache[shortId].data, source: 'cache' });
        }
        // خبر اصلی را پیدا کن
        const currentNews = await News.findOne({ shortId });
        if (!currentNews) return res.status(404).json({ message: 'خبر پیدا نشد' });
        // 3 خبر مرتبط بر اساس دسته‌بندی، به جز خبر اصلی
        // تعیین فیلتر
        let filter = { 
          shortId: { $ne: currentNews.shortId } // به جز خود خبر
        };
        if (currentNews.subCategory) {
          // اگر subCategory دارد، فقط اخبار همان زیرشاخه
          filter.subCategory = currentNews.subCategory;
        } else {
          // اگر ندارد، از category استفاده کن
          filter.category = currentNews.category;
        }
        const relatedNews = await News.find(filter)
          .limit(3)
          .sort({ date: -1 }) // آخرین اخبار
          .select('shortId title imageUrl date category subCategory sourceName');


        // ذخیره در کش
        relatedCache[shortId] = { data: relatedNews, time: Date.now() };

        res.json({ related: relatedNews, source: 'db' });

      } catch (error) {
        console.error('Error fetching related news:', error);
        res.status(500).json({ message: 'خطا در دریافت اخبار مرتبط' });
      }
    }

};
