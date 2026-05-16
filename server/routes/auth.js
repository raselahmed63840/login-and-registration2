const express = require("express");
const router = express.Router();

const {
  register,
  login,
  firebaseLogin,
} = require("../controllers/authController");

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth route is working",
  });
});

router.post("/register", register);
router.post("/login", login);
router.post("/firebase-login", firebaseLogin);

module.exports = router;
