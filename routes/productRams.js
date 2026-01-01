const express = require("express");
const ProductRams = require("../models/productRAMS"); // ✅ Correct import

const router = express.Router();

// 📌 1️⃣ Get All Product RAMs
router.get("/", async (req, res) => {
    try {
        const productRamList = await ProductRams.find(); // ✅ Corrected Model Name
        if (!productRamList.length) {
            return res.status(404).json({ success: false, message: "No product RAMs found" });
        }
        return res.status(200).json(productRamList);
    } catch (error) {
        console.error("❌ Error fetching product RAMs:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// 📌 2️⃣ Get a Single Product RAM by ID
router.get("/:id", async (req, res) => {
    try {
        const productRam = await ProductRams.findById(req.params.id); // ✅ Corrected Model Name
        if (!productRam) {
            return res.status(404).json({ success: false, message: "Product RAM not found" });
        }
        return res.status(200).json(productRam);
    } catch (error) {
        console.error("❌ Error fetching product RAM:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// 📌 3️⃣ Create a New Product RAM
router.post("/create", async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const newProductRam = new ProductRams({ name }); // ✅ Corrected Model Name
        await newProductRam.save();

        res.status(201).json({ message: "Product RAM created successfully!", data: newProductRam });
    } catch (error) {
        console.error("❌ Error creating Product RAM:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 📌 4️⃣ Update an Existing Product RAM
router.put("/:id", async (req, res) => {
    try {
        const updatedProductRam = await ProductRams.findByIdAndUpdate( // ✅ Corrected Model Name
            req.params.id,
            { name: req.body.name },
            { new: true }
        );

        if (!updatedProductRam) {
            return res.status(404).json({ success: false, message: "Product RAM not found" });
        }

        return res.status(200).json(updatedProductRam);
    } catch (error) {
        console.error("❌ Error updating product RAM:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// 📌 5️⃣ Delete a Product RAM
router.delete("/:id", async (req, res) => {
    try {
        const deletedProductRam = await ProductRams.findByIdAndDelete(req.params.id); // ✅ Corrected Model Name

        if (!deletedProductRam) {
            return res.status(404).json({ success: false, message: "Product RAM not found" });
        }

        return res.status(200).json({ success: true, message: "Product RAM deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting product RAM:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
