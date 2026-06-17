// middlewares/auth.js

const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/User");

async function auth(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader?.startsWith("Bearer ")) {
    res.set("WWW-Authenticate", 'Bearer realm="api"');
    return res.status(401).json({
      message: "توکن ارسال نشده است",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "کاربر یافت نشد",
      });
    }

    if (user.isDeleted) {
      return res.status(401).json({
        message: "حساب کاربری حذف شده است",
      });
    }

    if (!user.active) {
      return res.status(401).json({
        message: "حساب کاربری غیرفعال است",
      });
    }

    req.user = {
      userId: user._id,
      role: user.role,
      email: user.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      message: "توکن نامعتبر یا منقضی است",
      error: err.name,
    });
  }
}

module.exports = auth;