const express = require("express");
const router = express.Router();
const {
  updateLogo,
  updateBanner,
  updateNotifications,
  updateSecurity
} = require("../controllers/settingsController");

router.put("/logo", updateLogo);
router.put("/banner", updateBanner);
router.put("/notifications", updateNotifications);
router.put("/security", updateSecurity);

module.exports = router;
