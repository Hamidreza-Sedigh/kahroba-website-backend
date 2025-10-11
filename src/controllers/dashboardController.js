const User = require("../models/User");

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
