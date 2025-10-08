const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // هش شده ذخیره میشه
  name: { type: String}, 
  role: {
    type: String,
    enum: ["admin", "reporter", "user"],
    default: "admin",
  },
  // ✅ فیلد جدید: وضعیت فعال بودن
  active: {
    type: Boolean,
    default: true,
  },
  crawlerAdmin: { type: Boolean,  default: false },
  createdAt: { type: Date, default: Date.now },

});

module.exports = mongoose.model("User", UserSchema);
