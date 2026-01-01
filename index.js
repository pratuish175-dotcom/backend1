require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");
const subcategoryRoutes = require("./routes/subcategories");
const productWeightRoutes = require("./routes/productWeight");
const productRamRoutes = require("./routes/productRams");
const productSizeRoutes = require("./routes/productSize");
const userRoutes = require("./routes/users");
const cart = require("./routes/cart");
const reviews = require("./routes/productReviews");
const myListRoutes = require("./routes/myList");
const productColorRoutes = require("./routes/productColorRoutes");
const orderRoutes = require("./routes/orderRoutes.js");

const app = express();
const fs = require("fs");
const path = require("path");

// Create uploads folder if missing
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📂 uploads folder created");
}

// Parse JSON request bodies
app.use(express.json());

// Allowed frontend origins
  const allowedOrigins = [
  "https://frontend1-k4r9tdd6a-pjha9256s-projects.vercel.app",
,
  "http://localhost:3000"
];


// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin.trim())) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Preflight handling
app.options("*", cors());

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/productWeight", productWeightRoutes);
app.use("/api/productRAMS", productRamRoutes);
app.use("/api/productSize", productSizeRoutes);
app.use("/api/cart", cart);
app.use("/api/reviews", reviews);
app.use("/api/mylist", myListRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/productColor", productColorRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log("🟢 MongoDB Connected"))
  .catch((err) => console.error("🔴 MongoDB Error:", err));

// Start Server on Vercel / Render port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
