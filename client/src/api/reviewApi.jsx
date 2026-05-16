import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getAuthToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("shopEaseToken") ||
    ""
  );
};

export const getLoggedInUser = () => {
  const keys = ["user", "currentUser", "shopEaseUser", "authUser"];

  for (const key of keys) {
    const value = localStorage.getItem(key);

    if (!value) continue;

    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  return null;
};

export const fetchProductReviews = async (productId) => {
  const res = await axios.get(`${API_BASE_URL}/api/reviews/${productId}`);
  return res.data;
};

export const submitProductReview = async (productId, reviewData) => {
  const token = getAuthToken();

  const res = await axios.post(
    `${API_BASE_URL}/api/reviews/${productId}`,
    reviewData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
