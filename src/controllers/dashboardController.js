const User = require("../models/User");
const ReadHistory = require('../models/ReadHistory');
// const SavedNews = require('../models/SavedNews'); // اگه داری
const mongoose = require('mongoose');

exports.getUserStats = async (req, res) => {
  console.log("getUserStats started...");
  try {
    const userId = req.user?._id || req.query.userId; // یا از کوئری برای تست

    if (!userId) {
      return res.status(400).json({ message: 'شناسه کاربر یافت نشد.' });
    }

    // 1️⃣ مدت عضویت از createdAt
    const user = await User.findById(userId).select('createdAt');
    if (!user) return res.status(404).json({ message: 'کاربر یافت نشد.' });

    const now = new Date();
    const created = new Date(user.createdAt);
    const diff = now - created;
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((diff / (1000 * 60 * 60 * 24 * 30)) % 12);
    const membershipDuration = `${years ? years + ' سال ' : ''}${months ? months + ' و ' + months + ' ماه' : ''}`;

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

