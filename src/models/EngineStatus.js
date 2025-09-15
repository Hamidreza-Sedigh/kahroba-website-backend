// models/EngineStatus.js
const mongoose = require("mongoose");

const engineStatusSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: "main" }, // برای singleton
  status: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("EngineStatus", engineStatusSchema);
