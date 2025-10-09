// middlewares/optionalAuth.js
const jwt = require("jsonwebtoken");
const config = require("../config");

function optionalAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, config.jwt.secret);

      // فقط فیلدهای مورد نیاز را نگه می‌داریم
      req.user = {
        userId: decoded.userId,
        role: decoded.role,
        email: decoded.email,
      };

    } catch (err) {
      console.log("❌ optionalAuth: توکن نامعتبر، ادامه بدون کاربر");
      console.log("ERROR:", err.message);
      // ادامه بدون توقف (no 401)
    }
  }

  next();
}

module.exports = optionalAuth;
