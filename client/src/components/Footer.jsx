import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-8 py-10 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* 1. Company Info */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">ShopEase</h3>
          <p className="text-sm">
            Your trusted online store for fashion, electronics, and more.
          </p>
          <p className="text-sm mt-2">
            © {new Date().getFullYear()} ShopEase. All rights reserved.
          </p>
        </div>

        {/* 2. Quick Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/products" className="hover:underline">
                Products
              </Link>
            </li>
            <li>
              <Link to="/categories" className="hover:underline">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:underline">
                Cart
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:underline">
                My Account
              </Link>
            </li>
          </ul>
        </div>

        {/* 3. Customer Service */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Customer Service
          </h3>
          <ul className="space-y-2">
            <li>
              <Link to="/help" className="hover:underline">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/returns" className="hover:underline">
                Returns & Refunds
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:underline">
                Shipping Info
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* 4. Newsletter & Social Media */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Stay Connected
          </h3>
          <form className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded text-black"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
            >
              Subscribe
            </button>
          </form>
          <div className="flex space-x-4 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              🌐 Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              📸 Instagram
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              🐦 Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
