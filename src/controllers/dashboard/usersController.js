const User = require("../../models/User");

// ✅ دریافت اطلاعات یک کاربر
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password"); // پسورد برنگردان

    if (!user)
      return res.status(404).json({ message: "کاربر پیدا نشد." });

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "خطا در دریافت اطلاعات کاربر." });
  }
};

// ✅ ویرایش کاربر
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedUser)
      return res.status(404).json({ message: "کاربر پیدا نشد." });

    res.json({
      message: "اطلاعات کاربر با موفقیت بروزرسانی شد.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "خطا در بروزرسانی کاربر." });
  }
};

// ✅ حذف کاربر
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser)
      return res.status(404).json({ message: "کاربر پیدا نشد." });

    res.json({ message: "کاربر با موفقیت حذف شد." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "خطا در حذف کاربر." });
  }
};
