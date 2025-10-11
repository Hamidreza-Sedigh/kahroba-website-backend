const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/dashboard/usersController");
const auth = require("../../middlewares/auth"); // در صورت نیاز برای محدودسازی دسترسی

// ✅ دریافت اطلاعات یک کاربر
router.get("/:id", auth, usersController.getUserById);

// ✅ ویرایش اطلاعات کاربر
router.put("/:id", auth, usersController.updateUser);

// ✅ حذف کاربر
router.delete("/:id", auth, usersController.deleteUser);

module.exports = router;
