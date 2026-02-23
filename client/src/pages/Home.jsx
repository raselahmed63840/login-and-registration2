import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import BrandShowcase from "../components/BrandShowcase";
import Products from "./Products";
import TrendingSection from "../components/TrendingSection";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <BrandShowcase />
      <Products />
      <TrendingSection />
      <Footer />
    </div>
  );
};

export default Home;
