const express = require("express");
const router = express.Router();
const usersRoutes = require("./dashboard/users");

const readHistoryController = require("../controllers/readHistoryController");
const dashboardController = require("../controllers/dashboardController");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const { getReports, markReportAsRead, deleteReport } = require("../controllers/reportController");


// Protected: فقط کاربران لاگین شده می‌توانند آمار داشبورد را ببینند
// router.get("/stats", verifyToken, dashboardController.getStats);
router.get("/users/paginated", auth, dashboardController.getUsersPaginated);

router.use("/users", usersRoutes);

router.get("/history", auth, readHistoryController.getUserReadHistory);
router.get("/users", dashboardController.getUsers);


router.get("/reports", auth, isAdmin, getReports);
router.patch("/reports/:id/read", auth, isAdmin, markReportAsRead);
router.delete("/reports/:id", auth, isAdmin, deleteReport);

router.get('/stats', auth, dashboardController.getUserStats);


module.exports = router;
