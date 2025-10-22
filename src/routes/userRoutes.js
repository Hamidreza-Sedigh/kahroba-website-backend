const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { registerUser, loginUser, editMyInfo, getMyInfo } = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ دریافت اطلاعات خود کاربر
router.get("/me", auth, getMyInfo);

// ✅ ویرایش اطلاعات خود کاربر
router.put("/me", auth, editMyInfo);


module.exports = router;
