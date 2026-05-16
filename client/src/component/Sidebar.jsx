import { NavLink } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    "Dashboard",
    "Orders",
    "Products",
    "Inventory",
    "Customers",
    "Manage Users",
    "Settings",
  ];

  return (
    <>
      <button
        className="md:hidden bg-gray-800 text-white px-3 py-2 m-2 rounded"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-50`}
      >
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item}>
              <NavLink
                to={`/${item.toLowerCase().replace(" ", "")}`}
                className={({ isActive }) =>
                  `block px-2 py-1 rounded hover:bg-gray-700 ${
                    isActive ? "bg-gray-700 font-bold" : ""
                  }`
                }
              >
                {item}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
