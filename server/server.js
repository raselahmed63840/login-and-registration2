const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const path = require("path");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

/* =========================
   CORS SETUP
========================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman, mobile app, server-to-server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Static upload folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   MONGODB CONNECTION
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("ShopEase API is running...");
});

/* =========================
   PUBLIC / USER ROUTES
========================= */

app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));

app.use("/api/orders", require("./routes/orders"));
app.use("/api/order", require("./routes/orderRoutes"));

app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/checkout", require("./routes/checkoutRoutes"));
app.use("/api/track-order", require("./routes/trackOrderRoutes"));

app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/offers", require("./routes/offers"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/shipping", require("./routes/shipping"));
app.use("/api/users", require("./routes/User"));

/* =========================
   ADMIN ROUTES
   admin replaced by admin6935
========================= */

app.use("/api/admin6935/products", require("./routes/adminProductRoutes"));
app.use("/api/admin6935", require("./routes/adminRoutes"));

/* =========================
   404 ROUTE - ALWAYS LAST
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =========================
   SERVER LISTEN
========================= */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
