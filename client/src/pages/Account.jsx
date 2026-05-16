import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const userId = "demoUser";
const API_URL = `http://localhost:5000/api/profile/${userId}`;

const emptyProfile = {
  fullName: "",
  profileImage: "",
  dateOfBirth: "",
  gender: "",
  phone: "",
  email: "",
  username: "",
  shippingAddress: "",
  billingAddress: "",
};

const menuItems = [
  { key: "account", label: "My Accounts", icon: "👤" },
  { key: "orders", label: "My Orders", icon: "🛍️" },
  { key: "returns", label: "Returns & Cancel", icon: "↩️" },
  { key: "reviews", label: "My Rating & Reviews", icon: "⭐" },
  { key: "wishlist", label: "My Wishlist", icon: "🤍" },
  { key: "payment", label: "Payment", icon: "💳" },
  { key: "password", label: "Change Password", icon: "🔒" },
];

const defaultProfileImage = "https://via.placeholder.com/150x150.png?text=User";

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      {label}
    </label>

    <input
      {...props}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
    />
  </div>
);

const TextareaField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      {label}
    </label>

    <textarea
      {...props}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
    />
  </div>
);

const Account = () => {
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("account");
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get(API_URL);

        if (res.data?.success && res.data.profile) {
          setProfile({
            fullName: res.data.profile.fullName || "",
            profileImage: res.data.profile.profileImage || "",
            dateOfBirth: res.data.profile.dateOfBirth || "",
            gender: res.data.profile.gender || "",
            phone: res.data.profile.phone || "",
            email: res.data.profile.email || "",
            username: res.data.profile.username || "",
            shippingAddress: res.data.profile.shippingAddress || "",
            billingAddress: res.data.profile.billingAddress || "",
          });
        }
      } catch (error) {
        console.error("Profile load failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openImagePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setMessageType("error");
      setMessage("Only JPG, PNG or WEBP image allowed");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessageType("error");
      setMessage("Image size must be under 2MB");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        profileImage: reader.result,
      }));

      setMessageType("success");
      setMessage("Image selected. Click Save Information to save it.");
    };

    reader.onerror = () => {
      setMessageType("error");
      setMessage("Image upload failed. Please try again.");
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    setProfile((prev) => ({
      ...prev,
      profileImage: "",
    }));

    setMessageType("success");
    setMessage(
      "Profile image removed. Click Save Information to save changes.",
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      const res = await axios.put(API_URL, profile);

      if (res.data?.success) {
        setMessageType("success");
        setMessage("Profile updated successfully");

        setProfile({
          fullName: res.data.profile.fullName || "",
          profileImage: res.data.profile.profileImage || "",
          dateOfBirth: res.data.profile.dateOfBirth || "",
          gender: res.data.profile.gender || "",
          phone: res.data.profile.phone || "",
          email: res.data.profile.email || "",
          username: res.data.profile.username || "",
          shippingAddress: res.data.profile.shippingAddress || "",
          billingAddress: res.data.profile.billingAddress || "",
        });
      } else {
        setMessageType("error");
        setMessage("Save failed");
      }
    } catch (error) {
      console.error("Save failed:", error);
      setMessageType("error");
      setMessage(error.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-lg">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[28px] shadow-sm overflow-hidden border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
            <div className="bg-slate-50 border-r border-slate-100 p-4 md:p-6">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src={profile.profileImage || defaultProfileImage}
                  alt="profile"
                  className="w-16 h-16 rounded-full object-cover border"
                />

                <div>
                  <h2 className="font-bold text-lg text-slate-900">
                    {profile.fullName || "User"}
                  </h2>

                  <p className="text-sm text-green-600">Available for work</p>
                </div>
              </div>

              <div className="space-y-3">
                {menuItems.map((item) => {
                  const active = activeTab === item.key;

                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveTab(item.key)}
                      className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition ${
                        active
                          ? "bg-blue-500 text-white shadow"
                          : "bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 sm:p-6 md:p-8 lg:p-10">
              {activeTab === "account" ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="flex flex-col items-start gap-4">
                      <div className="relative">
                        <img
                          src={profile.profileImage || defaultProfileImage}
                          alt="profile"
                          className="w-24 h-24 rounded-full object-cover border-4 border-amber-100"
                        />

                        <button
                          type="button"
                          onClick={openImagePicker}
                          className="absolute bottom-1 right-1 bg-white border rounded-full p-2 shadow hover:bg-orange-50 transition"
                          title="Upload profile image"
                        >
                          <span className="text-orange-500 text-sm">✏️</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={openImagePicker}
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                        >
                          Upload Image
                        </button>

                        {profile.profileImage && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition"
                          >
                            Remove Image
                          </button>
                        )}
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>

                    <div className="text-blue-600 font-semibold">
                      Change Profile Information
                    </div>
                  </div>

                  {message && (
                    <div
                      className={`mb-6 rounded-xl px-4 py-3 border ${
                        messageType === "success"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-600 border-red-200"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField
                      label="Name"
                      value={profile.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      placeholder="Enter your name"
                    />

                    <InputField
                      label="Username"
                      value={profile.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      placeholder="Enter username"
                    />

                    <InputField
                      label="Date Of Birth"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) =>
                        handleChange("dateOfBirth", e.target.value)
                      }
                    />

                    <InputField
                      label="Email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="example@email.com"
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Gender
                    </label>

                    <div className="flex flex-wrap items-center gap-6">
                      {["Male", "Female", "Other"].map((gender) => (
                        <label key={gender} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="gender"
                            checked={profile.gender === gender}
                            onChange={() => handleChange("gender", gender)}
                          />
                          <span>{gender}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                    <InputField
                      label="Phone Number"
                      value={profile.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+8801XXXXXXXXX"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                    <TextareaField
                      label="Shipping Address"
                      rows={4}
                      value={profile.shippingAddress}
                      onChange={(e) =>
                        handleChange("shippingAddress", e.target.value)
                      }
                      placeholder="Enter shipping address"
                    />

                    <TextareaField
                      label="Billing Address"
                      rows={4}
                      value={profile.billingAddress}
                      onChange={(e) =>
                        handleChange("billingAddress", e.target.value)
                      }
                      placeholder="Enter billing address"
                    />
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-3 rounded-xl font-semibold shadow"
                    >
                      {saving ? "Saving..." : "Save Information"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center bg-slate-50">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {menuItems.find((item) => item.key === activeTab)?.label}
                  </h3>

                  <p className="text-slate-500">
                    এই section পরে চাইলে editable database version এ add করা
                    যাবে।
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
