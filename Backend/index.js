const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/database");

dotenv.config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// 🔥 DEBUG MIDDLEWARE
app.use((req, res, next) => {
  console.log("🔥 REQUEST:", req.method, req.url);
  next();
});

// ================= STATIC FILES =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= ROUTES IMPORT =================
const authRoutes = require("./routes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cartRoutes = require("./routes/cartRoutes");

// ⭐ PAYMENT ROUTES (NEW)
const paymentRoutes = require("./routes/paymentRoutes");

// ================= ROUTES USE =================
app.use("/api/auth", authRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/menu", menuRoutes);

// ✔ IMPORTANT FIX (orders not order)
app.use("/api/orders", orderRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);

// ⭐ PAYMENT API
app.use("/api/payment", paymentRoutes);

// ================= HOME ROUTE =================
app.get("/", (req, res) => {
  res.send("API Running Successfully 🚀");
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err.message);
  res.status(500).json({ msg: "Internal Server Error" });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("✅ MongoDB Connected");
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ DB Connection Failed:", error.message);
    process.exit(1);
  }
};

startServer();