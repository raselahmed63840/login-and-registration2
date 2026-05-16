const express = require("express");
const router = express.Router();

const { trackOrder } = require("../controllers/trackOrderController");

router.get("/", trackOrder);
router.get("/:orderId", trackOrder);

module.exports = router;
