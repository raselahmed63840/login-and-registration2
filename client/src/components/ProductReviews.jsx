import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  fetchProductReviews,
  getAuthToken,
  getLoggedInUser,
  submitProductReview,
} from "../api/reviewApi";

const ProductReviews = ({ productId }) => {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = getAuthToken();
  const user = getLoggedInUser();
  const isLoggedIn = Boolean(token && user);

  const loadReviews = async () => {
    try {
      const data = await fetchProductReviews(productId);

      if (data.success) {
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
        setTotalReviews(data.totalReviews || 0);
      }
    } catch (error) {
      console.error("Load reviews error:", error);
    }
  };

  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setMessage("Please login or register first to submit a review.");
      return;
    }

    if (!comment || !rating) {
      setMessage("Please write your review and select rating.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const data = await submitProductReview(productId, {
        rating,
        comment,
      });

      if (data.success) {
        setMessage(data.message || "Review submitted successfully.");
        setComment("");
        setRating("");
        await loadReviews();
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Review submit failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border p-6 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        <div>
          <h2 className="text-5xl font-bold text-green-950">{averageRating}</h2>

          <p className="mt-2 text-slate-700">Average Rating</p>

          <div className="text-yellow-500 mt-2">
            {"★".repeat(Math.round(averageRating))}
            {"☆".repeat(5 - Math.round(averageRating))}
          </div>

          <p className="mt-3 text-slate-700">{totalReviews} Reviews</p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            Submit Your Review
          </h3>

          <div className="w-14 h-[3px] bg-orange-500 mt-2 mb-5"></div>

          {!isLoggedIn && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-red-600 mb-3">
                Please login or register first to submit a review.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="px-5 py-2 rounded-lg border border-orange-500 text-orange-500 font-semibold"
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="px-5 py-2 rounded-lg bg-orange-500 text-white font-semibold"
                >
                  Register
                </button>
              </div>
            </div>
          )}

          {message && (
            <p
              className={`mb-4 ${
                message.toLowerCase().includes("success")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={!isLoggedIn}
              placeholder="Write Your Review Here..."
              rows="6"
              className={`w-full border rounded-lg p-4 outline-none ${
                isLoggedIn
                  ? "bg-white focus:border-orange-500"
                  : "bg-slate-100 cursor-not-allowed"
              }`}
            />

            <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4 mt-4">
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                disabled={!isLoggedIn}
                className={`border rounded-lg px-4 py-3 outline-none ${
                  isLoggedIn
                    ? "bg-white focus:border-orange-500"
                    : "bg-slate-100 cursor-not-allowed"
                }`}
              >
                <option value="">Select One</option>
                <option value="5">5 Star - Excellent</option>
                <option value="4">4 Star - Very Good</option>
                <option value="3">3 Star - Good</option>
                <option value="2">2 Star - Average</option>
                <option value="1">1 Star - Poor</option>
              </select>

              <button
                type="submit"
                disabled={!isLoggedIn || loading}
                className={`rounded-lg px-5 py-3 font-bold text-white ${
                  isLoggedIn
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-slate-400 cursor-not-allowed"
                }`}
              >
                {loading ? "SUBMITTING..." : "SUBMIT REVIEW"}
              </button>
            </div>
          </form>

          <div className="mt-8 space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">
                    {review.userName || "User"}
                  </h4>

                  <span className="text-yellow-500">
                    {"★".repeat(Number(review.rating))}
                    {"☆".repeat(5 - Number(review.rating))}
                  </span>
                </div>

                <p className="text-slate-600 mt-2">{review.comment}</p>
              </div>
            ))}

            {reviews.length === 0 && (
              <p className="text-slate-500">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
