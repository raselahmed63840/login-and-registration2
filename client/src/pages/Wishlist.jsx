import React, { useEffect, useState } from "react";

const Wishlist = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setItems(wishlist);
  }, []);

  const handleRemove = (id) => {
    const updated = items.filter((item) => String(item.id || item._id) !== String(id));
    setItems(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const found = cart.find((item) => String(item.id || item._id) === String(product.id || product._id));

    if (found) {
      found.quantity = (found.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    alert("Added to cart");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-3 sm:px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl border shadow p-5 sm:p-6">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

        {items.length === 0 ? (
          <p className="text-slate-500">No wishlist items found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id || item._id} className="border rounded-2xl p-4 bg-slate-50">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-contain bg-white rounded-xl mb-3"
                />
                <h2 className="font-semibold text-slate-800">{item.title}</h2>
                <p className="text-orange-500 font-bold mt-2">${item.price}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-orange-500 text-white py-2 rounded-xl"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item.id || item._id)}
                    className="px-4 bg-red-500 text-white rounded-xl"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;