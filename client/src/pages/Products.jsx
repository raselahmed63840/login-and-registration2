import React, { useState, useEffect } from "react";
import CategorySidebar from "../components/CategorySidebar";
import ProductTabs from "../components/ProductTabs";
import ProductGrid from "../components/ProductGrid";
import { fetchProducts } from "../api/productApi";

const Products = () => {
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then((data) => {
      const filtered = data.filter(
        (item) =>
          category === "All" ||
          item.category.toLowerCase().includes(category.toLowerCase()),
      );
      setProducts(filtered);
    });
  }, [category]);

  return (
    <div className="flex px-6 py-10">
      <aside className="w-1/5">
        <CategorySidebar selected={category} onSelect={setCategory} />
      </aside>
      <main className="w-4/5 pl-10">
        <ProductTabs selected={type} onSelect={setType} />
        <ProductGrid products={products} />
        <div className="text-center mt-10">
          <button className="bg-green-600 text-white px-6 py-3 rounded font-semibold">
            See All Products
          </button>
        </div>
      </main>
    </div>
  );
};

export default Products;
