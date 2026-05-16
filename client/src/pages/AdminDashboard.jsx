import React, { useEffect, useState } from "react";
import { fetchAdminDashboard } from "../../api/adminApi";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalProducts: 0,
    totalReviews: 0,
    recentOrders: [],
    quickReports: {
      revenue: 0,
      profit: 0,
      lowStockAlert: 0,
      abandonedCart: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const formatMoney = (amount) => {
    return `৳ ${Number(amount || 0).toLocaleString("en-BD")}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await fetchAdminDashboard();

      if (data?.success) {
        const d = data.dashboard || {};

        setDashboard({
          totalSales: Number(d.totalSales || 0),
          totalOrders: Number(d.totalOrders || 0),
          totalUsers: Number(d.totalUsers || 0),
          activeUsers: Number(d.activeUsers || 0),
          totalProducts: Number(d.totalProducts || 0),
          totalReviews: Number(d.totalReviews || 0),
          recentOrders: Array.isArray(d.recentOrders) ? d.recentOrders : [],
          quickReports: {
            revenue: Number(d.quickReports?.revenue || 0),
            profit: Number(d.quickReports?.profit || 0),
            lowStockAlert: Number(d.quickReports?.lowStockAlert || 0),
            abandonedCart: Number(d.quickReports?.abandonedCart || 0),
          },
        });
      } else {
        setMessage(data?.message || "Dashboard data load failed.");
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Dashboard data load failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const recentOrders = dashboard.recentOrders || [];
  const quickReports = dashboard.quickReports || {};

  return (
    <div className="w-full min-h-screen bg-slate-100 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black">Dashboard Monitor</h1>
            <p className="text-slate-600 mt-2">
              Sales, orders, users, reports overview
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-semibold shadow-sm"
          >
            Refresh Data
          </button>
        </div>

        {message && (
          <div className="mb-5 rounded-xl border border-orange-300 bg-orange-50 text-orange-600 px-5 py-4">
            {message}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl border shadow-sm p-8 text-slate-500">
            Loading real dashboard data...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
              <div className="bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-between">
                <div>
                  <p className="text-slate-500 mb-3">Total Sales</p>
                  <h2 className="text-2xl font-bold text-black">
                    {formatMoney(dashboard.totalSales)}
                  </h2>
                </div>

                <div className="text-4xl">💰</div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-between">
                <div>
                  <p className="text-slate-500 mb-3">Total Orders</p>
                  <h2 className="text-2xl font-bold text-black">
                    {dashboard.totalOrders}
                  </h2>
                </div>

                <div className="text-4xl">🧾</div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-between">
                <div>
                  <p className="text-slate-500 mb-3">Total Users</p>
                  <h2 className="text-2xl font-bold text-black">
                    {dashboard.totalUsers}
                  </h2>
                </div>

                <div className="text-4xl">👥</div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-between">
                <div>
                  <p className="text-slate-500 mb-3">Active Users</p>
                  <h2 className="text-2xl font-bold text-black">
                    {dashboard.activeUsers}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-full bg-green-400 shadow-lg"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="text-left p-4">Order ID</th>
                        <th className="text-left p-4">Customer</th>
                        <th className="text-left p-4">Amount</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentOrders.length > 0 ? (
                        recentOrders.map((order) => (
                          <tr
                            key={order._id || order.orderId}
                            className="border-b hover:bg-slate-50"
                          >
                            <td className="p-4 font-semibold">
                              {order.orderId || "-"}
                            </td>

                            <td className="p-4">
                              {order.customer || "Customer"}
                            </td>

                            <td className="p-4">{formatMoney(order.amount)}</td>

                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  String(order.status).toLowerCase() ===
                                  "delivered"
                                    ? "bg-green-100 text-green-600"
                                    : String(order.status).toLowerCase() ===
                                        "cancelled"
                                      ? "bg-red-100 text-red-600"
                                      : String(order.status).toLowerCase() ===
                                          "confirmed"
                                        ? "bg-blue-100 text-blue-600"
                                        : "bg-orange-100 text-orange-600"
                                }`}
                              >
                                {order.status || "Pending"}
                              </span>
                            </td>

                            <td className="p-4">{formatDate(order.date)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="p-8 text-center text-slate-500"
                          >
                            No real order found yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Quick Reports</h2>

                <div className="space-y-5 text-lg">
                  <div className="flex items-center justify-between">
                    <span>Revenue</span>
                    <span className="font-bold">
                      {formatMoney(quickReports.revenue)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Profit</span>
                    <span className="font-bold">
                      {formatMoney(quickReports.profit)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Low Stock Alert</span>
                    <span className="font-bold text-red-500">
                      {quickReports.lowStockAlert || 0} Items
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Abandoned Carts</span>
                    <span className="font-bold">
                      {quickReports.abandonedCart || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
