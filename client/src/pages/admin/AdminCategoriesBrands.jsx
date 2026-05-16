import React, { useEffect, useState } from "react";
import { fetchCategoriesBrands } from "../../api/adminApi";

const AdminCategoriesBrands = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCategoriesBrands();

      setCategories(data.categories || []);
      setBrands(data.brands || []);
    };

    loadData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Categories & Brands</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-5">
          <h2 className="text-xl font-bold mb-4">
            Categories ({categories.length})
          </h2>

          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center justify-between border-b py-3"
            >
              <span>{cat._id}</span>
              <span>{cat.totalProducts} products</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border p-5">
          <h2 className="text-xl font-bold mb-4">
            Brands ({brands.length})
          </h2>

          {brands.map((brand) => (
            <div
              key={brand._id}
              className="flex items-center justify-between border-b py-3"
            >
              <span>{brand._id}</span>
              <span>{brand.totalProducts} products</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesBrands;