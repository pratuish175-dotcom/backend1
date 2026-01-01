const express = require("express");
const Category = require("../models/category");
const cloudinary = require("../utils/cloudinary");
const multer = require("multer");


const router = express.Router();

// ✅ Use Multer with memoryStorage to avoid storing files locally
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔄 Helper function: Convert buffer to base64
const bufferToBase64 = (buffer) => `data:image/jpeg;base64,${buffer.toString("base64")}`;

// ✅ Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Delete category by ID
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Create category with Cloudinary image upload
router.post("/create", upload.array("images", 5), async (req, res) => {
  try {
    const { name, color, imageUrl } = req.body;

    if (!name || !color) {
      return res.status(400).json({ message: "Name and color are required" });
    }

    let uploadedImages = [];

    if (req.files && req.files.length > 0) {
      // ✅ Upload images from form-data to Cloudinary
      uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          const base64Image = bufferToBase64(file.buffer);
          const result = await cloudinary.uploader.upload(base64Image, { folder: "categories" });
          return result.secure_url;
        })
      );
    } else if (imageUrl) {
      // ✅ If imageUrl is provided, directly use it (no need to upload again)
      uploadedImages.push(imageUrl);
    } else {
      return res.status(400).json({ message: "Either an image file or imageUrl is required" });
    }

    // ✅ Save category in MongoDB
    const newCategory = new Category({
      name,
      images: uploadedImages,
      color,
    });

    await newCategory.save();
    res.status(201).json({ message: "Category created successfully", category: newCategory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Update category by ID
router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    const { name, color, imageUrl } = req.body;
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    let uploadedImages = category.images; // Keep old images if no new images uploaded

    if (req.files && req.files.length > 0) {
      // ✅ Upload new images to Cloudinary
      uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          const base64Image = bufferToBase64(file.buffer);
          const result = await cloudinary.uploader.upload(base64Image, { folder: "categories" });
          return result.secure_url;
        })
      );
    } else if (imageUrl) {
      // ✅ If new imageUrl is provided, use it instead
      uploadedImages = [imageUrl];
    }

    // ✅ Update category
    category.name = name || category.name;
    category.color = color || category.color;
    category.images = uploadedImages;

    await category.save();

    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




module.exports = router;
