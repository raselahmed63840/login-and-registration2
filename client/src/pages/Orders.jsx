import React, { useEffect, useState } from "react";
import axios from "axios";
import { downloadInvoicePDF } from "../utils/invoicePdf";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getAuthUser = () => {
  try {
    const savedUser =
      localStorage.getItem("authUser") || localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : {};
  } catch {
    return {};
  }
};

const getUserId = (user) => {
  return user?._id || user?.id || user?.userId || "demoUser";
};

const formatMoney = (amount = 0) => {
  return `৳${Number(amount || 0).toLocaleString()}`;
};

const getOrderItems = (order) => {
  return order?.items || order?.products || order?.cartItems || [];
};

const getOrderTotal = (order) => {
  const items = getOrderItems(order);

  const subTotal = items.reduce((total, item) => {
    return total + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);

  return order.totalAmount || order.total || subTotal;
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

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getAuthUser();
  const userId = getUserId(user);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        let finalOrders = [];

        const res = await axios.get(
          `${API_BASE_URL}/api/checkout/orders/${userId}`,
        );

        if (res.data?.success && Array.isArray(res.data.orders)) {
          finalOrders = res.data.orders;
        }

        // old demoUser order fallback
        if (finalOrders.length === 0 && userId !== "demoUser") {
          const demoRes = await axios.get(
            `${API_BASE_URL}/api/checkout/orders/demoUser`,
          );

          if (demoRes.data?.success && Array.isArray(demoRes.data.orders)) {
            finalOrders = demoRes.data.orders;
          }
        }

        // localStorage fallback
        if (finalOrders.length === 0) {
          const localOrders = JSON.parse(localStorage.getItem("orders")) || [];
          finalOrders = Array.isArray(localOrders) ? localOrders : [];
        }

        setOrders(finalOrders);
      } catch (error) {
        console.error("Order load failed:", error);

        const localOrders = JSON.parse(localStorage.getItem("orders")) || [];
        setOrders(Array.isArray(localOrders) ? localOrders : []);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-lg font-semibold text-slate-700">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
          <p className="text-slate-500 mt-1">
            View your order history and download invoice PDF.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border rounded-2xl p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">
              No orders found
            </h2>
            <p className="text-slate-500 mt-2">
              After placing an order, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order, index) => {
              const orderId = order._id || order.id || order.orderId || index;
              const items = getOrderItems(order);
              const total = getOrderTotal(order);

              return (
                <div
                  key={orderId}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 py-4 border-b bg-slate-50">
                    <div>
                      <h2 className="font-bold text-slate-900">
                        Order #{String(orderId).slice(-8)}
                      </h2>

                      <p className="text-sm text-slate-500">
                        Date:{" "}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-semibold">
                        {order.status || order.orderStatus || "Pending"}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          downloadInvoicePDF(
                            {
                              ...order,
                              shippingAddress: formatAddress(
                                order.shippingAddress,
                              ),
                            },
                            user,
                          )
                        }
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                      >
                        Download Invoice
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="space-y-3">
                      {items.length === 0 ? (
                        <p className="text-slate-500">No products found.</p>
                      ) : (
                        items.map((item, itemIndex) => (
                          <div
                            key={item._id || item.id || itemIndex}
                            className="flex items-center justify-between gap-4 border rounded-xl p-3"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  item.image ||
                                  item.images?.[0]?.url ||
                                  "https://via.placeholder.com/80"
                                }
                                alt={item.title || item.name || "Product"}
                                className="w-14 h-14 rounded-lg object-cover border bg-white"
                              />

                              <div>
                                <h3 className="font-semibold text-slate-800">
                                  {item.title || item.name || "Product"}
                                </h3>

                                <p className="text-sm text-slate-500">
                                  Qty: {item.quantity || 1}
                                </p>
                              </div>
                            </div>

                            <p className="font-bold text-slate-900">
                              {formatMoney(
                                Number(item.price || 0) *
                                  Number(item.quantity || 1),
                              )}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="mt-5 flex justify-end">
                      <div className="w-full sm:w-80 bg-slate-50 rounded-xl p-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Payment</span>
                          <span>{order.paymentMethod || "COD"}</span>
                        </div>

                        <div className="flex justify-between text-sm mb-2">
                          <span>Delivery</span>
                          <span>
                            {formatMoney(
                              order.deliveryCost || order.shippingCost || 0,
                            )}
                          </span>
                        </div>

                        <div className="border-t pt-3 flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>{formatMoney(total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
