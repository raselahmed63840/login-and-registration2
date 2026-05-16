import React from "react";
import Hero from "../components/Hero";
import ShopCategories from "../components/ShopCategories";
import Products from "./Products";
import LiveSection from "../components/LiveSection";

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#fffaf2] via-[#fbf8f1] to-white text-slate-900">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 h-[360px] w-[360px] rounded-full bg-orange-100/40 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-[280px] h-[420px] w-[420px] rounded-full bg-emerald-100/30 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-[760px] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-yellow-100/30 blur-3xl" />

        <main className="relative z-10">
          <section className="bg-gradient-to-b from-[#fffaf2] to-[#fbf8f1]">
            <Hero />
          </section>

          <ShopCategories />

          <section className="bg-[#fffaf2]/80">
            <LiveSection />
          </section>

          <section className="bg-[#fffaf2]/80">
            <Products />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
