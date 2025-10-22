const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('../config/index');


const JWT_SECRET = config.jwt.secret;

exports.registerUser = async (req, res) => {
  console.log("backend-registerUser");
  try {
    const { username, email, phone, password } = req.body;

    if (!username || !password || (!email && !phone)) {
      return res.status(400).json({ message: "تمام فیلدهای ضروری ارسال نشده‌اند" });
    }

    // بررسی تکراری بودن ایمیل یا شماره موبایل
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "ایمیل یا شماره موبایل قبلاً ثبت شده است" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email: email ? email.toLowerCase().trim() : undefined,
      phone: phone ? phone.trim() : undefined,
      password: hashedPassword,
      role: "user",
      active: true,
    });

    await newUser.save();

    res.status(201).json({ message: "ثبت‌نام موفقیت‌آمیز بود" });
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({ message: "خطای سرور", error: err.message });
  }
};


exports.loginUser = async (req, res) => {
  console.log("backend-loginUser");
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: "فیلدهای لازم ارسال نشده‌اند" });
    }

    let query = {};
    if (identifier.includes("@")) {
      query = { email: identifier.toLowerCase().trim() };
    } else if (/^\d+$/.test(identifier)) {
      query = { phone: identifier.trim() };
    } else {
      query = { username: identifier.trim() };
    }

    const user = await User.findOne(query);
    if (!user) {
      return res.status(400).json({ message: "کاربر یافت نشد" });
    }

    if (!user.active) {
      return res.status(403).json({ message: "حساب کاربری غیرفعال است" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "رمز عبور اشتباه است" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email, phone: user.phone },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("loginUser error:", err);
    res.status(500).json({ message: "خطای سرور", error: err.message });
  }
};
