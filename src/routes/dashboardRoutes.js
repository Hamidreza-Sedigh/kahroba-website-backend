const express = require("express");
const router = express.Router();
const usersRoutes = require("./dashboard/users");

const readHistoryController = require("../controllers/readHistoryController");
const dashboardController = require("../controllers/dashboardController");
const auth = require("../middlewares/auth");


// Protected: فقط کاربران لاگین شده می‌توانند آمار داشبورد را ببینند
// router.get("/stats", verifyToken, dashboardController.getStats);
router.get("/users/paginated", auth, dashboardController.getUsersPaginated);

router.use("/users", usersRoutes);

router.get("/history", auth, readHistoryController.getUserReadHistory);
router.get("/users", dashboardController.getUsers);



module.exports = router;
