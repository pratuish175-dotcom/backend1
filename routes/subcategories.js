const express = require("express");
const Subcategory = require("../models/Subcategory");  // Correct import
const router = express.Router();

// Create a subcategory
router.post("/", async (req, res) => {
    try {
      const { name, categoryId } = req.body;
  
      // Ensure categoryId is provided
      if (!categoryId) {
        return res.status(400).json({ error: "categoryId is required" });
      }
  
      // Create and save the subcategory
      const subcategory = new Subcategory({ name, categoryId });
      await subcategory.save();
      res.status(201).json(subcategory);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
// Get all subcategories
// Get all subcategories
router.get("/", async (req, res) => {
    try {
      const subcategories = await Subcategory.find()
        .populate('categoryId', 'name images');  // Populating 'name' and 'images' fields from the category model
      res.json(subcategories);  // Returning populated subcategories
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  // Get subcategory by ID
router.get('/:id', async (req, res) => {
    try {
      const subcategory = await Subcategory.findById(req.params.id)
        .populate('categoryId', 'name images'); // Populate category with name and image
      if (!subcategory) {
        return res.status(404).json({ error: 'Subcategory not found' });
      }
      res.json(subcategory);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  
    
// Update a subcategory by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json(updatedSubcategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a subcategory by ID
router.delete("/:id", async (req, res) => {
  try {
    await Subcategory.findByIdAndDelete(req.params.id);
    res.json({ message: "Subcategory deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
