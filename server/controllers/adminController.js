let User;

try {
  User = require("../models/userModel");
} catch (err1) {
  try {
    User = require("../models/User");
  } catch (err2) {
    User = require("../models/user");
  }
}

const Order = require("../models/orderModel");
const Review = require("../models/reviewModel");
const Product = require("../models/adminProductModel");

const userSelectFields =
  "fullName name username email phone role isBlocked profileImage profilePic avatar image photoURL picture createdAt";

const getNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const getDisplayName = (user) => {
  return (
    user?.fullName ||
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "Customer"
  );
};

const getProfileImage = (user) => {
  return (
    user?.profileImage ||
    user?.profilePic ||
    user?.avatar ||
    user?.image ||
    user?.photoURL ||
    user?.picture ||
    ""
  );
};

const getOrderTotal = (order) => {
  return getNumber(
    order?.totalAmount ||
      order?.total ||
      order?.subTotal ||
      order?.subtotal ||
      0,
  );
};

const getOrderCustomerName = (order) => {
  return (
    order?.customerName ||
    order?.name ||
    order?.shippingAddress?.fullName ||
    order?.userName ||
    "Customer"
  );
};

exports.getAdminDashboard = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    const users = await User.find()
      .select(userSelectFields)
      .sort({ createdAt: -1 })
      .lean();
    const products = await Product.find().lean();
    const totalReviews = await Review.countDocuments();

    const getNumber = (value) => {
      const num = Number(value);
      return Number.isFinite(num) ? num : 0;
    };

    const getOrderTotal = (order) => {
      return getNumber(
        order.totalAmount ||
          order.grandTotal ||
          order.total ||
          order.subTotal ||
          order.subtotal ||
          order.orderTotal ||
          order.payableAmount ||
          order.amount ||
          0,
      );
    };

    const getCustomerNameFromOrder = (order) => {
      return (
        order.customerName ||
        order.fullName ||
        order.name ||
        order.userName ||
        order.customer?.name ||
        order.customer?.fullName ||
        order.customerInfo?.name ||
        order.customerInfo?.fullName ||
        order.shippingAddress?.fullName ||
        order.shippingAddress?.name ||
        order.shipping?.fullName ||
        order.shipping?.name ||
        order.address?.fullName ||
        order.address?.name ||
        "Customer"
      );
    };

    const totalOrders = orders.length;
    const totalUsers = users.length;
    const totalProducts = products.length;

    const totalSales = orders
      .filter(
        (order) => String(order.status || "").toLowerCase() !== "cancelled",
      )
      .reduce((sum, order) => sum + getOrderTotal(order), 0);

    const revenue = totalSales;

    const now = new Date();
    const last30Days = new Date();
    last30Days.setDate(now.getDate() - 30);

    const newUsers = users.filter((user) => {
      if (!user.createdAt) return false;
      return new Date(user.createdAt) >= last30Days;
    }).length;

    const activeUsers = users.filter((user) => !user.isBlocked).length;

    const lowStockProducts = products.filter((product) => {
      const stock = getNumber(product.stock || product.quantity || 0);
      return stock <= 10;
    });

    const productCostMap = {};

    products.forEach((product) => {
      productCostMap[String(product._id)] = getNumber(
        product.costPrice ||
          product.purchasePrice ||
          product.buyingPrice ||
          product.wholesalePrice ||
          0,
      );
    });

    const profit = orders.reduce((sum, order) => {
      const items = Array.isArray(order.items)
        ? order.items
        : Array.isArray(order.orderItems)
          ? order.orderItems
          : Array.isArray(order.products)
            ? order.products
            : [];

      const orderProfit = items.reduce((itemSum, item) => {
        const productId = String(
          item.productId || item.product || item._id || "",
        );
        const price = getNumber(
          item.price || item.salePrice || item.productPrice,
        );
        const quantity = getNumber(item.quantity || item.qty || 1);

        const cost = getNumber(
          item.costPrice ||
            item.purchasePrice ||
            item.buyingPrice ||
            productCostMap[productId] ||
            0,
        );

        if (!cost) return itemSum;

        return itemSum + (price - cost) * quantity;
      }, 0);

      return sum + orderProfit;
    }, 0);

    const recentOrders = orders.slice(0, 5).map((order) => ({
      _id: order._id,
      orderId:
        order.orderId || order.invoiceId || `#${String(order._id).slice(-6)}`,
      customer: getCustomerNameFromOrder(order),
      phone:
        order.phone ||
        order.customerPhone ||
        order.shippingAddress?.phone ||
        order.shipping?.phone ||
        "",
      amount: getOrderTotal(order),
      status: order.status || order.orderStatus || "Pending",
      paymentStatus: order.paymentStatus || "Unpaid",
      date: order.createdAt || order.orderDate,
    }));

    res.json({
      success: true,
      dashboard: {
        totalSales,
        totalOrders,
        newUsers,
        activeUsers,
        totalUsers,
        totalProducts,
        totalReviews,
        recentOrders,
        quickReports: {
          revenue,
          profit,
          lowStockAlert: lowStockProducts.length,
          abandonedCart: 0,
        },
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAdminSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalProducts = await Product.countDocuments();

    const orders = await Order.find().lean();

    const totalSales = orders.reduce((sum, order) => {
      return sum + getOrderTotal(order);
    }, 0);

    res.json({
      success: true,
      summary: {
        totalUsers,
        totalOrders,
        totalReviews,
        totalProducts,
        totalSales,
      },
    });
  } catch (error) {
    console.error("Admin summary error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const usersFromDb = await User.find()
      .select(userSelectFields)
      .sort({ createdAt: -1 })
      .lean();

    const users = usersFromDb.map((user) => ({
      ...user,
      displayName: getDisplayName(user),
      profileImage: getProfileImage(user),
    }));

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get admin users error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const allowedRoles = ["user", "customer", "admin", "vendor"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true },
    )
      .select(userSelectFields)
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User role updated successfully",
      user: {
        ...user,
        displayName: getDisplayName(user),
        profileImage: getProfileImage(user),
      },
    });
  } catch (error) {
    console.error("Update user role error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    const safeUser = await User.findById(req.params.id)
      .select(userSelectFields)
      .lean();

    res.json({
      success: true,
      message: user.isBlocked ? "User blocked" : "User unblocked",
      user: {
        ...safeUser,
        displayName: getDisplayName(safeUser),
        profileImage: getProfileImage(safeUser),
      },
    });
  } catch (error) {
    console.error("Toggle user block error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get admin orders error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviewsFromDb = await Review.find()
      .populate("productId", "title image images")
      .sort({ createdAt: -1 })
      .lean();

    const userIds = [
      ...new Set(
        reviewsFromDb
          .map((review) => review.userId)
          .filter(Boolean)
          .map(String),
      ),
    ];

    let users = [];

    if (userIds.length && User) {
      users = await User.find({ _id: { $in: userIds } })
        .select(
          "fullName name username email phone profileImage profilePic avatar image photoURL picture",
        )
        .lean();
    }

    const userMap = {};

    users.forEach((user) => {
      userMap[String(user._id)] = user;
    });

    const reviews = reviewsFromDb.map((review) => {
      const matchedUser = userMap[String(review.userId)];

      const realCustomerName =
        review.userName &&
        review.userName !== "Customer" &&
        review.userName !== "Guest" &&
        review.userName !== "Guest Customer"
          ? review.userName
          : getDisplayName(matchedUser) ||
            review.userEmail?.split("@")[0] ||
            "Customer";

      return {
        ...review,
        userName: realCustomerName,
        customerName: realCustomerName,
        userEmail: review.userEmail || matchedUser?.email || "",
        profileImage: review.profileImage || getProfileImage(matchedUser),
        productTitle:
          review.productId?.title ||
          review.productTitle ||
          review.productName ||
          "Product",
      };
    });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get admin reviews error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCategoriesAndBrands = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    const brands = await Product.distinct("brand");

    res.json({
      success: true,
      categories: categories.filter(Boolean),
      brands: brands.filter(Boolean),
    });
  } catch (error) {
    console.error("Categories brands error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
