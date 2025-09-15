const jwt = require('jsonwebtoken');
const config = require('../config'); // از config/index.js می‌خوانیم

// Middleware احراز هویت با JWT
function auth(req, res, next) {
  // استاندارد: Authorization: Bearer <token>
  const authHeader = req.headers['authorization'] || '';
  let token = null;

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  }

  // برای سازگاری با گذشته: اگر قبلاً از هدر token استفاده می‌کردی
  if (!token && req.headers['token']) {
    token = req.headers['token'];
  }

  // اگر با کوکی کار می‌کنی (اختیاری)
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.set('WWW-Authenticate', 'Bearer realm="api"');
    return res.status(401).json({ message: 'توکن ارسال نشده است' });
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret); // throws on invalid/expired
    req.user = payload; // مثلا { userId, email, iat, exp }
    return next();
  } catch (err) {
    return res.status(401).json({
      message: 'توکن نامعتبر یا منقضی است',
      error: err.name, // مثلا TokenExpiredError / JsonWebTokenError
    });
  }
}

module.exports = auth;
