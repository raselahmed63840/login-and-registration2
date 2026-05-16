import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, onAddToCart, onImageClick }) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id || product.id}
          product={product}
          onBuy={onAddToCart}
          onImageClick={onImageClick}
        />
      ))}
    </div>
  );
};

export default ProductGrid;