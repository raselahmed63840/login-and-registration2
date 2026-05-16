const Review = require("../models/reviewModel");

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

const getReviewName = async (review) => {
  if (
    review.userName &&
    review.userName !== "Customer" &&
    review.userName !== "Guest" &&
    review.userName !== "Guest Customer"
  ) {
    return review.userName;
  }

  if (review.userId && User) {
    try {
      const dbUser = await User.findById(review.userId)
        .select("fullName name username email")
        .lean();

      return getDisplayName(dbUser);
    } catch {
      return review.userName || "Customer";
    }
  }

  if (review.userEmail) {
    return review.userEmail.split("@")[0];
  }

  return "Customer";
};

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviewsFromDb = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .lean();

    const reviews = await Promise.all(
      reviewsFromDb.map(async (review) => ({
        ...review,
        userName: await getReviewName(review),
      })),
    );

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
          totalReviews
        : 0;

    res.json({
      success: true,
      reviews,
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment, userName, userEmail } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Please login or register first to submit a review.",
      });
    }

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating and review text are required.",
      });
    }

    const ratingNumber = Number(rating);

    if (ratingNumber < 1 || ratingNumber > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    let dbUser = null;

    if (User) {
      try {
        dbUser = await User.findById(req.user.id)
          .select("fullName name username email")
          .lean();
      } catch {
        dbUser = null;
      }
    }

    const finalUserName =
      userName ||
      req.user.fullName ||
      req.user.name ||
      req.user.username ||
      getDisplayName(dbUser);

    const finalUserEmail = userEmail || req.user.email || dbUser?.email || "";

    const existingReview = await Review.findOne({
      productId,
      userId: req.user.id,
    });

    if (existingReview) {
      existingReview.rating = ratingNumber;
      existingReview.comment = comment;
      existingReview.userName = finalUserName;
      existingReview.userEmail = finalUserEmail;

      const updatedReview = await existingReview.save();

      return res.json({
        success: true,
        message: "Your review updated successfully.",
        review: updatedReview,
      });
    }

    const review = await Review.create({
      productId,
      userId: req.user.id,
      userName: finalUserName,
      userEmail: finalUserEmail,
      rating: ratingNumber,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
