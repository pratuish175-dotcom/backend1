require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");
const subcategoryRoutes = require("./routes/subcategories")
const productWeightRoutes= require("./routes/productWeight")
const productRamRoutes=require("./routes/productRams")
const productSizeRoutes=require("./routes/productSize")
const userRoutes =require('./routes/users')
const cart =require('./routes/cart')
const reviews =require('./routes/productReviews')
const myListRoutes = require('./routes/myList');
const productColorRoutes = require("./routes/productColorRoutes");

const app = express();
const fs = require("fs");
const path = require("path");
const orderRoutes = require("./routes/orderRoutes.js");

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ 'uploads' folder created!");
}


// Middlewares

app.use(cors());
app.use(express.json()); // Parse JSON request bodies
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});


// Routes
app.use("/api/user",userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/subcategories", subcategoryRoutes); // Add this route
app.use("/api/productWeight",productWeightRoutes)
app.use("/api/productRAMS", productRamRoutes);
app.use("/api/productSize",   productSizeRoutes);
app.use("/api/cart",cart);
app.use('/api/reviews',reviews);
app.use('/api/mylist', myListRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/productColor", productColorRoutes)

// Database Connection
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log("✅ Database Connected"))
  .catch((err) => console.error("❌ Database Connection Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
