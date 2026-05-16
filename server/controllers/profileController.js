const Profile = require("../models/profileModel");

const createDefaultProfile = (userId) => ({
  userId,
  fullName: "Mahbub",
  profileImage: "https://i.pravatar.cc/150?img=12",
  dateOfBirth: "",
  gender: "Male",
  phone: "",
  email: "",
  username: "",
  shippingAddress: "",
  billingAddress: "",
});

exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    let profile = await Profile.findOne({ userId });

    if (!profile) {
      profile = await Profile.create(createDefaultProfile(userId));
    }

    return res.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const payload = {
      userId,
      fullName: req.body.fullName || "",
      profileImage: req.body.profileImage || "",
      dateOfBirth: req.body.dateOfBirth || "",
      gender: req.body.gender || "",
      phone: req.body.phone || "",
      email: req.body.email || "",
      username: req.body.username || "",
      shippingAddress: req.body.shippingAddress || "",
      billingAddress: req.body.billingAddress || "",
    };

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      payload,
      { new: true, upsert: true, runValidators: true }
    );

    return res.json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};