import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/admin6935`;

export const fetchAdminDashboard = async () => {
  const res = await axios.get(`${API_URL}/dashboard`);
  return res.data;
};

export const fetchAdminUsers = async () => {
  const res = await axios.get(`${API_URL}/users`);
  return res.data;
};

export const updateAdminUserRole = async (userId, role) => {
  const res = await axios.patch(`${API_URL}/users/${userId}/role`, { role });
  return res.data;
};

export const toggleAdminUserBlock = async (userId) => {
  const res = await axios.patch(`${API_URL}/users/${userId}/block`);
  return res.data;
};

export const deleteAdminUser = async (userId) => {
  const res = await axios.delete(`${API_URL}/users/${userId}`);
  return res.data;
};

export const fetchAdminOrders = async () => {
  const res = await axios.get(`${API_URL}/orders`);
  return res.data;
};

export const fetchAdminReviews = async () => {
  const res = await axios.get(`${API_URL}/reviews`);
  return res.data;
};

export const deleteAdminReview = async (reviewId) => {
  const res = await axios.delete(`${API_URL}/reviews/${reviewId}`);
  return res.data;
};

export const fetchCategoriesBrands = async () => {
  const res = await axios.get(`${API_URL}/categories-brands`);
  return res.data;
};
