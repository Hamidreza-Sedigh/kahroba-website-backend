const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, trim: true, unique: true, sparse: true },
  email: { type: String, lowercase: true, trim: true, sparse: true, unique: true },
  phone: { type: String, trim: true, sparse: true, unique: true },
  password: { type: String, required: true }, // هش شده ذخیره می‌شود
  name: { type: String, trim: true },
  role: {
    type: String,
    enum: ["admin", "reporter", "user"],
    default: "user",
  },
  active: { type: Boolean, default: true },
  crawlerAdmin: { type: Boolean, default: false },
  providers: [{ type: String, enum: ["local", "google", "telegram"], default: "local" }],
  createdAt: { type: Date, default: Date.now },
});


// حداقل یکی از email یا phone باید وجود داشته باشد
UserSchema.pre("validate", function (next) {
  if (!this.email && !this.phone) {
    return next(new Error("حداقل یکی از فیلدهای email یا phone باید پر شود."));
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
