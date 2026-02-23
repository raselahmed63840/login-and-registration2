import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TrendingSection = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  const nextSlide = () => {
    if (currentIndex + 2 < products.length) {
      setCurrentIndex(currentIndex + 2);
    }
  };

  const prevSlide = () => {
    if (currentIndex - 2 >= 0) {
      setCurrentIndex(currentIndex - 2);
    }
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + 2);

  return (
    <section className="bg-[#f5f5f5] py-20 px-10">
      {/* Top Section */}
      <div className="flex justify-between items-start mb-16">
        <h2 className="text-5xl font-bold text-gray-900 leading-tight">
          Trending This <br /> Month
        </h2>

        <div className="max-w-md">
          <p className="text-gray-600 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Orci, augue
            sagittis morbi egestas.
          </p>

          <div className="flex space-x-4">
            <button
              onClick={prevSlide}
              className="bg-white shadow px-4 py-2 rounded-full hover:bg-gray-200"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="bg-white shadow px-4 py-2 rounded-full hover:bg-gray-200"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 transition-all duration-500">
        {visibleProducts.map((product) => (
          <div
            key={product.id}
            className="bg-[#e9e4db] rounded-xl p-8 flex items-center justify-between shadow-md"
          >
            {/* Left Content */}
            <div className="max-w-xs">
              <h3 className="text-xl font-semibold mb-3">
                {product.title.slice(0, 20)}
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                {product.description.slice(0, 60)}...
              </p>

              <p className="font-semibold mb-2">Price</p>
              <p className="text-lg font-bold mb-4">${product.price}</p>

              <div className="flex space-x-2 mb-4">
                {["L", "M", "XL", "XXL"].map((size) => (
                  <span
                    key={size}
                    className="text-xs border px-2 py-1 rounded cursor-pointer hover:bg-green-600 hover:text-white"
                  >
                    {size}
                  </span>
                ))}
              </div>

              <div className="flex space-x-3">
                <Link
                  to={`/products/${product.id}`}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Shop Now
                </Link>

                <button className="bg-white border px-3 py-2 rounded hover:bg-gray-200">
                  ❤️
                </button>
              </div>
            </div>

            {/* Right Image */}
            <img
              src={product.image}
              alt={product.title}
              className="h-64 object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;
