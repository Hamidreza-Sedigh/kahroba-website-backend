const News = require("../models/News");
const { sendTelegramMessage } = require("../services/telegram.service");

async function telegramJob() {
  try {
    console.log("Telegram job started");

    // گرفتن 5 خبر ارسال نشده
    const newsList = await News.find({
      $or: [
        { telegramSent: false },
        { telegramSent: { $exists: false } }
      ]
    })
    .sort({ date: -1 })
    .limit(5);

    if (newsList.length === 0) {
      console.log("No news to send");
      return;
    }

    // ساخت پیام
    let message = "📰 <b>آخرین اخبار</b>\n\n";

    newsList.forEach((news, index) => {
      message += `${index + 1}- ${news.title}\n`;
      message += `${news.link}\n\n`;
    });

    // ارسال به تلگرام
    await sendTelegramMessage(message);

    // آپدیت telegramSent
    const ids = newsList.map(n => n._id);

    await News.updateMany(
      { _id: { $in: ids } },
      { telegramSent: true }
    );

    console.log("Telegram job finished");

  } catch (error) {
    console.error("Telegram job error:", error);
  }
}

module.exports = telegramJob;