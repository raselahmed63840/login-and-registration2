const express = require("express");
const router = express.Router();
const {
  getShippingZones,
  addShippingZone,
  updateShippingZone,
  deleteShippingZone
} = require("../controllers/shippingController");

router.get("/", getShippingZones);
router.post("/", addShippingZone);
router.put("/:id", updateShippingZone);
router.delete("/:id", deleteShippingZone);

module.exports = router;
