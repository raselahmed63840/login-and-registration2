import React, { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../../api/productApi";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const emptyForm = {
  title: "",
  price: "",
  oldPrice: "",
  stock: "",
  category: "shirt",
  brand: "",
  status: "Visible",
  description: "",
};

const categoryOptions = [
  { label: "Combo", value: "combo" },
  { label: "Shirt", value: "shirt" },
  { label: "Pant", value: "pant" },
  { label: "Belt", value: "belt" },
  { label: "Shari", value: "shari" },
  { label: "3 Piece", value: "3pic" },
  { label: "Honey", value: "Honey" },
];

const getProductImage = (product) => {
  const image =
    product?.images?.[0] ||
    product?.image ||
    product?.thumbnail ||
    product?.imageUrl ||
    "";

  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/uploads")) {
    return `${API_BASE_URL}${image}`;
  }

  if (image.startsWith("/")) {
    return image;
  }

  return `${API_BASE_URL}/uploads/products/${image}`;
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    const data = await fetchProducts({ includeHidden: true });
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setSelectedImages([]);
    setPreviewImages([]);
    setEditingProduct(null);
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    setSelectedImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const buildFormData = () => {
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("oldPrice", form.oldPrice);
    formData.append("stock", form.stock);
    formData.append("category", form.category);
    formData.append("brand", form.brand);
    formData.append("status", form.status);
    formData.append("description", form.description);

    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price || !form.category) {
      setMessage("Title, price and category are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = buildFormData();

      if (editingProduct) {
        const res = await updateProduct(editingProduct._id, formData);

        if (res.success) {
          setMessage("Product updated successfully");
        }
      } else {
        const res = await createProduct(formData);

        if (res.success) {
          setMessage("Product added successfully");
        }
      }

      resetForm();
      await loadProducts();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);

    setForm({
      title: product.title || "",
      price: product.price || "",
      oldPrice: product.oldPrice || "",
      stock: product.stock || "",
      category: product.category || "shirt",
      brand: product.brand || "",
      status: product.status || "Visible",
      description: product.description || "",
    });

    const oldImages = Array.isArray(product.images)
      ? product.images
      : product.image
        ? [product.image]
        : [];

    setPreviewImages(oldImages);
    setSelectedImages([]);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");

    if (!confirmDelete) return;

    try {
      const res = await deleteProduct(id);

      if (res.success) {
        setMessage("Product deleted successfully");
        await loadProducts();
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || "Delete failed",
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">Product Management</h1>
          <p className="text-slate-600 mt-1">
            Add, edit and manage products with multiple images
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h2>

          {message && (
            <div className="mb-4 rounded-xl border border-orange-300 bg-orange-50 text-orange-600 px-4 py-3">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                name="title"
                placeholder="Product title"
                value={form.title}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3 outline-none focus:border-orange-500"
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3 outline-none focus:border-orange-500"
              />

              <input
                type="number"
                name="oldPrice"
                placeholder="Old price"
                value={form.oldPrice}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3 outline-none focus:border-orange-500"
              />

              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3 outline-none focus:border-orange-500 bg-white"
              >
                {categoryOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={form.brand}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3 outline-none focus:border-orange-500"
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3 outline-none focus:border-orange-500 bg-white"
              >
                <option value="Visible">Visible</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>

            <textarea
              name="description"
              placeholder="Product description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:border-orange-500 mb-4"
            />

            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Upload Product Images
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded-xl px-4 py-3"
              />

              <p className="text-sm text-slate-500 mt-2">
                You can select multiple images. Maximum 10 images.
              </p>
            </div>

            {previewImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-5">
                {previewImages.map((image, index) => (
                  <div
                    key={index}
                    className="w-24 h-24 border rounded-xl flex items-center justify-center overflow-hidden bg-white"
                  >
                    <img
                      src={image}
                      alt={`preview-${index}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold disabled:bg-orange-300"
              >
                {loading
                  ? "Saving..."
                  : editingProduct
                    ? "Update Product"
                    : "Add Product"}
              </button>

              {editingProduct && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-700 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h2 className="text-2xl font-bold mb-4">
            Product List ({products.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b">
                  <th className="text-left p-4">Image</th>
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Images</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => {
                  const imageUrl = getProductImage(product);
                  const imageCount = Array.isArray(product.images)
                    ? product.images.length
                    : product.image
                      ? 1
                      : 0;

                  return (
                    <tr key={product._id} className="border-b">
                      <td className="p-4">
                        <div className="w-20 h-20 border rounded-lg flex items-center justify-center bg-white overflow-hidden">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.title}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-xs text-slate-400">
                              No Image
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 font-semibold">{product.title}</td>
                      <td className="p-4">৳{product.price}</td>
                      <td className="p-4">{product.stock}</td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4">{imageCount} images</td>
                      <td className="p-4">{product.status}</td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(product._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {products.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-slate-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
