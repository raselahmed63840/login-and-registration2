import React, { useEffect, useState } from "react";
import {
  deleteOrder,
  fetchAdminOrders,
  updateOrderStatus,
} from "../../api/orderApi";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const data = await fetchAdminOrders();

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Admin orders fetch error:", error);
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to load orders.",
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      const data = await updateOrderStatus(orderId, { status });

      if (data.success) {
        setMessage("Order status updated.");
        await loadOrders();
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Status update failed.",
      );
    }
  };

  const handlePaymentChange = async (orderId, paymentStatus) => {
    try {
      const data = await updateOrderStatus(orderId, { paymentStatus });

      if (data.success) {
        setMessage("Payment status updated.");
        await loadOrders();
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Payment update failed.",
      );
    }
  };

  const handleDelete = async (orderId) => {
    const ok = window.confirm("Are you sure you want to delete this order?");
    if (!ok) return;

    try {
      const data = await deleteOrder(orderId);

      if (data.success) {
        setMessage("Order deleted successfully.");
        await loadOrders();
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Order delete failed.",
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">Orders</h1>
          <p className="text-slate-600 mt-1">Total orders: {orders.length}</p>
        </div>

        {message && (
          <div className="mb-4 rounded-xl border border-orange-300 bg-orange-50 text-orange-600 px-4 py-3">
            {message}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border p-5">
          {loading ? (
            <p className="text-slate-500">Loading orders...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b">
                    <th className="text-left p-4">Order ID</th>
                    <th className="text-left p-4">Customer</th>
                    <th className="text-left p-4">Phone</th>
                    <th className="text-left p-4">Total</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Payment</th>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr className="border-b">
                        <td className="p-4 font-semibold">{order.orderId}</td>

                        <td className="p-4">
                          <p className="font-semibold">{order.customerName}</p>
                          <p className="text-sm text-slate-500">
                            {order.district} {order.area}
                          </p>
                        </td>

                        <td className="p-4">{order.phone}</td>

                        <td className="p-4 font-bold text-orange-600">
                          ৳{Number(order.total || 0).toFixed(2)}
                        </td>

                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className="border rounded-lg px-3 py-2 bg-white"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="p-4">
                          <select
                            value={order.paymentStatus}
                            onChange={(e) =>
                              handlePaymentChange(order._id, e.target.value)
                            }
                            className="border rounded-lg px-3 py-2 bg-white"
                          >
                            <option value="Unpaid">Unpaid</option>
                            <option value="Paid">Paid</option>
                          </select>
                        </td>

                        <td className="p-4">{formatDate(order.createdAt)}</td>

                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedOrder(
                                  expandedOrder === order._id
                                    ? null
                                    : order._id,
                                )
                              }
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                            >
                              View
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(order._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>

                      {expandedOrder === order._id && (
                        <tr className="bg-slate-50 border-b">
                          <td colSpan="8" className="p-5">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                              <div>
                                <h3 className="font-bold mb-3">
                                  Shipping Details
                                </h3>

                                <p>
                                  <b>Name:</b> {order.customerName}
                                </p>
                                <p>
                                  <b>Phone:</b> {order.phone}
                                </p>
                                <p>
                                  <b>District:</b> {order.district || "-"}
                                </p>
                                <p>
                                  <b>Area:</b> {order.area || "-"}
                                </p>
                                <p>
                                  <b>Address:</b> {order.address}
                                </p>
                                <p>
                                  <b>Payment:</b> {order.paymentMethod}
                                </p>
                              </div>

                              <div>
                                <h3 className="font-bold mb-3">
                                  Ordered Products
                                </h3>

                                <div className="space-y-3">
                                  {order.items?.map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-3 border rounded-xl p-3 bg-white"
                                    >
                                      <div className="w-16 h-16 border rounded-lg overflow-hidden flex items-center justify-center bg-white">
                                        {item.image ? (
                                          <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-contain"
                                          />
                                        ) : (
                                          <span className="text-xs text-slate-400">
                                            No Image
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex-1">
                                        <p className="font-semibold">
                                          {item.title}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                          Qty: {item.quantity} × ৳
                                          {Number(item.price || 0).toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="mt-4 border-t pt-3 text-right">
                                  <p>
                                    Subtotal: ৳
                                    {Number(order.subtotal || 0).toFixed(2)}
                                  </p>
                                  <p>
                                    Delivery: ৳
                                    {Number(order.deliveryCost || 0).toFixed(2)}
                                  </p>
                                  <p className="font-bold text-orange-600">
                                    Total: ৳
                                    {Number(order.total || 0).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}

                  {orders.length === 0 && (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center p-8 text-slate-500"
                      >
                        No orders found. Place an order from cart first.
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

export default AdminOrders;
