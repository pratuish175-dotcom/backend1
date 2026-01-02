const express = require('express');
const mongoose = require('mongoose');
const { Cart } = require('../models/cart');
const router = express.Router();

// Create/Add to cart
router.post('/add', async (req, res) => {
  try {
    console.log("🛒 Incoming cart body:", req.body);

    const { productTitle, images, rating, price, quantity, productId, userId } = req.body;

    if (
      !productTitle ||
      !Array.isArray(images) || images.length === 0 ||
      price == null ||
      quantity == null ||
      !productId ||
      !userId
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid productId or userId" });
    }

    const cartItem = new Cart({
      productTitle,
      images,
      rating: rating ?? 0,
      price,
      quantity,
      subtotal: price * quantity,
      productId,
      userId
    });

    const savedItem = await cartItem.save();
    res.status(201).json(savedItem);

  } catch (error) {
    console.error("❌ Cart error:", error);
    res.status(500).json({ message: "Failed to add to cart" });
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
