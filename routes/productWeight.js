const express = require("express");
const ProductWeight  = require("../models/productWeight"); // ✅ Import model

const router = express.Router();

// 📌 1️⃣ Get All Product Weights
router.get("/", async (req, res) => {
    try {
        const productWeightList = await ProductWeight.find();
        if (!productWeightList || productWeightList.length === 0) {
            return res.status(404).json({ success: false, message: "No product weights found" });
        }
        return res.status(200).json(productWeightList);
    } catch (error) {
        console.error("Error fetching product weights:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// 📌 2️⃣ Get a Single Product Weight by ID
router.get("/:id", async (req, res) => {
    try {
        const productWeight = await ProductWeight.findById(req.params.id);
        if (!productWeight) {
            return res.status(404).json({ success: false, message: "Product weight not found" });
        }
        return res.status(200).json(productWeight);
    } catch (error) {
        console.error("Error fetching product weight:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// 📌 3️⃣ Create a New Product Weight
router.post("/create", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }

        const newProductWeight = new ProductWeight({ name });
        const savedProductWeight = await newProductWeight.save();
        return res.status(201).json(savedProductWeight);
    } catch (error) {
        console.error("Error creating product weight:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// 📌 4️⃣ Update an Existing Product Weight
router.put("/:id", async (req, res) => {
    try {
        const updatedProductWeight = await ProductWeight.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true } // Return the updated document
        );

        if (!updatedProductWeight) {
            return res.status(404).json({ success: false, message: "Product weight not found" });
        }

        return res.status(200).json(updatedProductWeight);
    } catch (error) {
        console.error("Error updating product weight:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// 📌 5️⃣ Delete a Product Weight
router.delete("/:id", async (req, res) => {
    try {
        const deletedProductWeight = await ProductWeight.findByIdAndDelete(req.params.id);

        if (!deletedProductWeight) {
            return res.status(404).json({ success: false, message: "Product weight not found" });
        }

        return res.status(200).json({ success: true, message: "Product weight deleted successfully" });
    } catch (error) {
        console.error("Error deleting product weight:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
