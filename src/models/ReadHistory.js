// models/ReadHistory.js
const mongoose = require('mongoose');

const readHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  news: { type: mongoose.Schema.Types.ObjectId, ref: 'News', required: true },
  readAt: { type: Date, default: Date.now }
});

// اضافه کردن index منحصربه‌فرد
readHistorySchema.index({ user: 1, news: 1 }, { unique: true });
readHistorySchema.index({ user: 1, readAt: -1 });

module.exports = mongoose.model('ReadHistory', readHistorySchema);
