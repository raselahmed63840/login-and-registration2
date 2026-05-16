const jwt = require("jsonwebtoken");

let User;
try {
  User = require("../models/userModel");
} catch (err1) {
  try {
    User = require("../models/User");
  } catch (err2) {
    User = require("../models/user");
  }
}

const getDisplayName = (user) => {
  return (
    user?.fullName ||
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "Customer"
  );
};

exports.requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login or register first.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded._id || decoded.userId;

    let dbUser = null;

    if (User && userId) {
      try {
        dbUser = await User.findById(userId)
          .select("fullName name username email phone role")
          .lean();
      } catch {
        dbUser = null;
      }
    }

    req.user = {
      id: userId,
      fullName: dbUser?.fullName || decoded.fullName || "",
      name: getDisplayName(dbUser) || decoded.name || "Customer",
      username: dbUser?.username || decoded.username || "",
      email: dbUser?.email || decoded.email || "",
      phone: dbUser?.phone || decoded.phone || "",
      role: dbUser?.role || decoded.role || "customer",
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Login session expired. Please login again.",
    });
  }
};
