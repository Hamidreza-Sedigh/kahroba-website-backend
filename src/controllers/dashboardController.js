const User = require("../models/User");

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
