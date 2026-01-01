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

// Uploads folder creation
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("⭐ 'uploads' folder created!");
}

// CORS FIXED
const allowedOrigins = [
  "http://localhost:3001",
  "https://frontend1-maqwtl9iq-pjha9256s-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Register Routes
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

// DB Connection
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log("🟢 DB Connected"))
  .catch((err) => console.error("🔴 DB Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port: ${PORT}`));
