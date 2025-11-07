const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload"); // ⬅️ میدل‌ور جدید
const {
  registerUser,
  loginUser,
  editMyInfo,
  getMyInfo,
  uploadAvatar, // ⬅️ کنترلر جدید
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ دریافت اطلاعات خود کاربر
router.get("/me", auth, getMyInfo);

// ✅ ویرایش اطلاعات خود کاربر
router.put("/me", auth, editMyInfo);

// ✅ آپلود آواتار
router.post("/me/avatar", auth, upload.single("avatar"), uploadAvatar);

module.exports = router;
