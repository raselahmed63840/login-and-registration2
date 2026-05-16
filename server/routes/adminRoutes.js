const express = require("express");
const router = express.Router();

const {
  getAdminDashboard,
  getAdminSummary,
  getAllUsers,
  updateUserRole,
  toggleUserBlock,
  deleteUser,
  getAllOrders,
  getAllReviews,
  deleteReview,
  getCategoriesAndBrands,
} = require("../controllers/adminController");

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Admin route working",
  });
});

// Dashboard real data
router.get("/dashboard", getAdminDashboard);
router.get("/summary", getAdminDashboard);

// Users
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id/block", toggleUserBlock);
router.delete("/users/:id", deleteUser);

// Orders
router.get("/orders", getAllOrders);

// Reviews
router.get("/reviews", getAllReviews);
router.delete("/reviews/:id", deleteReview);

// Categories & Brands
router.get("/categories-brands", getCategoriesAndBrands);

module.exports = router;
