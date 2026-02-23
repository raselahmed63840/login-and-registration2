import { useState } from "react";

const ProductCard = ({ product, onBuy }) => {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-xl transition bg-white flex flex-col">
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="h-40 w-full object-contain mb-4"
        />
        {/* Discount Badge */}
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          -20%
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-sm line-clamp-2">{product.title}</h3>

      {/* Rating */}
      <div className="flex items-center text-yellow-500 mt-1">
        {Array.from({ length: Math.round(product.rating?.rate || 5) }).map(
          (_, i) => (
            <span key={i}>⭐</span>
          ),
        )}
        <span className="ml-2 text-gray-500 text-xs">
          ({product.rating?.count || 120})
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center space-x-2 mt-2">
        <span className="line-through text-gray-400 text-sm">
          ${(product.price * 1.2).toFixed(2)}
        </span>
        <span className="text-green-600 font-bold">${product.price}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className={`text-lg ${
            wishlisted ? "text-red-600" : "text-gray-400"
          } hover:text-red-500 transition`}
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>
        <button
          onClick={() => onBuy(product)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
