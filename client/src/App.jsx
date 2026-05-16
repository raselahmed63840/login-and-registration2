import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIChatbot from "./components/AIChatbot";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import TrackOrder from "./pages/TrackOrder";
import LiveViewer from "./pages/LiveViewer";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminLive from "./pages/admin/AdminLive";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminCategoriesBrands from "./pages/admin/AdminCategoriesBrands";
import Orders from "./pages/Orders";
import FloatingCartSummary from "./components/FloatingCartSummary";
import FloatingMessenger from "./components/FloatingMessenger";

const App = () => {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/live" element={<LiveViewer />} />
        <Route path="/orders" element={<Orders />} />

        {/* Admin Routes */}
        <Route path="/admin6935" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add" element={<AdminAddProduct />} />
          <Route path="live" element={<AdminLive />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="categories-brands" element={<AdminCategoriesBrands />} />
        </Route>
      </Routes>

      {/* Global AI chatbot: works on all pages */}
      <AIChatbot />

      <FloatingCartSummary />
      <FloatingMessenger />
      <Footer />
    </Router>
  );
};

export default App;
