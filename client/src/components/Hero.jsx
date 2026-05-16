import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import bannerLeft from "../assets/banner-left.jpg";
import bannerLeft2 from "../assets/banner-left-2.png";
import bannerLeft3 from "../assets/banner-left-3.png";
import bannerRight from "../assets/banner-right.jpg";

const AUTO_SLIDE_DELAY = 2500;

const slides = [
  {
    id: 1,
    image: bannerLeft,
    to: "/products",
    alt: "Main offer banner",
  },
  {
    id: 2,
    image: bannerLeft2,
    to: "/products?category=combo",
    alt: "Combo offer banner",
  },
  {
    id: 3,
    image: bannerLeft3,
    to: "/products?category=shirt",
    alt: "Shirt offer banner",
  },
];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_SLIDE_DELAY);

    return () => clearInterval(timer);
  }, []);

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section className="w-full bg-[#fbf8f1] px-4 sm:px-6 lg:px-10 pt-5 pb-6">
      <div className="max-w-[1536px] mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
        {/* Left Horizontal Slider */}
        <div className="relative w-full h-[220px] sm:h-[310px] md:h-[390px] lg:h-[395px] bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
          <div
            className="flex w-full h-full transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
            }}
          >
            {slides.map((slide) => (
              <Link
                key={slide.id}
                to={slide.to}
                className="min-w-full h-full block"
              >
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                  loading="eager"
                  draggable="false"
                />
              </Link>
            ))}
          </div>

          {/* Left Arrow */}
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 text-orange-500 flex items-center justify-center text-2xl shadow hover:bg-orange-500 hover:text-white transition"
          >
            ‹
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 text-orange-500 flex items-center justify-center text-2xl shadow hover:bg-orange-500 hover:text-white transition"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/10 rounded-full px-3 py-1.5">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index ? "w-5 bg-orange-500" : "w-2.5 bg-white"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Fixed Banner */}
        <Link
          to="/products?category=combo"
          className="hidden lg:block w-full h-[395px] bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100"
        >
          <img
            src={bannerRight}
            alt="Right offer banner"
            className="w-full h-full object-cover"
            loading="eager"
            draggable="false"
          />
        </Link>
      </div>
    </section>
  );
};

export default Hero;
