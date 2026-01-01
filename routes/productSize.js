const express = require("express");
const ProductSize = require("../models/productSIZE")// ✅ Import the ProductSize model

const router = express.Router();

// 📌 1️⃣ Get All Product Sizes
router.get("/", async (req, res) => {
    try {
        const productSizeList = await ProductSize.find();
        if (!productSizeList.length) {
            return res.status(404).json({ success: false, message: "No product sizes found" });
        }
        return res.status(200).json(productSizeList);
    } catch (error) {
        console.error("❌ Error fetching product sizes:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// 📌 2️⃣ Get a Single Product Size by ID
router.get("/:id", async (req, res) => {
    try {
        const productSize = await ProductSize.findById(req.params.id);
        if (!productSize) {
            return res.status(404).json({ success: false, message: "Product size not found" });
        }
        return res.status(200).json(productSize);
    } catch (error) {
        console.error("❌ Error fetching product size:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// 📌 3️⃣ Create a New Product Size
router.post("/create", async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const newProductSize = new ProductSize({ name });
        await newProductSize.save();

        res.status(201).json({ message: "Product size created successfully!", data: newProductSize });
    } catch (error) {
        console.error("❌ Error creating product size:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 📌 4️⃣ Update an Existing Product Size
router.put("/:id", async (req, res) => {
    try {
        const updatedProductSize = await ProductSize.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true }
        );

        if (!updatedProductSize) {
            return res.status(404).json({ success: false, message: "Product size not found" });
        }

        return res.status(200).json(updatedProductSize);
    } catch (error) {
        console.error("❌ Error updating product size:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// 📌 5️⃣ Delete a Product Size
router.delete("/:id", async (req, res) => {
    try {
        const deletedProductSize = await ProductSize.findByIdAndDelete(req.params.id);

        if (!deletedProductSize) {
            return res.status(404).json({ success: false, message: "Product size not found" });
        }

        return res.status(200).json({ success: true, message: "Product size deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting product size:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
