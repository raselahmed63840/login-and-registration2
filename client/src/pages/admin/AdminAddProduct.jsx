import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../api/productApi";

const AdminAddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const authUser = localStorage.getItem("authUser");

    if (!token || !authUser) {
      setMessage("Please login first.");
      navigate("/login");
      return;
    }

    if (!form.title || !form.price || !form.category) {
      setMessage("Title, price and category are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("category", form.category);
      formData.append("brand", form.brand);
      formData.append("description", form.description);

      if (image) {
        formData.append("image", image);
      }

      const res = await createProduct(formData);

      if (res.success) {
        setMessage("Product added successfully");

        const savedProduct = res.product;
        const productId = savedProduct?._id || savedProduct?.id;

        if (productId) {
          navigate(`/products/${productId}`);
        } else {
          navigate("/products");
        }
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || "Product add failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Add Product</h1>

        {message && (
          <div className="mb-5 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Product title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />

            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={form.brand}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <textarea
            name="description"
            placeholder="Product description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded-xl px-4 py-3"
          />

          <div>
            <label className="block mb-2 font-semibold">Product Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded-xl px-4 py-3"
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 w-40 h-40 object-contain border rounded-xl"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-xl font-semibold ${
              loading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {loading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;
