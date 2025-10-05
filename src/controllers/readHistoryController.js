// controllers/readHistoryController.js
const ReadHistory = require("../models/ReadHistory");

exports.getUserReadHistory = async (req, res) => {
  console.log("getUserReadHistory...");
  try {
    const userId = req.user.userId;

    // پیدا کردن تاریخچه‌ی کاربر، همراه با اطلاعات خبر
    const history = await ReadHistory.find({ user: userId })
      .populate({
        path: "news",
        select: "title shortId imageUrl category sourceName date views",
      })
      .sort({ readAt: -1 }); // آخرین بازدید بالاتر

    res.status(200).json({
      count: history.length,
      items: history,
    });
  } catch (error) {
    console.error("❌ خطا در دریافت تاریخچه خواندن:", error.message);
    res.status(500).json({ error: "خطا در دریافت تاریخچه خواندن کاربر" });
  }
};
