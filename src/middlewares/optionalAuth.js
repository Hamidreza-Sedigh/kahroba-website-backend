// middlewares/optionalAuth.js
const jwt = require("jsonwebtoken");
const config = require('../config'); // از config/index.js می‌خوانیم

function optionalAuth(req, res, next) {
  console.log("temp optionalAuth");
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer token
    try {
      console.log("🔍 Verifying token with key:", config.jwt.secret);
      const decoded = jwt.verify(token, config.jwt.secret);
      console.log("✅ Token verified. Decoded user:", decoded);

      req.user = decoded; // اطلاعات کاربر در دسترس میشه

    } catch (err) {
      console.log("ERROR:", err);
      console.log("❌ optionalAuth: توکن نامعتبر، ادامه بدون کاربر");
      // عمداً next رو صدا میزنیم، چون نباید 401 بدیم
    }
  }
  // else {
  //   console.log("⚠️ optionalAuth: هیچ توکنی ارسال نشده");
  // }
  next();
}

module.exports = optionalAuth;
