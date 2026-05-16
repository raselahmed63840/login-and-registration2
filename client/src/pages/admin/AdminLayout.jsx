import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const menuItems = [
    {
      name: "Dashboard",
      icon: "📊",
      path: "/admin6935/dashboard",
    },
    {
      name: "Products",
      icon: "📦",
      path: "/admin6935/products",
    },
    {
      name: "Orders",
      icon: "🧾",
      path: "/admin6935/orders",
    },
    {
      name: "Users",
      icon: "👥",
      path: "/admin6935/users",
    },
    {
      name: "Categories & Brands",
      icon: "🏷️",
      path: "/admin6935/categories-brands",
    },
    {
      name: "Payments",
      icon: "💳",
      path: "/admin6935/payments",
    },
    {
      name: "Coupons",
      icon: "🎟️",
      path: "/admin6935/coupons",
    },
    {
      name: "Reviews",
      icon: "⭐",
      path: "/admin6935/reviews",
    },
    {
      name: "Shipping",
      icon: "🚚",
      path: "/admin6935/shipping",
    },
    {
      name: "CMS",
      icon: "📰",
      path: "/admin6935/cms",
    },
    {
      name: "Reports",
      icon: "📈",
      path: "/admin6935/reports",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <aside className="w-[280px] min-h-screen bg-white border-r px-4 py-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#001b3a]">Admin Panel</h2>
            <p className="text-sm text-slate-500 mt-1">Manage your store</p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-slate-700 hover:bg-orange-50 hover:text-orange-500"
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="bg-white border-b px-8 py-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#001b3a]">
                ShopEase Admin
              </h2>
              <p className="text-sm text-slate-500">
                Responsive store management dashboard
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="w-11 h-11 rounded-xl bg-slate-100">🔔</button>
              <button className="px-5 py-3 rounded-xl bg-slate-100 font-semibold">
                👤 Admin
              </button>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
