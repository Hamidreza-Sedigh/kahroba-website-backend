// middlewares/auth.js
const jwt = require("jsonwebtoken");
const config = require("../config");

function auth(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader?.startsWith("Bearer ")) {
    res.set("WWW-Authenticate", 'Bearer realm="api"');
    return res.status(401).json({ message: "توکن ارسال نشده است" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
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
