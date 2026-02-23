import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-white py-20 px-10 md:px-20 flex flex-col md:flex-row items-center justify-between">
      {/* Left Side */}
      <div className="max-w-xl space-y-6">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          Enjoy Your Day With{" "}
          <span className="text-orange-500 underline">Fashion.</span>
        </h1>
        <p className="text-gray-700 text-lg">
          Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Orci, Augue
          Sagittis Morbi Egestas. Ultricies Varius Adipiscing Leo, Gravida In
          Duis Sit Bibendum Non.
        </p>
        <Link
          to="/products"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-semibold"
        >
          Shop Now
        </Link>
      </div>

      {/* Right Side */}
      <div className="relative mt-12 md:mt-0 md:ml-10">
        <img
          src="https://www.yellowbrick.co/wp-content/uploads/2023/08/fashion_blog_styling_blog_two-models-min-1024x683.jpg"
          alt="Fashion Model"
          className="rounded-lg shadow-lg"
          width={500}
          height={500}
        />
        <div className="absolute top-6 left-6 bg-gray-200 text-black px-4 py-2 rounded-full font-bold shadow">
          30% Discount
        </div>
      </div>
    </section>
  );
};

export default Hero;
