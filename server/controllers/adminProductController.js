const AdminProduct = require("../models/adminProductModel");

const normalizeCategory = (category = "") => {
  const value = String(category).trim().toLowerCase();

  if (value === "3 piece" || value === "3-piece" || value === "three piece") {
    return "3pic";
  }

  return value.replace(/\s+/g, "-");
};

const getUploadedFiles = (req) => {
  const files = req.files;

  if (!files) return [];

  if (Array.isArray(files)) return files;

  const allFiles = [];

  Object.keys(files).forEach((fieldName) => {
    if (Array.isArray(files[fieldName])) {
      allFiles.push(...files[fieldName]);
    }
  });

  return allFiles;
};

const getImageUrls = (req) => {
  const files = getUploadedFiles(req);

  return files.map((file) => {
    return `${req.protocol}://${req.get("host")}/uploads/products/${
      file.filename
    }`;
  });
};

exports.getProducts = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = normalizeCategory(req.query.category);
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const products = await AdminProduct.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await AdminProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getFeaturedCategories = async (req, res) => {
  try {
    const categorySections = [
      {
        title: "Combo",
        slug: "combo",
        fallbackImage: "/category/combo.png",
      },
      {
        title: "Shirt",
        slug: "shirt",
        fallbackImage: "/category/shirt.png",
      },
      {
        title: "Pant",
        slug: "pant",
        fallbackImage: "/category/pant.png",
      },
      {
        title: "Belt",
        slug: "belt",
        fallbackImage: "/category/belt.png",
      },
      {
        title: "Shari",
        slug: "shari",
        fallbackImage: "/category/shari.png",
      },
      {
        title: "3 Piece",
        slug: "3pic",
        fallbackImage: "/category/3pic.png",
      },
    ];

    const products = await AdminProduct.find({
      status: { $ne: "Hidden" },
    }).sort({ createdAt: -1 });

    const categories = categorySections.map((section) => {
      const product = products.find(
        (item) => normalizeCategory(item.category) === section.slug,
      );

      const productImage =
        product?.images?.[0] ||
        product?.image ||
        product?.thumbnail ||
        product?.imageUrl ||
        "";

      return {
        title: section.title,
        slug: section.slug,
        fallbackImage: section.fallbackImage,
        image: productImage || section.fallbackImage,
        productId: product?._id || null,
        productTitle: product?.title || "",
        price: product?.price || null,
      };
    });

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Get featured categories error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const body = req.body || {};

    const {
      title,
      price,
      oldPrice,
      stock,
      category,
      brand,
      status,
      description,
    } = body;

    if (!title || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, price and category are required",
      });
    }

    const uploadedImages = getImageUrls(req);

    const product = await AdminProduct.create({
      title: title.trim(),
      price: Number(price),
      oldPrice: Number(oldPrice) || 0,
      stock: Number(stock) || 0,
      category: normalizeCategory(category),
      brand: brand || "",
      image: uploadedImages[0] || "",
      images: uploadedImages,
      status: status || "Visible",
      description: description || "",
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await AdminProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const body = req.body || {};
    const uploadedImages = getImageUrls(req);

    const currentImages = Array.isArray(product.images) ? product.images : [];

    const finalImages =
      uploadedImages.length > 0 ? uploadedImages : currentImages;

    product.title = body.title?.trim() || product.title;

    product.price =
      body.price !== undefined ? Number(body.price) || 0 : product.price;

    product.oldPrice =
      body.oldPrice !== undefined
        ? Number(body.oldPrice) || 0
        : product.oldPrice;

    product.stock =
      body.stock !== undefined ? Number(body.stock) || 0 : product.stock;

    product.category = body.category
      ? normalizeCategory(body.category)
      : product.category;

    product.brand = body.brand !== undefined ? body.brand : product.brand;

    product.status = body.status || product.status || "Visible";

    product.description =
      body.description !== undefined ? body.description : product.description;

    product.images = finalImages;
    product.image = finalImages[0] || product.image || "";

    const updatedProduct = await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await AdminProduct.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
