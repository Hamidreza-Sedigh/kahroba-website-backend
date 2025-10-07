// middlewares/optionalAuth.js
const jwt = require("jsonwebtoken");

function optionalAuth(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer token
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = decoded; // اطلاعات کاربر در دسترس میشه

    } catch (err) {
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
