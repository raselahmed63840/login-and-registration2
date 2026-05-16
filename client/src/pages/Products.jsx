import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchProducts } from "../api/productApi";

const cleanText = (text = "") => {
  return String(text).toLowerCase().replace(/\s+/g, " ").trim();
};

const getProductId = (product) => {
  return product._id || product.id || product.productId;
};

const getProductImage = (product) => {
  return (
    product.image ||
    product.images?.[0]?.url ||
    product.images?.[0] ||
    "https://via.placeholder.com/300"
  );
};

const parseSmartSearch = (query = "") => {
  const cleanQuery = cleanText(query);

  let minPrice = null;
  let maxPrice = null;
  let keyword = cleanQuery;

  const rangeMatch =
    cleanQuery.match(/(\d+)\s*(to|-)\s*(\d+)/i) ||
    cleanQuery.match(/between\s*(\d+)\s*(and|to|-)\s*(\d+)/i);

  if (rangeMatch) {
    if (rangeMatch[1] && rangeMatch[3]) {
      minPrice = Number(rangeMatch[1]);
      maxPrice = Number(rangeMatch[3]);
    }

    keyword = keyword
      .replace(/between\s*\d+\s*(and|to|-)\s*\d+/gi, "")
      .replace(/\d+\s*(to|-)\s*\d+/gi, "");
  } else {
    const maxMatch = cleanQuery.match(
      /(under|below|less than|within|কম|নিচে|মধ্যে)\s*(\d+)/i,
    );

    if (maxMatch) {
      maxPrice = Number(maxMatch[2]);

      keyword = keyword.replace(
        /(under|below|less than|within|কম|নিচে|মধ্যে)\s*\d+/gi,
        "",
      );
    }
  }

  keyword = keyword
    .replace(/\b(tk|taka|bdt|টাকা)\b/gi, "")
    .replace(/\d+/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return {
    keyword,
    minPrice,
    maxPrice,
  };
};

const Products = () => {
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  const queryParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const categoryQuery = queryParams.get("category") || "";
  const searchQuery = queryParams.get("search") || "";

  const loadProducts = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await fetchProducts();

      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Products fetch failed:", error);
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Products fetch failed",
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    setSearchText(searchQuery || "");
    setSelectedCategory(categoryQuery || "All");
  }, [searchQuery, categoryQuery]);

  const categories = useMemo(() => {
    const productCategories = products
      .map((product) => product.category)
      .filter(Boolean);

    const defaultCategories = ["combo", "shirt", "pant", "belt"];

    const mergedCategories = [...defaultCategories, ...productCategories];

    const uniqueCategories = [
      ...new Set(mergedCategories.map((item) => String(item).trim())),
    ];

    return ["All", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const smartSearch = parseSmartSearch(searchText);

    const keyword = cleanText(smartSearch.keyword);
    const selected = cleanText(selectedCategory);

    return products.filter((product) => {
      const title = cleanText(product.title || product.name || "");
      const category = cleanText(product.category || "");
      const brand = cleanText(product.brand || "");
      const description = cleanText(product.description || "");
      const price = Number(product.price || 0);

      const fullText = `${title} ${category} ${brand} ${description}`;

      const matchesCategory =
        selected === "all" ||
        !selected ||
        category.includes(selected) ||
        title.includes(selected) ||
        description.includes(selected);

      const matchesKeyword = keyword ? fullText.includes(keyword) : true;

      const matchesMinPrice =
        smartSearch.minPrice !== null ? price >= smartSearch.minPrice : true;

      const matchesMaxPrice =
        smartSearch.maxPrice !== null ? price <= smartSearch.maxPrice : true;

      return (
        matchesCategory && matchesKeyword && matchesMinPrice && matchesMaxPrice
      );
    });
  }, [products, searchText, selectedCategory]);

  const addToCart = (product) => {
    const productId = getProductId(product);

    if (!productId) {
      alert("Invalid product. Product ID not found.");
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const foundProduct = existingCart.find(
      (item) =>
        String(item.productId || item.id || item._id) === String(productId),
    );

    let updatedCart;

    if (foundProduct) {
      updatedCart = existingCart.map((item) =>
        String(item.productId || item.id || item._id) === String(productId)
          ? {
              ...item,
              quantity: Number(item.quantity || 1) + 1,
            }
          : item,
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          productId,
          id: productId,
          title: product.title || product.name || "Product",
          price: Number(product.price) || 0,
          image: getProductImage(product),
          category: product.category,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));

    setCartMessage("Product added to cart");

    setTimeout(() => {
      setCartMessage("");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fffaf2] via-[#fbf8f1] to-white px-4 py-10">
        <div className="max-w-[1536px] mx-auto bg-white rounded-2xl shadow p-8 text-center border border-[#eadfce]">
          <p className="text-lg font-semibold text-slate-700">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf2] via-[#fbf8f1] to-white px-4 sm:px-5 lg:px-6 py-8">
      <div className="max-w-[1536px] mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-[#eadfce] p-5 sm:p-7 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <h1 className="text-[32px] font-normal text-[#001b3a]">
                {selectedCategory !== "All"
                  ? `${selectedCategory} Products`
                  : "All Products"}
              </h1>

              <p className="text-slate-600">Browse products from our store.</p>
            </div>

            {(categoryQuery || searchQuery) && (
              <div className="bg-orange-50 border border-orange-200 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold w-fit">
                {categoryQuery && `Category: ${categoryQuery}`}
                {categoryQuery && searchQuery && " | "}
                {searchQuery && `Search: ${searchQuery}`}
              </div>
            )}
          </div>

          {message && (
            <div className="mt-5 rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3">
              {message}
            </div>
          )}

          {cartMessage && (
            <div className="mt-5 rounded-xl bg-green-50 border border-green-200 text-green-700 px-4 py-3">
              {cartMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <input
              type="text"
              placeholder="Search product... example: shirt under 1000"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full border border-[#eadfce] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300 bg-[#fffaf2]"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-[#eadfce] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300 bg-[#fffaf2] capitalize"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-[#eadfce] p-8 text-center">
            <p className="text-red-500 font-semibold">No products found</p>

            <p className="text-slate-500 mt-2">
              Please add products from admin panel or try another category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
            {filteredProducts.map((product) => {
              const productId = getProductId(product);
              const stock = Number(product.stock || product.quantity || 0);
              const hasStock = stock > 0;

              return (
                <div
                  key={productId || product.title}
                  className="bg-white rounded-3xl border border-[#eadfce] shadow-sm hover:shadow-xl transition-all duration-300 p-3 sm:p-4 flex flex-col group"
                >
                  {productId ? (
                    <Link to={`/products/${productId}`}>
                      <div className="relative overflow-hidden rounded-2xl bg-[#fff7ea]">
                        <img
                          src={getProductImage(product)}
                          alt={product.title || product.name || "Product"}
                          className="w-full h-40 sm:h-52 object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>
                  ) : (
                    <div className="relative overflow-hidden rounded-2xl bg-[#fff7ea]">
                      <img
                        src={getProductImage(product)}
                        alt={product.title || product.name || "Product"}
                        className="w-full h-40 sm:h-52 object-contain"
                      />
                    </div>
                  )}

                  <div className="flex-1 mt-4">
                    <p className="text-xs sm:text-sm text-orange-500 font-bold capitalize">
                      {product.category || "Uncategorized"}
                    </p>

                    {productId ? (
                      <Link to={`/products/${productId}`}>
                        <h2 className="text-sm sm:text-lg font-bold text-slate-800 mt-1 line-clamp-2 hover:text-orange-500 transition">
                          {product.title || product.name || "Untitled Product"}
                        </h2>
                      </Link>
                    ) : (
                      <h2 className="text-sm sm:text-lg font-bold text-slate-800 mt-1 line-clamp-2">
                        {product.title || product.name || "Untitled Product"}
                      </h2>
                    )}

                    <p className="text-orange-600 font-extrabold text-lg sm:text-xl mt-2">
                      ৳{Number(product.price || 0).toLocaleString()}
                    </p>

                    <p
                      className={`text-xs sm:text-sm mt-1 font-medium ${
                        hasStock ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {hasStock ? `Stock: ${stock}` : "Out of stock"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    disabled={!hasStock}
                    className={`w-full mt-4 py-2.5 sm:py-3 rounded-xl font-bold text-white transition ${
                      hasStock
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {hasStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
