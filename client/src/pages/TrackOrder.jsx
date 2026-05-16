import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const onlyDigits = (value = "") => {
  return String(value).replace(/\D/g, "");
};

const normalizeBDPhone = (value = "") => {
  let phone = onlyDigits(value);

  if (!phone) return "";

  if (phone.startsWith("880") && phone.length >= 13) {
    phone = "0" + phone.slice(3);
  }

  if (phone.length === 10 && phone.startsWith("1")) {
    phone = "0" + phone;
  }

  if (phone.length > 11) {
    phone = phone.slice(-11);
  }

  return phone;
};

const phoneMatches = (savedPhone = "", inputPhone = "") => {
  const saved = normalizeBDPhone(savedPhone);
  const input = normalizeBDPhone(inputPhone);

  if (!saved || !input) return false;

  return saved === input;
};

const idMatches = (order, inputOrderId = "") => {
  const cleanInput = String(inputOrderId).trim();

  if (!cleanInput) return false;

  const mongoId = String(order._id || "");
  const customOrderId = String(order.orderId || "");

  return (
    mongoId === cleanInput ||
    mongoId.endsWith(cleanInput) ||
    customOrderId === cleanInput ||
    customOrderId.endsWith(cleanInput)
  );
};

const getSavedPhones = (order) => {
  return [
    order.shippingAddress?.phone,
    order.billingAddress?.phone,
    order.phone,
    order.customerPhone,
  ].filter(Boolean);
};

const searchLocalStorageOrders = (orderId, phone) => {
  try {
    const localOrders = JSON.parse(localStorage.getItem("orders")) || [];

    if (!Array.isArray(localOrders)) return [];

    return localOrders.filter((order) => {
      const matchByOrderId = orderId ? idMatches(order, orderId) : false;

      const matchByPhone = phone
        ? getSavedPhones(order).some((savedPhone) =>
            phoneMatches(savedPhone, phone),
          )
        : false;

      return matchByOrderId || matchByPhone;
    });
  } catch {
    return [];
  }
};

const getOrderItems = (order) => {
  return order?.items || order?.products || order?.cartItems || [];
};

const formatMoney = (amount = 0) => {
  return `৳${Number(amount || 0).toLocaleString()}`;
};

const formatAddress = (address) => {
  if (!address) return "N/A";

  if (typeof address === "string") return address;

  return [
    address.fullName,
    address.phone,
    address.district,
    address.thana,
    address.addressLine,
  ]
    .filter(Boolean)
    .join(", ");
};

const getTotal = (order) => {
  const items = getOrderItems(order);

  const subTotal = items.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);

  return order.totalAmount || order.total || subTotal;
};

const getStatusSteps = (status = "Pending") => {
  const steps = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];

  const currentIndex = steps.findIndex(
    (step) => step.toLowerCase() === String(status).toLowerCase(),
  );

  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  return steps.map((step, index) => ({
    label: step,
    active: safeIndex >= index,
  }));
};

const OrderResultCard = ({ order }) => {
  const steps = getStatusSteps(order.status || "Pending");
  const items = getOrderItems(order);

  const orderId = order._id || order.orderId || "N/A";

  return (
    <div className="mt-6 space-y-5 border-t pt-6">
      <div className="border rounded-2xl p-5 bg-slate-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Order ID</p>
            <p className="font-bold text-slate-900 break-all">{orderId}</p>
          </div>

          <span className="self-start sm:self-center px-4 py-2 rounded-full bg-orange-50 text-orange-600 font-semibold">
            {order.status || "Pending"}
          </span>
        </div>
      </div>

      <div className="border rounded-2xl p-5 bg-white">
        <h2 className="font-bold text-lg mb-4 text-slate-900">
          Delivery Progress
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {steps.map((step, index) => (
            <div key={step.label} className="flex sm:flex-col gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  step.active
                    ? "bg-orange-500 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {index + 1}
              </div>

              <div>
                <p
                  className={`font-semibold ${
                    step.active ? "text-orange-600" : "text-slate-500"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border rounded-2xl p-5 bg-white">
        <h2 className="font-bold text-lg mb-4 text-slate-900">Order Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <p>
            <span className="font-semibold">Customer:</span>{" "}
            {order.shippingAddress?.fullName || "N/A"}
          </p>

          <p>
            <span className="font-semibold">Phone:</span>{" "}
            {order.shippingAddress?.phone || "N/A"}
          </p>

          <p>
            <span className="font-semibold">Payment:</span>{" "}
            {order.paymentMethod || "Cash On Delivery"}
          </p>

          <p>
            <span className="font-semibold">Total:</span>{" "}
            {formatMoney(getTotal(order))}
          </p>

          <p className="sm:col-span-2">
            <span className="font-semibold">Address:</span>{" "}
            {formatAddress(order.shippingAddress)}
          </p>
        </div>
      </div>

      <div className="border rounded-2xl p-5 bg-white">
        <h2 className="font-bold text-lg mb-4 text-slate-900">Products</h2>

        {items.length === 0 ? (
          <p className="text-slate-500">No products found.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item._id || item.productId || index}
                className="flex items-center justify-between gap-3 border rounded-xl p-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      item.image ||
                      item.images?.[0]?.url ||
                      "https://via.placeholder.com/80"
                    }
                    alt={item.title || item.name || "Product"}
                    className="w-14 h-14 rounded-lg border object-cover bg-white"
                  />

                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.title || item.name || "Product"}
                    </p>

                    <p className="text-sm text-slate-500">
                      Qty: {item.quantity || 1}
                    </p>
                  </div>
                </div>

                <p className="font-bold text-slate-900">
                  {formatMoney(
                    Number(item.price || 0) * Number(item.quantity || 1),
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();

    const cleanOrderId = orderId.trim();
    const cleanPhone = phone.trim();

    setMessage("");
    setResults([]);

    if (!cleanOrderId && !cleanPhone) {
      setMessageType("error");
      setMessage("Please enter Order ID or Phone Number");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE_URL}/api/track-order`, {
        params: {
          orderId: cleanOrderId,
          phone: cleanPhone,
        },
      });

      const foundOrders = Array.isArray(res.data?.orders)
        ? res.data.orders
        : res.data?.order
          ? [res.data.order]
          : [];

      if (res.data?.success && foundOrders.length > 0) {
        setResults(foundOrders);
        setMessageType("success");

        if (cleanPhone && !cleanOrderId && foundOrders.length > 1) {
          setMessage(
            `${foundOrders.length} orders found for this phone number`,
          );
        } else {
          setMessage("Order found successfully");
        }
      } else {
        setMessageType("error");
        setMessage("Order not found");
      }
    } catch (error) {
      const localOrders = searchLocalStorageOrders(cleanOrderId, cleanPhone);

      if (localOrders.length > 0) {
        setResults(localOrders);
        setMessageType("success");

        if (cleanPhone && !cleanOrderId && localOrders.length > 1) {
          setMessage(
            `${localOrders.length} orders found from local backup for this phone number`,
          );
        } else {
          setMessage("Order found from local backup");
        }
      } else {
        setMessageType("error");
        setMessage(
          error.response?.data?.message ||
            "Order not found. Please check Order ID or phone number.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-3 sm:px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border shadow p-5 sm:p-8">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Track Order</h1>

        <p className="text-slate-500 mb-6">
          Enter Order ID or Phone Number. You can use any one option.
        </p>

        <form onSubmit={handleTrack} className="grid grid-cols-1 gap-3">
          <input
            type="text"
            placeholder="Enter order id"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:border-orange-500"
          />

          <div className="text-center text-sm text-slate-400 font-semibold">
            OR
          </div>

          <input
            type="text"
            placeholder="Enter phone number ex: 017********"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:border-orange-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-6 py-3 rounded-xl font-semibold"
          >
            {loading ? "Tracking..." : "Track Order"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-5 rounded-xl border px-4 py-3 ${
              messageType === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-6">
            {results.map((order, index) => (
              <OrderResultCard
                key={order._id || order.orderId || index}
                order={order}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
