const express = require("express");
const router = express.Router();
const readHistoryController = require("../controllers/readHistoryController");
const auth = require("../middlewares/auth");


// Protected: فقط کاربران لاگین شده می‌توانند آمار داشبورد را ببینند
// router.get("/stats", verifyToken, dashboardController.getStats);
router.get("/history", auth, readHistoryController.getUserReadHistory);




module.exports = router;
