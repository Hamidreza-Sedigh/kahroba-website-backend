// controllers/contactController.js
const ContactMessage = require("../models/ContactMessage");

exports.getMessages = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const total = await ContactMessage.countDocuments();
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .skip(pageNumber * pageSize)
      .limit(pageSize);

    res.json({ success: true, data: messages, total });
  } catch (err) {
    console.error("❌ Error fetching contact messages:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.json({ success: true, data: message });
  } catch (err) {
    console.error("❌ Error updating message:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ContactMessage.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Message not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error deleting message:", err);
    res.status(500).json({ error: "Server error" });
  }
};
