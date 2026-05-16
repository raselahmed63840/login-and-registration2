import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithFirebaseProvider } from "../utils/firebaseAuth";

const SocialAuthButtons = ({ setMessage }) => {
  const navigate = useNavigate();
  const [loadingProvider, setLoadingProvider] = useState("");

  const goByRole = (user) => {
    if (user?.role === "admin") {
      navigate("/admin");
    } else if (user?.role === "vendor") {
      navigate("/vendor");
    } else {
      navigate("/account");
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setLoadingProvider(provider);
      setMessage?.("");

      const data = await loginWithFirebaseProvider(provider);

      setMessage?.("Login successful");
      goByRole(data.user);
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      setMessage?.(error.message || `${provider} login failed`);
    } finally {
      setLoadingProvider("");
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => handleSocialLogin("google")}
        disabled={loadingProvider !== ""}
        className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-slate-800 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 disabled:opacity-60"
      >
        <span className="text-xl">🌐</span>
        {loadingProvider === "google"
          ? "Connecting Google..."
          : "Continue with Google"}
      </button>
    </div>
  );
};

export default SocialAuthButtons;
