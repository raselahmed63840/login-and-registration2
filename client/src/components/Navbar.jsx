import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchProducts } from "../api/productApi";
import { getImageSearchKeyword } from "../utils/imageSearch";

const aiSearchSuggestions = [
  "shirt under 1000",
  "honey below 500",
  "phone accessories under 300",
  "rice under 2000",
  "shirt 500 to 1500",
  "shoes under 1000",
  "bag under 500",
  "oil under 1000",
  "ghee under 1500",
  "dates under 1000",
  "spices under 500",
  "t shirt under 500",
  "jeans under 1500",
  "charger under 500",
  "earphone under 500",
  "beauty product under 500",
  "baby items under 500",
  "jewelry under 500",
  "office supplies under 500",
  "sports item under 1000",
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchBoxRef = useRef(null);
  const imageInputRef = useRef(null);
  const accountMenuRef = useRef(null);
  const moreMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isImageSearching, setIsImageSearching] = useState(false);

  const cleanTitle = (title = "") => {
    return String(title)
      .replace(/product-img/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const getProductId = (product) => {
    return product?._id || product?.id || product?.productId;
  };

  const getAuthUser = () => {
    try {
      const savedUser =
        localStorage.getItem("authUser") ||
        localStorage.getItem("user") ||
        localStorage.getItem("currentUser") ||
        localStorage.getItem("shopEaseUser");

      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  };

  const authUser = getAuthUser();

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Navbar product fetch failed:", error);
      setProducts([]);
    }
  };

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      const totalQuantity = cart.reduce((total, item) => {
        return total + Number(item.quantity || item.qty || 1);
      }, 0);

      setCartCount(totalQuantity);
    } catch {
      setCartCount(0);
    }
  };

  const updateWishlistCount = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
    } catch {
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    loadProducts();
    updateCartCount();
    updateWishlistCount();

    const handleUpdate = () => {
      updateCartCount();
      updateWishlistCount();
    };

    window.addEventListener("cartUpdated", handleUpdate);
    window.addEventListener("wishlistUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleUpdate);
      window.removeEventListener("wishlistUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get("search") || "";

    if (location.pathname === "/products" && search) {
      setSearchText(search);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }

      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(e.target)
      ) {
        setShowAccountMenu(false);
      }

      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(e.target)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) return [];

    return products
      .filter((product) => {
        const title = cleanTitle(product.title || "").toLowerCase();
        const category = String(product.category || "").toLowerCase();
        const brand = String(product.brand || "").toLowerCase();
        const description = String(product.description || "").toLowerCase();

        return (
          title.includes(keyword) ||
          category.includes(keyword) ||
          brand.includes(keyword) ||
          description.includes(keyword)
        );
      })
      .slice(0, 6);
  }, [searchText, products]);

  const filteredAiSuggestions = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) {
      return aiSearchSuggestions.slice(0, 6);
    }

    return aiSearchSuggestions
      .filter((suggestion) => suggestion.toLowerCase().includes(keyword))
      .slice(0, 6);
  }, [searchText]);

  const closeAllPopups = () => {
    setShowSearchResults(false);
    setShowAccountMenu(false);
    setShowMoreMenu(false);
    setShowMobileMenu(false);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setShowSearchResults(true);
  };

  const handleProductClick = (product) => {
    const productId = getProductId(product);

    if (!productId) {
      alert("Product ID not found");
      return;
    }

    setSearchText("");
    closeAllPopups();
    navigate(`/products/${productId}`);
  };

  const handleAiSuggestionClick = (suggestion) => {
    setSearchText(suggestion);
    closeAllPopups();
    navigate(`/products?search=${encodeURIComponent(suggestion)}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const cleanSearch = searchText.trim();

    closeAllPopups();

    if (!cleanSearch) {
      navigate("/products");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(cleanSearch)}`);
  };

  const handleOpenImagePicker = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleImageSearch = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setIsImageSearching(true);
      closeAllPopups();

      const result = await getImageSearchKeyword(file);
      const imageKeyword = result?.keyword || "product";

      setSearchText(imageKeyword);
      navigate(`/products?search=${encodeURIComponent(imageKeyword)}`);
    } catch (error) {
      console.error("Image search failed:", error);
      alert("Image search failed. Please try another image.");
    } finally {
      setIsImageSearching(false);
      e.target.value = "";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("shopEaseToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("shopEaseUser");

    closeAllPopups();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-5 lg:px-6">
        <div className="h-auto md:h-[95px] py-3 md:py-0 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
          <div className="flex items-center justify-between md:justify-start gap-5">
            <Link to="/home" className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center text-2xl font-bold">
                S
              </div>

              <div className="leading-5">
                <h1 className="text-2xl font-extrabold text-orange-500">
                  SHOP
                </h1>
                <h1 className="text-2xl font-extrabold text-orange-500">
                  EASE
                </h1>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-5 text-base font-medium">
              <Link
                to="/home"
                className="text-slate-800 hover:text-orange-500 transition"
              >
                Home
              </Link>

              <Link
                to="/products"
                className="text-slate-800 hover:text-orange-500 transition"
              >
                Products
              </Link>
            </nav>

            <button
              ref={mobileMenuButtonRef}
              type="button"
              onClick={() => {
                setShowMobileMenu((prev) => !prev);
                setShowMoreMenu(false);
                setShowAccountMenu(false);
                setShowSearchResults(false);
              }}
              className="md:hidden text-3xl"
            >
              ☰
            </button>
          </div>

          <div ref={searchBoxRef} className="relative flex-1">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSearch}
              className="hidden"
            />

            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center border border-gray-900 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={handleOpenImagePicker}
                  disabled={isImageSearching}
                  className="px-4 py-3 text-green-600 hover:bg-green-50 transition border-r border-gray-200 disabled:opacity-50"
                  title="Search by image"
                >
                  {isImageSearching ? (
                    <span className="text-sm font-semibold">...</span>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8.5A2.5 2.5 0 0 1 5.5 6H8l1.4-2h5.2L16 6h2.5A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-9Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 9h.01"
                      />
                    </svg>
                  )}
                </button>

                <input
                  type="text"
                  placeholder="Search in..."
                  value={searchText}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    setShowSearchResults(true);
                    setShowAccountMenu(false);
                    setShowMoreMenu(false);
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-5 py-3 outline-none text-base"
                />

                <button
                  type="submit"
                  className="px-5 text-2xl hover:text-orange-500 transition"
                >
                  🔍
                </button>
              </div>
            </form>

            {showSearchResults && searchText.trim() && (
              <div className="absolute top-[105%] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-[999]">
                <div className="px-4 py-2 text-xs font-semibold text-orange-500 bg-orange-50">
                  AI Smart Search
                </div>

                <button
                  type="button"
                  onMouseDown={() => handleAiSuggestionClick(searchText.trim())}
                  className="w-full px-4 py-3 text-left hover:bg-orange-50 border-b"
                >
                  <div className="text-sm font-semibold text-slate-800">
                    Search for:{" "}
                    <span className="text-orange-500">{searchText.trim()}</span>
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    Example: shirt under 1000, honey below 500, rice 1000 to
                    2000
                  </div>
                </button>

                {filteredProducts.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs font-semibold text-slate-500 bg-gray-50">
                      Matching Products
                    </div>

                    {filteredProducts.map((product) => {
                      const productId = getProductId(product);

                      return (
                        <button
                          key={productId || product.title}
                          type="button"
                          onMouseDown={() => handleProductClick(product)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 text-left border-b last:border-b-0"
                        >
                          <img
                            src={
                              product.image ||
                              product.images?.[0]?.url ||
                              product.images?.[0] ||
                              "https://via.placeholder.com/80"
                            }
                            alt={cleanTitle(product.title)}
                            className="w-12 h-12 object-contain rounded border bg-white"
                          />

                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-slate-800 line-clamp-1">
                              {cleanTitle(product.title) || "Untitled Product"}
                            </h3>

                            <p className="text-xs text-gray-500">
                              {product.category || "Uncategorized"}{" "}
                              {product.brand ? `• ${product.brand}` : ""}
                            </p>
                          </div>

                          <p className="text-sm font-bold text-orange-500">
                            ৳{Number(product.price || 0).toLocaleString()}
                          </p>
                        </button>
                      );
                    })}
                  </>
                )}

                {filteredAiSuggestions.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs font-semibold text-slate-500 bg-gray-50">
                      Suggestions
                    </div>

                    {filteredAiSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onMouseDown={() => handleAiSuggestionClick(suggestion)}
                        className="w-full px-4 py-2 text-sm text-left hover:bg-orange-50 border-b last:border-b-0"
                      >
                        🔎 {suggestion}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link
              to="/track-order"
              className="flex flex-col items-center hover:text-orange-500 transition"
            >
              <span className="text-2xl">📦</span>
              <span>Track Order</span>
            </Link>

            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setShowAccountMenu((prev) => !prev);
                  setShowMoreMenu(false);
                  setShowMobileMenu(false);
                  setShowSearchResults(false);
                }}
                className="flex flex-col items-center hover:text-orange-500 transition"
              >
                <span className="text-2xl">👤</span>
                <span>{authUser ? "My Account" : "Sign In"}</span>
              </button>

              {showAccountMenu && (
                <div className="absolute right-0 top-[110%] bg-white border border-gray-200 rounded-xl shadow-xl w-56 py-2 z-[999]">
                  {authUser ? (
                    <>
                      <Link
                        to="/account"
                        onClick={() => setShowAccountMenu(false)}
                        className="block px-4 py-3 hover:bg-orange-50"
                      >
                        My Account
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setShowAccountMenu(false)}
                        className="block px-4 py-3 hover:bg-orange-50"
                      >
                        My Orders
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setShowAccountMenu(false)}
                        className="block px-4 py-3 hover:bg-orange-50"
                      >
                        Wishlist
                      </Link>

                      {authUser.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setShowAccountMenu(false)}
                          className="block px-4 py-3 hover:bg-orange-50 font-semibold"
                        >
                          Admin Panel
                        </Link>
                      )}

                      {authUser.role === "vendor" && (
                        <Link
                          to="/vendor"
                          onClick={() => setShowAccountMenu(false)}
                          className="block px-4 py-3 hover:bg-orange-50 font-semibold"
                        >
                          Vendor Panel
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-500"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setShowAccountMenu(false)}
                        className="block px-4 py-3 hover:bg-orange-50"
                      >
                        Login
                      </Link>

                      <Link
                        to="/register"
                        onClick={() => setShowAccountMenu(false)}
                        className="block px-4 py-3 hover:bg-orange-50"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/wishlist"
              className="relative flex flex-col items-center hover:text-orange-500 transition"
            >
              <span className="text-2xl">🤍</span>

              {wishlistCount > 0 && (
                <span className="absolute -top-2 right-0 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}

              <span>Wishlist</span>
            </Link>

            <Link
              to="/cart"
              className="relative flex flex-col items-center hover:text-orange-500 transition"
            >
              <span className="text-2xl">🛒</span>

              {cartCount > 0 && (
                <span className="absolute -top-2 right-0 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}

              <span>Cart</span>
            </Link>

            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu((prev) => !prev);
                  setShowAccountMenu(false);
                  setShowMobileMenu(false);
                  setShowSearchResults(false);
                }}
                className="flex flex-col items-center hover:text-orange-500 transition"
              >
                <span className="text-2xl">☰</span>
                <span>More</span>
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-[110%] bg-white border border-gray-200 rounded-xl shadow-xl w-60 py-2 z-[999]">
                  <Link
                    to="/home"
                    onClick={() => setShowMoreMenu(false)}
                    className="block px-4 py-3 hover:bg-orange-50"
                  >
                    Home
                  </Link>

                  <Link
                    to="/products"
                    onClick={() => setShowMoreMenu(false)}
                    className="block px-4 py-3 hover:bg-orange-50"
                  >
                    Products
                  </Link>

                  <Link
                    to="/cart"
                    onClick={() => setShowMoreMenu(false)}
                    className="block px-4 py-3 hover:bg-orange-50"
                  >
                    Cart
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setShowMoreMenu(false)}
                    className="block px-4 py-3 hover:bg-orange-50"
                  >
                    Orders
                  </Link>

                  <Link
                    to="/track-order"
                    onClick={() => setShowMoreMenu(false)}
                    className="block px-4 py-3 hover:bg-orange-50"
                  >
                    Track Order
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setShowMoreMenu(false)}
                    className="block px-4 py-3 hover:bg-orange-50"
                  >
                    Wishlist
                  </Link>

                  <Link
                    to={authUser ? "/account" : "/login"}
                    onClick={() => setShowMoreMenu(false)}
                    className="block px-4 py-3 hover:bg-orange-50"
                  >
                    {authUser ? "My Account" : "Sign In"}
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setShowMoreMenu(false)}
                    className="block px-4 py-3 hover:bg-orange-50"
                  >
                    Register
                  </Link>

                  {authUser?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setShowMoreMenu(false)}
                      className="block px-4 py-3 hover:bg-orange-50 font-semibold"
                    >
                      Admin Panel
                    </Link>
                  )}

                  <Link
                    to="/contact"
                    onClick={() => setShowMoreMenu(false)}
                    className="block px-4 py-3 hover:bg-orange-50"
                  >
                    Contact
                  </Link>
                </div>
              )}
            </div>
          </div>

          {showMobileMenu && (
            <div
              ref={mobileMenuRef}
              className="md:hidden bg-white border rounded-xl shadow p-3 space-y-2"
            >
              <Link
                to="/home"
                onClick={() => setShowMobileMenu(false)}
                className="block px-3 py-2 rounded hover:bg-orange-50"
              >
                Home
              </Link>

              <Link
                to="/products"
                onClick={() => setShowMobileMenu(false)}
                className="block px-3 py-2 rounded hover:bg-orange-50"
              >
                Products
              </Link>

              <Link
                to="/cart"
                onClick={() => setShowMobileMenu(false)}
                className="block px-3 py-2 rounded hover:bg-orange-50"
              >
                Cart ({cartCount})
              </Link>

              <Link
                to="/orders"
                onClick={() => setShowMobileMenu(false)}
                className="block px-3 py-2 rounded hover:bg-orange-50"
              >
                Orders
              </Link>

              <Link
                to="/track-order"
                onClick={() => setShowMobileMenu(false)}
                className="block px-3 py-2 rounded hover:bg-orange-50"
              >
                Track Order
              </Link>

              <Link
                to="/wishlist"
                onClick={() => setShowMobileMenu(false)}
                className="block px-3 py-2 rounded hover:bg-orange-50"
              >
                Wishlist ({wishlistCount})
              </Link>

              {authUser ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-3 py-2 rounded hover:bg-orange-50"
                  >
                    My Account
                  </Link>

                  {authUser.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setShowMobileMenu(false)}
                      className="block px-3 py-2 rounded hover:bg-orange-50"
                    >
                      Admin Panel
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded hover:bg-red-50 text-red-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-3 py-2 rounded hover:bg-orange-50"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-3 py-2 rounded hover:bg-orange-50"
                  >
                    Register
                  </Link>
                </>
              )}

              <Link
                to="/contact"
                onClick={() => setShowMobileMenu(false)}
                className="block px-3 py-2 rounded hover:bg-orange-50"
              >
                Contact
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
