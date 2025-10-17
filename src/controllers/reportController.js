const Report = require("../models/Report");

// 📍 دریافت همه گزارش‌ها با پشتیبانی از صفحه‌بندی و فیلتر
exports.getReports = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const readFilter = req.query.read; // optional: true / false

    const filter = {};
    if (readFilter === "true") filter.read = true;
    if (readFilter === "false") filter.read = false;

    const [reports, total] = await Promise.all([
      Report.find(filter)
        .sort({ createdAt: -1 })
        .skip(pageNumber * pageSize)
        .limit(pageSize),
      Report.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: reports,
      total,
      pageNumber,
      pageSize,
    });
  } catch (err) {
    console.error("❌ Error fetching reports:", err);
    res.status(500).json({ success: false, error: "Server error while fetching reports" });
  }
};

// ✅ علامت‌گذاری یک گزارش به عنوان خوانده‌شده
exports.markReportAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!report)
      return res.status(404).json({ success: false, error: "Report not found" });

    res.json({ success: true, data: report });
  } catch (err) {
    console.error("❌ Error updating report:", err);
    res.status(500).json({ success: false, error: "Server error while updating report" });
  }
};

// 🗑️ حذف یک گزارش
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Report.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ success: false, error: "Report not found" });

    res.json({ success: true, message: "Report deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting report:", err);
    res.status(500).json({ success: false, error: "Server error while deleting report" });
  }
};
