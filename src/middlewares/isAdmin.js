module.exports = function (req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }
  
      if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
      }
  
      next();
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  };
  