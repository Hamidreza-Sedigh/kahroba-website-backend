const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const {
  registerUser,
  loginUser,
  editMyInfo,
  getMyInfo,
  uploadAvatar,
  deleteMyAccount,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ دریافت اطلاعات خود کاربر
router.get("/me", auth, getMyInfo);

// ✅ ویرایش اطلاعات خود کاربر
router.put("/me", auth, editMyInfo);

// ✅ آپلود آواتار
router.post("/me/avatar", auth, upload.single("avatar"), uploadAvatar);

router.delete("/me", auth, deleteMyAccount);

module.exports = router;
