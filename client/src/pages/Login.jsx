import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SocialAuthButtons from "../components/SocialAuthButtons";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const goByRole = (user) => {
    if (user?.role === "admin") {
      navigate("/admin");
    } else if (user?.role === "vendor") {
      navigate("/vendor");
    } else {
      navigate("/account");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!credential.trim() || !password.trim()) {
      setMessage("Please enter email/phone and password");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        credential: credential.trim(),
        password,
      });

      if (res.data?.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("authUser", JSON.stringify(res.data.user));

        setMessage("Login successful");

        window.dispatchEvent(new Event("storage"));

        goByRole(res.data.user);
      } else {
        setMessage(res.data?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
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
            Login With Credentials
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Login with your email, phone, Google or Facebook
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

        <SocialAuthButtons setMessage={setMessage} />

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Email or Phone
            </label>

            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder="Enter email or phone"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-5">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-orange-500 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;