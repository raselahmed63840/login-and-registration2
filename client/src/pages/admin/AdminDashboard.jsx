import React from "react";
import { useNavigate } from "react-router-dom";

const stats = [
  { title: "Total Sales", value: "৳ 1,25,000", icon: "💰" },
  { title: "Total Orders", value: "320", icon: "🧾" },
  { title: "New Users", value: "86", icon: "👥" },
  { title: "Active Users", value: "42", icon: "🟢" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Dashboard Monitor
          </h1>
          <p className="text-slate-500 mt-1">
            Sales, orders, users, reports overview
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/admin/live")}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold shadow flex items-center gap-2"
          >
            <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
            Go Live
          </button>

          <button
            onClick={() => navigate("/live")}
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 px-5 py-3 rounded-xl font-semibold shadow"
          >
            View Live Page
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">{item.title}</p>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  {item.value}
                </h2>
              </div>
              <span className="text-3xl">{item.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
        <div className="2xl:col-span-2 bg-white rounded-2xl border p-5">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-3 pr-4">Order ID</th>
                  <th className="py-3 pr-4">Customer</th>
                  <th className="py-3 pr-4">Amount</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["#1001", "Mahbub", "৳ 2200", "Pending", "2026-04-21"],
                  ["#1002", "Karim", "৳ 1750", "Confirmed", "2026-04-21"],
                  ["#1003", "Rahim", "৳ 850", "Delivered", "2026-04-20"],
                ].map((row) => (
                  <tr key={row[0]} className="border-b last:border-b-0">
                    <td className="py-3 pr-4 font-medium">{row[0]}</td>
                    <td className="py-3 pr-4">{row[1]}</td>
                    <td className="py-3 pr-4">{row[2]}</td>
                    <td className="py-3 pr-4">{row[3]}</td>
                    <td className="py-3 pr-4">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <h2 className="text-xl font-semibold mb-4">Quick Reports</h2>
          <div className="space-y-3 text-sm sm:text-base">
            <div className="flex items-center justify-between">
              <span>Revenue</span>
              <span className="font-semibold">৳ 95,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Profit</span>
              <span className="font-semibold">৳ 28,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Low Stock Alert</span>
              <span className="font-semibold text-red-500">12 Items</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Abandoned Carts</span>
              <span className="font-semibold">19</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;