import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchProduct, fetchProducts } from "../api/productApi";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [reviews, setReviews] = useState([]);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("shopEaseToken") ||
    "";

  const isLoggedIn = Boolean(token);

  const getProductId = (item) => item?._id || item?.id || item?.productId;

  const cleanTitle = (title = "") => {
    return String(title)
      .replace(/product-img/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const getSavedUser = () => {
    const userKeys = ["authUser", "user", "currentUser", "shopEaseUser"];

    for (const key of userKeys) {
      const value = localStorage.getItem(key);

      if (!value) continue;

      try {
        const parsed = JSON.parse(value);

        if (parsed && typeof parsed === "object") {
          return parsed;
        }
      } catch {
        continue;
      }
    }

    return null;
  };

  const getSavedUserId = (user) => {
    return user?._id || user?.id || user?.userId || "";
  };

  const getCustomerName = (user) => {
    return (
      user?.fullName ||
      user?.name ||
      user?.username ||
      user?.email?.split("@")[0] ||
      "Customer"
    );
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    if (typeof image === "object" && image.url) {
      return image.url;
    }

    const img = String(image);

    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }

    if (img.startsWith("/uploads")) {
      return `${API_BASE_URL}${img}`;
    }

    if (img.startsWith("/")) {
      return img;
    }

    return `${API_BASE_URL}/uploads/products/${img}`;
  };

  const getReviewCustomerName = (review) => {
    if (
      review?.userName &&
      review.userName !== "Customer" &&
      review.userName !== "Guest" &&
      review.userName !== "Guest Customer"
    ) {
      return review.userName;
    }

    const savedUser = getSavedUser();
    const savedUserId = getSavedUserId(savedUser);

    if (
      savedUserId &&
      review?.userId &&
      String(savedUserId) === String(review.userId)
    ) {
      return getCustomerName(savedUser);
    }

    return (
      review?.customerName ||
      review?.name ||
      review?.user?.fullName ||
      review?.user?.name ||
      review?.user?.username ||
      review?.userEmail?.split("@")[0] ||
      "Customer"
    );
  };

  const getReviewCustomerImage = (review) => {
    const savedUser = getSavedUser();
    const savedUserId = getSavedUserId(savedUser);

    let image =
      review?.profileImage ||
      review?.profilePic ||
      review?.avatar ||
      review?.image ||
      review?.photoURL ||
      review?.picture ||
      review?.user?.profileImage ||
      review?.user?.profilePic ||
      review?.user?.avatar ||
      review?.user?.image ||
      review?.user?.photoURL ||
      review?.user?.picture ||
      "";

    if (
      !image &&
      savedUserId &&
      review?.userId &&
      String(savedUserId) === String(review.userId)
    ) {
      image =
        savedUser?.profileImage ||
        savedUser?.profilePic ||
        savedUser?.avatar ||
        savedUser?.image ||
        savedUser?.photoURL ||
        savedUser?.picture ||
        "";
    }

    return getImageUrl(image);
  };

  const getInitial = (name) => {
    return String(name || "C")
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  const getSavedUserProfileImage = (user) => {
    return (
      user?.profileImage ||
      user?.profilePic ||
      user?.avatar ||
      user?.image ||
      user?.photoURL ||
      user?.picture ||
      ""
    );
  };

  const loadProduct = async () => {
    try {
      setLoading(true);

      if (!id || id === "undefined") {
        setProduct(null);
        return;
      }

      const data = await fetchProduct(id);
      setProduct(data);

      const products = await fetchProducts();
      setAllProducts(products || []);
    } catch (error) {
      console.error("Product details fetch error:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      if (!id || id === "undefined") return;

      const res = await axios.get(`${API_BASE_URL}/api/reviews/${id}`);

      if (res.data?.success) {
        setReviews(res.data.reviews || []);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Review load error:", error);
      setReviews([]);
    }
  };

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const images = useMemo(() => {
    if (!product) return [];

    const imageList = [];

    if (Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach((img) => {
        const url = getImageUrl(img);

        if (url && !imageList.includes(url)) {
          imageList.push(url);
        }
      });
    }

    [product.image, product.image2, product.image3, product.image4].forEach(
      (img) => {
        const url = getImageUrl(img);

        if (url && !imageList.includes(url)) {
          imageList.push(url);
        }
      },
    );

    return imageList.filter(Boolean);
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product || !allProducts.length) return [];

    const currentId = getProductId(product);

    let sameCategory = allProducts.filter((item) => {
      const itemId = getProductId(item);

      return (
        String(itemId) !== String(currentId) &&
        item.category &&
        product.category &&
        String(item.category).toLowerCase() ===
          String(product.category).toLowerCase()
      );
    });

    if (sameCategory.length < 5) {
      const others = allProducts.filter((item) => {
        const itemId = getProductId(item);

        return (
          String(itemId) !== String(currentId) &&
          !sameCategory.some((p) => String(getProductId(p)) === String(itemId))
        );
      });

      sameCategory = [...sameCategory, ...others];
    }

    return sameCategory.slice(0, 5);
  }, [allProducts, product]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;

    const total = reviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0,
    );

    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const addToCart = () => {
    if (!product) return;

    const productId = getProductId(product);
    const oldCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = oldCart.find(
      (item) => String(item.productId) === String(productId),
    );

    let updatedCart;

    if (existing) {
      updatedCart = oldCart.map((item) =>
        String(item.productId) === String(productId)
          ? { ...item, quantity: Number(item.quantity || 1) + quantity }
          : item,
      );
    } else {
      updatedCart = [
        ...oldCart,
        {
          productId,
          title: cleanTitle(product.title),
          price: Number(product.price) || 0,
          image: images[0] || getImageUrl(product.image),
          category: product.category,
          quantity,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    alert("Product added to cart");
  };

  const buyNow = () => {
    addToCart();
    navigate("/cart");
  };

  const orderWhatsApp = () => {
    if (!product) return;

    const phone = "8801863840408";

    const message = encodeURIComponent(
      `Hello, I want to order this product:
Product: ${cleanTitle(product.title)}
Quantity: ${quantity}
Price: ৳${product.price}`,
    );

    window.open(
      `https://api.whatsapp.com/send?phone=${phone}&text=${message}`,
      "_blank",
    );
  };

  const callForOrder = () => {
    window.location.href = "tel:+8801863840408";
  };

  const submitReview = async () => {
    try {
      setReviewMessage("");

      if (!isLoggedIn) {
        setReviewMessage("Please login or register first to submit a review.");
        return;
      }

      if (!reviewRating || !reviewComment.trim()) {
        setReviewMessage("Please select rating and write your review.");
        return;
      }

      if (!product) {
        setReviewMessage("Product not found.");
        return;
      }

      setReviewLoading(true);

      const productId = getProductId(product);
      const savedUser = getSavedUser();
      const customerName = getCustomerName(savedUser);
      const profileImage = getSavedUserProfileImage(savedUser);

      const res = await axios.post(
        `${API_BASE_URL}/api/reviews/${productId}`,
        {
          rating: reviewRating,
          comment: reviewComment,
          userName: customerName,
          userEmail: savedUser?.email || "",
          profileImage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data?.success) {
        setReviewMessage(res.data.message || "Review submitted successfully.");
        setReviewComment("");
        setReviewRating("");
        await loadReviews();
      }
    } catch (error) {
      setReviewMessage(error.response?.data?.message || "Review submit failed");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="p-10 text-center text-red-500">
        Product not found
        <br />
        <button
          onClick={() => navigate("/products")}
          className="mt-4 bg-orange-500 text-white px-5 py-2 rounded-md"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const oldPrice =
    Number(product.oldPrice) > 0
      ? Number(product.oldPrice)
      : Number(product.price || 0) * 1.12;

  const savePercent = oldPrice
    ? Math.round(((oldPrice - Number(product.price || 0)) / oldPrice) * 100)
    : 0;

  return (
    <div className="bg-[#f8f8f8] min-h-screen text-[#263238]">
      <style>
        {`
          .buy-now-animate {
            animation: buyNowPulse 1.2s infinite ease-in-out;
          }

          @keyframes buyNowPulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(6, 47, 43, 0.35);
            }
            50% {
              transform: scale(1.025);
              box-shadow: 0 0 0 8px rgba(6, 47, 43, 0.08);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(6, 47, 43, 0);
            }
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="text-xs text-gray-500 mb-4 flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="hover:text-orange-500"
          >
            Back
          </button>

          <span>›</span>

          <Link to="/products" className="hover:text-orange-500">
            Products
          </Link>

          <span>›</span>

          <span>{cleanTitle(product.title)}</span>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[560px_1fr] gap-8">
          <div
            className={`grid gap-4 ${
              images.length > 1 ? "grid-cols-[70px_1fr]" : "grid-cols-1"
            }`}
          >
            {images.length > 1 && (
              <div className="space-y-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-16 h-16 border rounded-md p-1 flex items-center justify-center ${
                      activeImage === index
                        ? "border-orange-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="border border-gray-200 rounded-md h-[430px] flex items-center justify-center bg-white">
              <img
                src={
                  images[activeImage] ||
                  getImageUrl(product.image) ||
                  "https://via.placeholder.com/500"
                }
                alt={cleanTitle(product.title)}
                className="max-h-[390px] max-w-full object-contain"
              />
            </div>
          </div>

          <div>
            <h1 className="text-[22px] md:text-[24px] font-semibold mb-3 leading-snug">
              {cleanTitle(product.title)}
            </h1>

            <div className="flex items-center gap-3 border-b border-gray-200 pb-5">
              <span className="text-2xl font-bold text-orange-500">
                ৳{Number(product.price || 0).toLocaleString()}
              </span>

              {oldPrice > Number(product.price || 0) && (
                <span className="text-gray-400 line-through">
                  ৳
                  {oldPrice.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </span>
              )}

              {savePercent > 0 && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Save {savePercent}%
                </span>
              )}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>

              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 bg-gray-50"
                >
                  −
                </button>

                <span className="w-12 text-center">{quantity}</span>

                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={addToCart}
                className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-semibold"
              >
                ADD TO CART
              </button>

              <button
                onClick={buyNow}
                className="buy-now-animate bg-[#062f2b] hover:bg-[#041f1d] text-white py-3 rounded-md font-semibold"
              >
                BUY NOW
              </button>

              <button
                onClick={orderWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-md font-semibold"
              >
                WhatsApp Order
              </button>

              <button
                onClick={callForOrder}
                className="bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-md font-semibold"
              >
                Call For Order
              </button>
            </div>

            <div className="mt-5 inline-flex items-center gap-2 border border-gray-300 rounded-md px-4 py-3 text-sm">
              Brand:
              <span className="font-semibold">
                {product.brand || "Unknown"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white mt-6 rounded-lg border border-gray-200 p-2 flex gap-2">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-5 py-2 rounded-md text-sm ${
              activeTab === "description"
                ? "bg-gray-100 font-semibold"
                : "bg-white"
            }`}
          >
            Description
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-5 py-2 rounded-md text-sm ${
              activeTab === "reviews" ? "bg-gray-100 font-semibold" : "bg-white"
            }`}
          >
            Customer Reviews ({reviews.length})
          </button>
        </div>

        {activeTab === "description" && (
          <div className="bg-white mt-5 rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-2">Product Details</h2>
            <div className="w-12 h-[2px] bg-orange-500 mb-5"></div>

            <p className="text-gray-600 leading-7 whitespace-pre-line">
              {product.description || "No description available."}
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bg-white mt-5 rounded-lg border border-gray-200 p-6 grid grid-cols-1 lg:grid-cols-[330px_1fr] gap-10">
            <div>
              <div className="text-5xl font-bold text-[#062f2b]">
                {averageRating}
              </div>

              <p className="text-sm text-gray-600 mt-2">Average Rating</p>

              <p className="text-yellow-400 mt-1">
                {"★".repeat(Math.round(Number(averageRating)))}
                {"☆".repeat(5 - Math.round(Number(averageRating)))}
              </p>

              <p className="text-sm mt-3">
                {reviews.length} Review{reviews.length !== 1 ? "s" : ""}
              </p>

              <div className="mt-8 space-y-4">
                {reviews.map((review) => {
                  const customerName = getReviewCustomerName(review);
                  const customerImage = getReviewCustomerImage(review);

                  return (
                    <div
                      key={review._id}
                      className="border border-gray-200 rounded-md p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full overflow-hidden bg-orange-100 text-orange-600 flex items-center justify-center font-bold border border-orange-200 shrink-0">
                            {customerImage ? (
                              <img
                                src={customerImage}
                                alt={customerName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              getInitial(customerName)
                            )}
                          </div>

                          <div>
                            <h4 className="font-semibold leading-tight">
                              {customerName}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">
                              Customer
                            </p>
                          </div>
                        </div>

                        <span className="text-sm text-yellow-500 shrink-0">
                          {"★".repeat(Number(review.rating || 0))}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mt-3">
                        {review.comment}
                      </p>
                    </div>
                  );
                })}

                {reviews.length === 0 && (
                  <p className="text-sm text-gray-500">No reviews yet.</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold">Submit Your Review</h2>
              <div className="w-12 h-[2px] bg-orange-500 mt-2 mb-5"></div>

              {!isLoggedIn && (
                <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-4">
                  <p className="text-red-500 mb-3">
                    Please login or register first to submit a review.
                  </p>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="border border-orange-500 text-orange-500 px-5 py-2 rounded-md font-semibold"
                    >
                      Login
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/register")}
                      className="bg-orange-500 text-white px-5 py-2 rounded-md font-semibold"
                    >
                      Register
                    </button>
                  </div>
                </div>
              )}

              {reviewMessage && (
                <p
                  className={`mb-4 ${
                    reviewMessage.toLowerCase().includes("success")
                      ? "text-green-600"
                      : "text-orange-500"
                  }`}
                >
                  {reviewMessage}
                </p>
              )}

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                disabled={!isLoggedIn}
                placeholder="Write Your Review Here..."
                className="w-full mt-2 border border-gray-300 rounded-md p-4 h-36 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_170px] gap-4">
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(e.target.value)}
                  disabled={!isLoggedIn}
                  className="border border-gray-300 rounded-md px-4 py-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select One</option>
                  <option value="5">5 Star</option>
                  <option value="4">4 Star</option>
                  <option value="3">3 Star</option>
                  <option value="2">2 Star</option>
                  <option value="1">1 Star</option>
                </select>

                <button
                  onClick={submitReview}
                  disabled={!isLoggedIn || reviewLoading}
                  className="bg-[#333] text-white rounded-md px-5 py-3 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {reviewLoading ? "SUBMITTING..." : "SUBMIT REVIEW"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">Related Products</h2>

            <Link to="/products" className="text-orange-500 text-sm">
              More Products →
            </Link>
          </div>

          {relatedProducts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-gray-500">
              No related products found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {relatedProducts.map((item) => {
                const itemId = getProductId(item);
                const relatedImage =
                  getImageUrl(item.images?.[0]) ||
                  getImageUrl(item.image) ||
                  "https://via.placeholder.com/300";

                return (
                  <div
                    key={itemId}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <Link to={`/products/${itemId}`}>
                      <div className="h-56 p-4 flex items-center justify-center">
                        <img
                          src={relatedImage}
                          alt={cleanTitle(item.title)}
                          className="max-h-full object-contain"
                        />
                      </div>
                    </Link>

                    <div className="p-4">
                      <Link to={`/products/${itemId}`}>
                        <h3 className="font-semibold text-sm line-clamp-2 min-h-[42px]">
                          {cleanTitle(item.title)}
                        </h3>
                      </Link>

                      <p className="text-orange-500 font-bold mt-2">
                        ৳{Number(item.price || 0).toLocaleString()}
                      </p>

                      <button
                        onClick={() => {
                          const oldCart =
                            JSON.parse(localStorage.getItem("cart")) || [];

                          const existing = oldCart.find(
                            (cartItem) =>
                              String(cartItem.productId) === String(itemId),
                          );

                          let updatedCart;

                          if (existing) {
                            updatedCart = oldCart.map((cartItem) =>
                              String(cartItem.productId) === String(itemId)
                                ? {
                                    ...cartItem,
                                    quantity:
                                      Number(cartItem.quantity || 1) + 1,
                                  }
                                : cartItem,
                            );
                          } else {
                            updatedCart = [
                              ...oldCart,
                              {
                                productId: itemId,
                                title: cleanTitle(item.title),
                                price: Number(item.price) || 0,
                                image: relatedImage,
                                quantity: 1,
                              },
                            ];
                          }

                          localStorage.setItem(
                            "cart",
                            JSON.stringify(updatedCart),
                          );

                          window.dispatchEvent(new Event("cartUpdated"));
                          alert("Product added to cart");
                        }}
                        className="w-full mt-3 border border-orange-500 text-orange-500 py-2 rounded-md hover:bg-orange-500 hover:text-white text-sm"
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
