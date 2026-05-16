import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SocialAuthButtons from "../components/SocialAuthButtons";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const goByRole = (user) => {
    if (user?.role === "admin") {
      navigate("/admin");
    } else if (user?.role === "vendor") {
      navigate("/vendor");
    } else {
      navigate("/account");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setMessage("Full name is required");
      return;
    }

    if (!formData.email.trim() && !formData.phone.trim()) {
      setMessage("Email or phone is required");
      return;
    }

    if (!formData.password.trim()) {
      setMessage("Password is required");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        fullName: formData.fullName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      });

      if (res.data?.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("authUser", JSON.stringify(res.data.user));

        setMessage("Registration successful");

        window.dispatchEvent(new Event("storage"));

        goByRole(res.data.user);
      } else {
        setMessage(res.data?.message || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
        <div className="text-center mb-6">
          <Link to="/home" className="inline-flex items-center justify-center gap-2">
            <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center text-2xl font-bold">
              S
            </div>

            <div className="text-left leading-5">
              <h1 className="text-2xl font-extrabold text-orange-500">SHOP</h1>
              <h1 className="text-2xl font-extrabold text-orange-500">EASE</h1>
            </div>
          </Link>

          <h2 className="text-2xl font-bold text-slate-800 mt-5">
            Create New Account
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Register manually or continue with Google/Facebook
          </p>
        </div>

        {message && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg text-sm border ${
              message.toLowerCase().includes("successful")
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-600 border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mb-5">
          <SocialAuthButtons setMessage={setMessage} />

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-500">or register manually</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;