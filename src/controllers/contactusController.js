const jwt = require('jsonwebtoken');
const ContactMessage = require('../models/ContactMessage');
const ReportModel = require('../models/Report');
const { Types } = require('mongoose'); // اضافه شده برای ObjectId

module.exports = {
  async createContact(req, res) {
    try {
      console.log("ContactController:", req.body);
      console.log('req.ip:', req.ip);
      console.log('x-forwarded-for:', req.headers['x-forwarded-for']);
      console.log('remoteAddress:', req.socket.remoteAddress);
      const { name, email, subject, message } = req.body;
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "لطفاً همه فیلدها را پر کنید." });
      }

      // const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.connection.remoteAddress;
      const ip = req.ip;

      const newMessage = new ContactMessage({
        name,
        email,
        subject,
        message,
        ip,
        read: false
      });

      await newMessage.save();

      return res.status(200).json({ message: "پیام با موفقیت ذخیره شد." });

    } catch (error) {
      console.error("خطا در ذخیره پیام تماس:", error);
      return res.status(500).json({ message: "خطا در سرور. لطفاً بعداً امتحان کنید." });
    }
  },

  async reportProblem(req, res) {
    console.log("reportProblem Started...");
    try {
      const { newsId, url, description } = req.body;

      if (!newsId || !url) {
        return res.status(400).json({ message: 'newsId و url الزامی هستند.' });
      }

      // گرفتن IP کاربر
      const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.connection.remoteAddress;

      // زمان 24 ساعت قبل
      const since = new Date(Date.now() - 1 * 60 * 60 * 1000);

      // بررسی وجود گزارش از این IP برای همین newsId در 1 ساعت گذشته
      const existingReport = await ReportModel.findOne({
        //newsId: new Types.ObjectId(newsId),
        newsId,
        ip,
        createdAt: { $gte: since },
      });

      if (existingReport) {
        return res.status(429).json({ message: 'شما قبلاً این خبر را در 1 ساعت گذشته گزارش کرده‌اید.' });
      }
      // crrected
      // ذخیره گزارش جدید با IP
      const newReport = await ReportModel.create({
        newsId,
        url,
        description: description || '',
        ip,
      });

      return res.status(201).json({
        message: 'گزارش با موفقیت ثبت شد.',
        data: newReport,
      });
    } catch (err) {
      console.error('خطا در ثبت گزارش:', err);
      return res.status(500).json({ message: 'خطایی در ثبت گزارش رخ داد.' });
    }
  }
};
