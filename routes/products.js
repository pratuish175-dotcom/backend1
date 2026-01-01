const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/product");
const Subcategory= require("../models/Subcategory")

 // Match file name

const fs =require("fs");



const router = express.Router();

const path = require("path");
const multer = require("multer");




// ✅ Ensure images are saved in the correct uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads"); // Fix path issue
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/** ✅ Helper Function: Upload Images to Cloudinary */

/** ✅ GET all products */
/** ✅ GET all products */
/** ✅ GET all products with optional filters */
router.get("/", async (req, res) => {
  try {
    const { catName, subCatId, minPrice, maxPrice, minRating } = req.query;

    let filter = {};

    // Filter by category name
    if (catName) {
      filter.catName = catName;
    }

    // Filter by subcategory ID
    if (subCatId) {
      filter.subCatId = subCatId;
    }

    // Filter by price range
    if (minPrice && maxPrice) {
      filter.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
    }

    // Filter by minimum rating
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };  // Filter by rating
    }

    const products = await Product.find(filter);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




    

// ✅ GET Featured Products
router.get(`/featured`, async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true })
      .populate("category", "name")
      .populate("subcategory", "name")
      

    res.status(200).json(featuredProducts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ GET Product by ID
router.get("/:id", async (req, res) => {
  try {
    // 👉 Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("subcategory", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


/** ✅ CREATE a new product */
// ✅ Create a new product with image upload


/** ✅ CREATE a new product */
router.post("/create", upload.array("images", 5), async (req, res) => {
  try {
    console.log("📸 Received Files:", req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "❌ No images uploaded!" });
    }

    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    let {
      name,
      description,
      price,
      oldPrice,
      catName,
      category,
      subcategory,
      countInStock,
      brand,
      rating,
      isFeatured,
      discount,
      productSize,
      productRAMS,
      productWeight,
      productColor
    } = req.body;

    // 🎨 Parse Colors if sent as JSON string
    if (productColor) {
      try {
        productColor = JSON.parse(productColor);
        console.log("🎨 Parsed Colors:", productColor);
      } catch (err) {
        console.log("⚠️ Invalid productColor JSON:", err.message);
        productColor = [];
      }
    }

    const subCat = await Subcategory.findById(subcategory);
    if (!subCat) {
      return res.status(400).json({ message: "❌ Invalid Subcategory ID!" });
    }

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      oldPrice: oldPrice ? parseFloat(oldPrice) : null,
      catName,
      category,
      subcategory,
      subCatId: subCat._id,
      countInStock: parseInt(countInStock),
      brand,
      rating: rating ? parseFloat(rating) : 0,
      isFeatured: isFeatured === "true",
      discount: discount ? parseFloat(discount) : 0,
      productSize,
      productRAMS,
      productWeight,
      productColor, // ⭐ SAVE COLORS!
      images: imagePaths,
    });

    await product.save();

    res.status(201).json({
      message: "✅ Product created successfully!",
      product,
    });
  } catch (error) {
    console.error("🚨 Error creating product:", error);
    res.status(500).json({ message: "❌ Error creating product", error: error.message });
  }
});

/** ✅ UPDATE a product */
router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    console.log("🟢 Update Request Received for Product ID:", req.params.id);

    const { name, description, catName, category, subcategory, brand, discount, productSize, productRAMS, productWeight } = req.body;
    const price = parseFloat(req.body.price);
    const oldPrice = parseFloat(req.body.oldPrice);
    const countInStock = parseInt(req.body.countInStock);
    const rating = parseFloat(req.body.rating);
    const isFeatured = req.body.isFeatured === "true";

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    let imageUrls = existingProduct.images;
    if (req.files.length > 0) {
      imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
    }

    let updatedFields = {
      name: name ?? existingProduct.name,
      description: description ?? existingProduct.description,
      images: imageUrls,
      price: price ?? existingProduct.price,
      oldPrice: oldPrice ?? existingProduct.oldPrice,
      catName: catName ?? existingProduct.catName,
      category: category ?? existingProduct.category,
      subcategory: subcategory ?? existingProduct.subcategory,
      countInStock: countInStock ?? existingProduct.countInStock,
      brand: brand ?? existingProduct.brand,
      rating: rating ?? existingProduct.rating,
      isFeatured: isFeatured ?? existingProduct.isFeatured,
      discount: discount ? parseFloat(discount) : existingProduct.discount,
      productSize: productSize ?? existingProduct.productSize,
      productRAMS: productRAMS ?? existingProduct.productRAMS,
      productWeight: productWeight ?? existingProduct.productWeight,
    };

    // 🔥 If subcategory is updated, fetch new subCatId
    if (subcategory) {
      const subCat = await Subcategory.findById(subcategory);
      if (!subCat) {
        return res.status(400).json({ message: "Invalid Subcategory ID!" });
      }
      updatedFields.subCatId = subCat.name; // 👈 Update subCatName too
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    console.log("✅ Product Updated Successfully:", updatedProduct);
    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("🚨 Server Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




/** ✅ DELETE a product by ID */




router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete images if they exist
    if (product.images && product.images.length > 0) {
      product.images.forEach((image) => {
        // Ensure correct path without leading slashes
        const imagePath = path.join(__dirname, "../uploads", image.replace(/^\/?uploads\//, ""));

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`✅ Deleted image: ${imagePath}`);
        } else {
          console.warn(`⚠️ Image not found: ${imagePath}`);
        }
      });
    }

    // Delete product from database
    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




module.exports = router;
