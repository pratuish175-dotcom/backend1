const express = require("express");
const router = express.Router();
const ProductColor = require("../models/ProductColor");

// Create Color
router.post("/create", async (req, res) => {
  try {
    const newColor = await ProductColor.create(req.body);
    res.status(201).json({ success: true, message: "Color added!", data: newColor });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get Colors
router.get("/", async (req, res) => {
  try {
    const colors = await ProductColor.find();
    res.json(colors);
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Delete Color
router.delete("/:id", async (req, res) => {
  try {
    await ProductColor.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
