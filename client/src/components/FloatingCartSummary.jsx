import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const possibleCartKeys = ["cart", "cartItems", "shopEaseCart", "cart_products"];

const getCartFromLocalStorage = () => {
  for (const key of possibleCartKeys) {
    const value = localStorage.getItem(key);
    if (!value) continue;

    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed.items)) return parsed.items;
      if (Array.isArray(parsed.cartItems)) return parsed.cartItems;
    } catch {
      return [];
    }
  }

  return [];
};

const getQuantity = (item) =>
  Number(item.quantity || item.qty || item.count || 1);

const getPrice = (item) =>
  Number(item.price || item.salePrice || item.newPrice || 0);

const CartIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 7h15l-1.5 8.5H7.5L6 7Z" />
    <path d="M6 7 5.3 4H3" />
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
  </svg>
);

const FloatingCartSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);

  const loadCart = () => {
    setCartItems(getCartFromLocalStorage());
  };

  useEffect(() => {
    loadCart();

    window.addEventListener("storage", loadCart);
    window.addEventListener("focus", loadCart);

    const interval = setInterval(loadCart, 800);

    return () => {
      window.removeEventListener("storage", loadCart);
      window.removeEventListener("focus", loadCart);
      clearInterval(interval);
    };
  }, [location.pathname]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + getQuantity(item), 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + getPrice(item) * getQuantity(item),
      0,
    );
  }, [cartItems]);

  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => navigate("/cart")}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-[9998] w-[76px] rounded-l-xl overflow-hidden bg-white shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="bg-orange-500 text-white h-[68px] flex flex-col items-center justify-center">
        <CartIcon />
        <span className="text-[13px] font-semibold leading-4 mt-1">
          {totalItems} Items
        </span>
      </div>

      <div className="bg-white text-orange-600 h-[36px] flex items-center justify-center text-[14px] font-bold">
        ৳{totalPrice.toFixed(2)}
      </div>
    </button>
  );
};

export default FloatingCartSummary;
