const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/database");

// ================= CONFIG =================
dotenv.config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// STATIC FILES (UPLOADS FOLDER)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= ROUTES =================
const authRoutes = require("./routes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin", adminRoutes);

// ================= HOME TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

// ================= START SERVER AFTER DB =================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("MongoDB Connected");
      console.log(`Server running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("DB Connection Failed:", error.message);
    process.exit(1);
  }
};

startServer();