const User = require("../models/User");
const ReadHistory = require('../models/ReadHistory');
// const SavedNews = require('../models/SavedNews'); // اگه داری
const mongoose = require('mongoose');

exports.getWeeklyReads = async (req, res) => {
  console.log("getWeeklyReads started...");
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(400).json({ message: "شناسه کاربر یافت نشد." });

    // اعتبارسنجی userId برای جلوگیری از ارور ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "userId نامعتبر است." });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId); // ✅ با new

    // محدوده‌ی ۷ روز اخیر (شامل امروز)
    const today = new Date();
    // صفر کردن زمان امروز برای مقایسه دقیق‌تر (از ابتدای روز)
    today.setHours(23, 59, 59, 999);
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);
    weekAgo.setHours(0, 0, 0, 0);

    // گروه‌بندی براساس روز (فرمت YYYY-MM-DD)
    const data = await ReadHistory.aggregate([
      {
        $match: {
          user: userObjectId,
          readAt: { $gte: weekAgo, $lte: today },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$readAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // تبدیل به فرمت مناسب برای فرانت (7 روز — ترتیب از قدیمی به جدید)
    // نگاشت درست روزهای هفته به فارسی بر اساس getDay() جاوااسکریپت:
    // JS: 0=Sunday,1=Monday,...,6=Saturday
    const persianWeekdayByJsDay = ["یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنج‌شنبه","جمعه","شنبه"];

    const result = Array(7).fill(0).map((_, i) => {
      const d = new Date(weekAgo);
      d.setDate(weekAgo.getDate() + i); // i=0 -> weekAgo (قدیمی‌ترین)، i=6 -> امروز
      const dateStr = d.toISOString().split("T")[0];
      const item = data.find((x) => x._id === dateStr);
      return {
        date: dateStr, // برای دیباگ/نیازهای فرانت مفید است
        day: persianWeekdayByJsDay[d.getDay()],
        read: item ? item.count : 0,
      };
    });
    console.log("result:",result)
    res.json(result);
  } catch (err) {
    console.error("خطا در دریافت آمار هفتگی:", err);
    res.status(500).json({ message: "خطای داخلی سرور" });
  }
};


exports.getUserStats = async (req, res) => {
  console.log("getUserStats started...");
  try {
    const userId = req.user?.userId || req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: 'شناسه کاربر یافت نشد.' });
    }

    // 1️⃣ مدت عضویت از createdAt
    const user = await User.findById(userId).select('createdAt');
    if (!user) return res.status(404).json({ message: 'کاربر یافت نشد.' });

    const now = new Date();
    const created = new Date(user.createdAt);
    console.log("created:", created);
    const diff = now - created;
    console.log("diff:", diff);
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    console.log("years:", years);
    const months = Math.floor((diff / (1000 * 60 * 60 * 24 * 30)) % 12);
    console.log("months:", months);
    let membershipDuration = '';

    if (years > 0 && months > 0) {
      membershipDuration = `${years} سال و ${months} ماه`;
    } else if (years > 0) {
      membershipDuration = `${years} سال`;
    } else if (months > 0) {
      membershipDuration = `${months} ماه`;
    } else {
      membershipDuration = 'کمتر از یک ماه';
    }

    console.log('membershipDuration:', membershipDuration);
    // 2️⃣ تعداد خبرهای خوانده‌شده
    const readNewsCount = await ReadHistory.countDocuments({ user: userId });

    // 3️⃣ تعداد خبرهای ذخیره‌شده (اختیاری)
    let savedNewsCount = 0;
    // try {
    //   const SavedNews = mongoose.model('SavedNews');
    //   savedNewsCount = await SavedNews.countDocuments({ user: userId });
    // } catch (err) {
    //   savedNewsCount = 0;
    // }

    res.json({
      membershipDuration,
      readNews: readNewsCount,
      savedNews: savedNewsCount,
    });
  } catch (err) {
    console.error('خطا در دریافت آمار کاربر:', err);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
};

exports.getUsersPaginated = async (req, res) => {
  try {
    // گرفتن پارامترها از query
    let { pageNumber, pageSize } = req.query;

    pageNumber = parseInt(pageNumber) || 0; // صفحه اول
    pageSize = parseInt(pageSize) || 10;    // تعداد پیشفرض در هر صفحه

    const totalCount = await User.countDocuments(); // تعداد کل کاربران

    const users = await User.find()
      .skip(pageNumber * pageSize)
      .limit(pageSize)
      .sort({ username: 1 }); // میشه بعدا قابل تغییر باشه

    res.json({ users, totalCount });
  } catch (error) {
    console.error("Error fetching users with pagination:", error);
    res.status(500).json({ message: "خطا در دریافت کاربران." });
  }
};

// دریافت لیست کاربران بدون رمز عبور
exports.getUsers = async (req, res) => {
  try {
    // فقط فیلدهای لازم را برگردانیم
    const users = await User.find({}, "-password").sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (err) {
    console.error("خطا در دریافت کاربران:", err);
    res.status(500).json({ error: "خطای سرور" });
  }
};

