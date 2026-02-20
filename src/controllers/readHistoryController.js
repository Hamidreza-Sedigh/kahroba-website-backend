// controllers/readHistoryController.js
const ReadHistory = require("../models/ReadHistory");

exports.getUserReadHistory = async (req, res) => {
  console.log("getUserReadHistory...");
  try {
    const userId = req.user.userId;

    const history = await ReadHistory.find({ user: userId })
      .populate({
        path: "news",
        select: "title shortId imageUrl category sourceName date views",
      })
      .sort({ readAt: -1 });

    res.status(200).json({
      count: history.length,
      items: history,
    });
  } catch (error) {
    console.error("❌ خطا در دریافت تاریخچه خواندن:", error.message);
    res.status(500).json({ error: "خطا در دریافت تاریخچه خواندن کاربر" });
  }
};


// ✅ حذف آیتم از تاریخچه کاربر
exports.deleteUserReadHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { newsId } = req.body;

    if (!newsId) {
      return res.status(400).json({ error: "newsId الزامی است" });
    }

    const deleted = await ReadHistory.findOneAndDelete({
      user: userId,
      news: newsId,
    });

    if (!deleted) {
      return res.status(404).json({ error: "رکوردی برای حذف یافت نشد" });
    }

    return res.status(200).json({
      message: "آیتم با موفقیت حذف شد",
    });

  } catch (error) {
    console.error("❌ خطا در حذف تاریخچه:", error.message);
    res.status(500).json({ error: "خطا در حذف آیتم" });
  }
};