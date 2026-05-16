import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getSafeImage = (item) => {
  const image = item.image || item.images?.[0]?.url || item.images?.[0] || "";

  if (typeof image === "object" && image.url) {
    return image.url;
  }

  return image || "https://via.placeholder.com/80";
};

const normalizeOrderData = (orderData = {}) => {
  const shipping = orderData.shippingAddress || {};

  const subtotal = Number(orderData.subtotal ?? orderData.subTotal ?? 0);
  const deliveryCost = Number(orderData.deliveryCost || 0);
  const discount = Number(orderData.discount || 0);
  const total = Number(
    orderData.total ??
      orderData.totalAmount ??
      subtotal + deliveryCost - discount,
  );

  return {
    ...orderData,

    customerName: orderData.customerName || shipping.fullName || "",
    name: orderData.name || shipping.fullName || "",
    phone: orderData.phone || shipping.phone || "",
    district: orderData.district || shipping.district || "",
    area: orderData.area || shipping.thana || "",
    address: orderData.address || shipping.addressLine || "",

    paymentMethod: orderData.paymentMethod || "Cash On Delivery",

    items: Array.isArray(orderData.items)
      ? orderData.items.map((item, index) => ({
          productId: String(item.productId || item.id || item._id || index),
          title: item.title || item.name || "Product",
          image: getSafeImage(item),
          price: Number(item.price || 0),
          quantity: Number(item.quantity || item.qty || 1),
        }))
      : [],

    subtotal,
    subTotal: subtotal,
    deliveryCost,
    discount,
    total,
    totalAmount: total,

    status: orderData.status || "Pending",
  };
};

export const createOrder = async (orderData) => {
  const payload = normalizeOrderData(orderData);

  const res = await axios.post(`${API_BASE_URL}/api/orders`, payload);

  return res.data;
};

export const fetchAdminOrders = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/orders`);
  return res.data;
};

export const updateOrderStatus = async (orderId, data) => {
  const res = await axios.patch(
    `${API_BASE_URL}/api/orders/${orderId}/status`,
    data,
  );

  return res.data;
};

export const deleteOrder = async (orderId) => {
  const res = await axios.delete(`${API_BASE_URL}/api/orders/${orderId}`);
  return res.data;
};
