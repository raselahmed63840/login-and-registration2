import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const normalizeProducts = (data) => {
  if (data?.success && Array.isArray(data.products)) {
    return data.products;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
};

export const fetchProducts = async (options = {}) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/admin6935/products`);

    const products = normalizeProducts(res.data);

    if (options.includeHidden) {
      return products;
    }

    return products.filter((product) => product.status !== "Hidden");
  } catch (error) {
    console.error("Fetch products error:", error);
    return [];
  }
};

export const fetchFeaturedCategories = async () => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/api/admin6935/products/featured-categories`,
    );

    if (res.data?.success && Array.isArray(res.data.categories)) {
      return res.data.categories;
    }

    return [];
  } catch (error) {
    console.error("Fetch featured categories error:", error);
    return [];
  }
};

export const fetchProduct = async (id) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/admin6935/products/${id}`);

    if (res.data?.success && res.data.product) {
      return res.data.product;
    }

    return res.data;
  } catch (error) {
    console.error("Fetch product error:", error);
    return null;
  }
};

export const createProduct = async (productData) => {
  const res = await axios.post(
    `${API_BASE_URL}/api/admin6935/products`,
    productData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return res.data;
};

export const updateProduct = async (id, productData) => {
  const res = await axios.put(
    `${API_BASE_URL}/api/admin6935/products/${id}`,
    productData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await axios.delete(
    `${API_BASE_URL}/api/admin6935/products/${id}`,
  );
  return res.data;
};
