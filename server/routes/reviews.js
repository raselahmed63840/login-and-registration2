const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/authMiddleware");

const {
  getProductReviews,
  createReview,
} = require("../controllers/reviewController");

router.get("/:productId", getProductReviews);
router.post("/:productId", requireAuth, createReview);

module.exports = router;
