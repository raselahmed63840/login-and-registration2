const express = require("express");
const router = express.Router();

const {
  requestLivePermission,
  getLivePermissions,
  updateLivePermission,
  startLive,
  endLive,
  getActiveLives,
} = require("../controllers/liveController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/active", getActiveLives);

router.post(
  "/request-permission",
  protect,
  authorize("vendor"),
  requestLivePermission
);

router.get(
  "/permissions",
  protect,
  authorize("admin"),
  getLivePermissions
);

router.patch(
  "/permissions/:id",
  protect,
  authorize("admin"),
  updateLivePermission
);

router.post(
  "/start",
  protect,
  authorize("admin", "vendor"),
  startLive
);

router.patch(
  "/end/:id",
  protect,
  authorize("admin", "vendor"),
  endLive
);

module.exports = router;