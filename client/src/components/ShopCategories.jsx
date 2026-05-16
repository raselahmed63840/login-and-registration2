import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFeaturedCategories } from "../api/productApi";

const fallbackCategories = [
  {
    id: 1,
    title: "Combo",
    slug: "combo",
    image: "/category/combo.png",
  },
  {
    id: 2,
    title: "Shirt",
    slug: "shirt",
    image: "/category/shirt.png",
  },
  {
    id: 3,
    title: "Pant",
    slug: "pant",
    image: "/category/pant.png",
  },
  {
    id: 4,
    title: "Belt",
    slug: "belt",
    image: "/category/belt.png",
  },
  {
    id: 5,
    title: "Shari",
    slug: "shari",
    image: "/category/shari.png",
  },
  {
    id: 6,
    title: "3 Piece",
    slug: "3pic",
    image: "/category/3pic.png",
  },
];

const ShopCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchFeaturedCategories();

      if (Array.isArray(data) && data.length > 0) {
        setCategories(
          data.map((item, index) => ({
            id: item.slug || index,
            title: item.title,
            slug: item.slug,
            image:
              item.image ||
              item.fallbackImage ||
              fallbackCategories[index]?.image,
            fallbackImage:
              item.fallbackImage || fallbackCategories[index]?.image,
          })),
        );
      }
    };

    loadCategories();
  }, []);

  const handleImageError = (e, item) => {
    e.currentTarget.src =
      item.fallbackImage ||
      fallbackCategories.find((c) => c.slug === item.slug)?.image;
  };

  return (
    <section className="relative w-full bg-[#fbf8f1] pt-5 pb-8 sm:pt-6 sm:pb-10 lg:pt-7 lg:pb-12">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-5 lg:px-6">
        <h2 className="text-center text-[26px] sm:text-[30px] font-medium text-slate-900 mb-7 sm:mb-8">
          Featured Categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 sm:gap-x-5 lg:gap-x-6 gap-y-7">
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                navigate(`/products?category=${encodeURIComponent(item.slug)}`)
              }
              className="group flex flex-col items-center text-center mx-auto w-full max-w-[170px] sm:max-w-[185px] lg:max-w-[195px]"
            >
              <div className="w-full aspect-square bg-white rounded-[22px] flex items-center justify-center shadow-sm border border-transparent group-hover:border-orange-200 group-hover:shadow-lg transition-all duration-300">
                <img
                  src={item.image}
                  alt={item.title}
                  onError={(e) => handleImageError(e, item)}
                  className="w-[72%] h-[72%] object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <h3 className="mt-4 text-[18px] sm:text-[20px] font-normal text-slate-800 group-hover:text-orange-500 transition">
                {item.title}
              </h3>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopCategories;
