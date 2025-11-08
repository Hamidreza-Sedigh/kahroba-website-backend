const multer = require("multer");
const path = require("path");
const fs = require("fs");

// مسیر مقصد فایل‌ها
const uploadDir =  path.join(__dirname, "../../uploads/avatars");

// اطمینان از وجود دایرکتوری
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// تنظیم محل ذخیره فایل‌ها
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `avatar-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, uniqueName);
  },
});

// فقط تصاویر مجازند
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("فرمت فایل باید تصویر باشد"), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
