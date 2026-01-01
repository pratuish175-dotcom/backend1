const express = require('express');
const mongoose = require('mongoose');
const { Cart } = require('../models/cart');
const router = express.Router();

// Create/Add to cart
router.post('/add', async (req, res) => {
  try {
    const { productTitle, images, rating, price, quantity, productId, userId } = req.body;

    // Check if all required fields are provided
    if (!productTitle || !images || !rating || !price || !quantity || !productId || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate the productId and userId formats
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid productId or userId format' });
    }

    // Ensure price and quantity are valid numbers
    if (isNaN(price) || price <= 0 || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid price or quantity' });
    }

    // Calculate the subtotal (price * quantity)
    const subtotal = price * quantity;

    // Use ObjectId for MongoDB references
    const productObjectId = new mongoose.Types.ObjectId(productId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Create a new cart item
    const cartItem = new Cart({
      productTitle,
      images,
      rating,
      price,
      quantity,
      subtotal,
      productId: productObjectId,
      userId: userObjectId,
    });

    // Save the cart item to the database
    const savedItem = await cartItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('❌ Error saving cart item:', error);
    res.status(500).json({ message: 'Failed to add to cart', error: error.message });
  }
});

// Get all cart items
router.get('/', async (req, res) => {
  try {
    const items = await Cart.find();
    res.json(items);
  } catch (error) {
    console.error('❌ Failed to fetch cart items:', error);
    res.status(500).json({ message: 'Failed to fetch cart items', error: error.message });
  }
});

// Update quantity of a cart item
router.put('/update/:id', async (req, res) => {
  
  try {
    const { quantity, price } = req.body;

    // Check if quantity and price are provided and valid
    if (isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Invalid quantity or price' });
    }

    // Calculate the new subtotal
    const subtotal = quantity * price;

    // Update the cart item
    const updated = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity, subtotal },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('❌ Failed to update cart item:', error);
    res.status(500).json({ message: 'Failed to update cart item', error: error.message });
  }
});

// Delete cart item
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Cart.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('❌ Failed to delete cart item:', error);
    res.status(500).json({ message: 'Failed to delete cart item', error: error.message });
  }
});

module.exports = router;
