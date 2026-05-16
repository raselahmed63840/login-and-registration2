const express = require("express");
const router = express.Router();
const { addToCart, removeFromCart } = require("../controllers/cartController");

router.post("/add", addToCart);
router.post("/remove", removeFromCart);

module.exports = router;