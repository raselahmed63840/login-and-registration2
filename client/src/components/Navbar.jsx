import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/home" className="text-2xl font-bold tracking-wide">
        ShopEase
      </Link>

      {/* Menu Links */}
      <div className="space-x-6">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive ? "font-semibold underline" : "hover:underline"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "font-semibold underline" : "hover:underline"
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            isActive ? "font-semibold underline" : "hover:underline"
          }
        >
          Categories
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive ? "font-semibold underline" : "hover:underline"
          }
        >
          Cart 🛒
        </NavLink>

        <NavLink
          to="/account"
          className={({ isActive }) =>
            isActive ? "font-semibold underline" : "hover:underline"
          }
        >
          My Account
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
