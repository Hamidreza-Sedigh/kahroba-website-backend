const News = require('../models/News');

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
          res.status(500).json({ message: "خطا در دریافت اخبار" });
        }
    },

    async getNewsByShortId(req, res) {
        try {
            const { shortId } = req.params;
            const newsItem = await News.findOneAndUpdate(
            { shortId },
            { $inc: { views: 1 } },
            { new: true }
            );

            if (!newsItem) {
            return res.status(404).json({ error: 'خبر پیدا نشد' });
            }

            res.json(newsItem);
        } catch (error) {
            console.error('❌ Error fetching news:', error.message);
            res.status(500).json({ error: 'خطا در سرور' });
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


};
