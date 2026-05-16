import React, { useEffect, useState } from "react";
import { deleteAdminReview, fetchAdminReviews } from "../../api/adminApi";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const getImageUrl = (image) => {
    if (!image) return "";

    if (typeof image === "object" && image.url) {
      return image.url;
    }

    const img = String(image);

    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }

    if (img.startsWith("/uploads")) {
      return `${API_BASE_URL}${img}`;
    }

    if (img.startsWith("/")) {
      return img;
    }

    return `${API_BASE_URL}/uploads/${img}`;
  };

  const loadReviews = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await fetchAdminReviews();

      if (data.success) {
        setReviews(data.reviews || []);
      } else {
        setReviews([]);
        setMessage(data.message || "Failed to load reviews.");
      }
    } catch (error) {
      console.error("Admin reviews fetch error:", error);

      setReviews([]);
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to load reviews.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    const ok = window.confirm("Are you sure you want to delete this review?");
    if (!ok) return;

    try {
      const data = await deleteAdminReview(reviewId);

      if (data.success) {
        setMessage("Review deleted successfully.");
        await loadReviews();
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Review delete failed.",
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  const getProductTitle = (review) => {
    if (review.productTitle) return review.productTitle;
    if (review.productId?.title) return review.productId.title;
    if (review.product?.title) return review.product.title;

    return "Product";
  };

  const getCustomerName = (review) => {
    return (
      review.customerName ||
      review.userName ||
      review.name ||
      review.user?.fullName ||
      review.user?.name ||
      review.user?.username ||
      review.userEmail?.split("@")[0] ||
      "Customer"
    );
  };

  const getCustomerImage = (review) => {
    return getImageUrl(
      review.profileImage ||
        review.profilePic ||
        review.avatar ||
        review.image ||
        review.photoURL ||
        review.picture,
    );
  };

  const getInitial = (name) => {
    return String(name || "C")
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">Reviews</h1>
          <p className="text-slate-600 mt-2">Total reviews: {reviews.length}</p>
        </div>

        {message && (
          <div className="mb-4 rounded-xl border border-orange-300 bg-orange-50 text-orange-600 px-4 py-3">
            {message}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border p-5">
          {loading ? (
            <p className="text-slate-500">Loading reviews...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b">
                    <th className="text-left p-4">Product</th>
                    <th className="text-left p-4">Customer</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Rating</th>
                    <th className="text-left p-4">Comment</th>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {reviews.map((review) => {
                    const customerName = getCustomerName(review);
                    const customerImage = getCustomerImage(review);

                    return (
                      <tr
                        key={review._id}
                        className="border-b hover:bg-slate-50"
                      >
                        <td className="p-4 font-semibold">
                          {getProductTitle(review)}
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full overflow-hidden bg-orange-100 text-orange-600 flex items-center justify-center font-bold border">
                              {customerImage ? (
                                <img
                                  src={customerImage}
                                  alt={customerName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                getInitial(customerName)
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-900">
                                {customerName}
                              </p>
                              <p className="text-xs text-slate-500">Customer</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">{review.userEmail || "-"}</td>

                        <td className="p-4">
                          <span className="text-yellow-500">⭐</span>{" "}
                          {review.rating}
                        </td>

                        <td className="p-4">{review.comment}</td>

                        <td className="p-4">{formatDate(review.createdAt)}</td>

                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => handleDelete(review._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {reviews.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center p-8 text-slate-500"
                      >
                        No reviews found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
