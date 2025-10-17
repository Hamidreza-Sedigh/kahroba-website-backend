// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const {
  getMessages,
  markMessageAsRead,
  deleteMessage,
} = require("../controllers/contactController");
const authMiddleware = require("../middlewares/auth"); // اگر داشتی

router.get("/", authMiddleware, getMessages);
router.patch("/:id", authMiddleware, markMessageAsRead);
router.delete("/:id", authMiddleware, deleteMessage);

module.exports = router;
