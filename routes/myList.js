const express = require('express');
const router = express.Router();
const MyList = require('../models/myList');

// GET all items
router.get('/', async (req, res) => {
  try {
    const items = await MyList.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items', error });
  }
});

// GET item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await MyList.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error });
  }
});

// POST create new item
router.post('/', async (req, res) => {
  const { productTitle, image, rating, price, productId, userId } = req.body;

  try {
    const newItem = new MyList({ productTitle, image, rating, price, productId, userId });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create item', error });
  }
});



// DELETE item
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await MyList.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error });
  }
});

module.exports = router;
