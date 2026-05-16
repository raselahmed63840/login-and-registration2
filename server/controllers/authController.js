const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("../config/firebaseAdmin");
const User = require("../models/User");

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in server/.env file");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const safeUser = (user) => {
  return {
    _id: user._id,
    name: user.name || user.fullName || "",
    fullName: user.fullName || user.name || "",
    username: user.username || "",
    email: user.email || "",
    phone: user.phone || "",
    role: user.role || "customer",
    isBlocked: user.isBlocked || false,
    authProvider: user.authProvider || "local",
    firebaseUid: user.firebaseUid || "",
    photoURL: user.photoURL || "",
  };
};

// ===============================
// Manual Register
// ===============================
exports.register = async (req, res) => {
  try {
    const { name, fullName, username, email, phone, password } = req.body;

    const finalName = fullName || name;

    if (!finalName || !password || (!email && !phone)) {
      return res.status(400).json({
        success: false,
        message: "Name, password and email or phone are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const searchConditions = [];

    if (email) {
      searchConditions.push({ email: email.toLowerCase().trim() });
    }

    if (phone) {
      searchConditions.push({ phone: phone.trim() });
    }

    const existingUser = await User.findOne({
      $or: searchConditions,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: finalName.trim(),
      fullName: finalName.trim(),
      username: username || "",
      email: email ? email.toLowerCase().trim() : "",
      phone: phone ? phone.trim() : "",
      password: hashedPassword,
      role: "customer",
      authProvider: "local",
      isBlocked: false,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token: generateToken(user._id),
      user: safeUser(user),
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

// ===============================
// Manual Login
// ===============================
exports.login = async (req, res) => {
  try {
    const { credential, email, phone, password } = req.body;

    const loginCredential = credential || email || phone;

    if (!loginCredential || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/phone and password are required",
      });
    }

    const trimmedCredential = loginCredential.trim();

    const user = await User.findOne({
      $or: [
        { email: trimmedCredential.toLowerCase() },
        { phone: trimmedCredential },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked. Please contact support.",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: `This account uses ${
          user.authProvider || "social"
        } login. Please use social login.`,
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    return res.json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user: safeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

// ===============================
// Firebase Google/Facebook Login
// ===============================
exports.firebaseLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Firebase ID token is required",
      });
    }

    if (!process.env.FIREBASE_PROJECT_ID) {
      return res.status(500).json({
        success: false,
        message: "FIREBASE_PROJECT_ID missing in server/.env",
      });
    }

    if (!process.env.FIREBASE_CLIENT_EMAIL) {
      return res.status(500).json({
        success: false,
        message: "FIREBASE_CLIENT_EMAIL missing in server/.env",
      });
    }

    if (!process.env.FIREBASE_PRIVATE_KEY) {
      return res.status(500).json({
        success: false,
        message: "FIREBASE_PRIVATE_KEY missing in server/.env",
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const firebaseUid = decodedToken.uid;

    const email = decodedToken.email
      ? decodedToken.email.toLowerCase().trim()
      : "";

    const displayName =
      decodedToken.name ||
      decodedToken.displayName ||
      decodedToken.email?.split("@")[0] ||
      "Customer";

    const photoURL = decodedToken.picture || "";

    const signInProvider =
      decodedToken.firebase?.sign_in_provider || "firebase";

    let authProvider = "firebase";

    if (signInProvider.includes("google")) {
      authProvider = "google";
    }

    if (signInProvider.includes("facebook")) {
      authProvider = "facebook";
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not found from Firebase account",
      });
    }

    let user = await User.findOne({
      $or: [{ firebaseUid }, { email }],
    });

    if (user) {
      if (user.isBlocked) {
        return res.status(403).json({
          success: false,
          message: "Your account is blocked. Please contact support.",
        });
      }

      user.firebaseUid = user.firebaseUid || firebaseUid;
      user.authProvider = user.authProvider || authProvider;
      user.photoURL = user.photoURL || photoURL;
      user.name = user.name || displayName;
      user.fullName = user.fullName || displayName;

      await user.save();
    } else {
      user = await User.create({
        name: displayName,
        fullName: displayName,
        username: displayName.replace(/\s+/g, "").toLowerCase(),
        email,
        password: "",
        firebaseUid,
        authProvider,
        photoURL,
        role: "customer",
        isBlocked: false,
      });
    }

    return res.json({
      success: true,
      message: "Firebase login successful",
      token: generateToken(user._id),
      user: safeUser(user),
    });
  } catch (error) {
    console.error("Firebase login error:", error);

    return res.status(401).json({
      success: false,
      message: error.message || "Firebase authentication failed",
      code: error.code || "FIREBASE_AUTH_FAILED",
    });
  }
};
