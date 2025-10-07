const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('../config/index');


const JWT_SECRET = config.jwt.secret;

exports.registerUser = async (req, res) => {
  console.log("backend-registerUser");
  try {
    const { username, email, password } = req.body;

    // بررسی تکراری نبودن کاربر
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "کاربر قبلاً ثبت شده است" });
    }

    // هش کردن پسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "ثبت‌نام موفقیت‌آمیز بود" });
  } catch (err) {
    res.status(500).json({ message: "خطای سرور", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  console.log("backend-loginUser");
  try {
    console.log("loginUser:", req.body);
    const { email, password } = req.body;

    // پیدا کردن کاربر
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "کاربر یافت نشد" });
    }

    // بررسی رمز
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "رمز عبور اشتباه است" });
    }

    // تولید JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("✅ JWT created with key:", JWT_SECRET);
    console.log("🔑 Token:", token);
    
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "خطای سرور", error: err.message });
  }
};
