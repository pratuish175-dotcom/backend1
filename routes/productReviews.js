const ProductReview = require('../models/productReviews'); // Correct the model import (singular, capitalized)
const express = require('express');
const router = express.Router();

// GET route to fetch all reviews (optionally by productId)
router.get('/', async (req, res) => {
    let reviews = [];
    try {
        if (req.query.productId) {
            reviews = await ProductReview.find({ productId: req.query.productId }); // Use the correct model name here
        } else {
            reviews = await ProductReview.find();
        }

        if (reviews.length === 0) {
            return res.status(404).json({ success: false, message: 'No reviews found' });
        }

        return res.status(200).json(reviews);
    } catch (error) {
        console.error(error);  // Log the error for debugging purposes
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// GET route to fetch a specific review by ID
router.get('/:id', async (req, res) => {
    try {
        const review = await ProductReview.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        return res.status(200).json(review);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// POST route to add a new review
router.post('/add', async (req, res) => {
    const { productId, customerName, customerId, review, customerRating } = req.body;

    // Ensure the required fields are provided
    if (!productId || !customerName || !customerId || !review || !customerRating) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Ensure the review is not empty or just whitespace
    if (!review.trim()) {
        return res.status(400).json({ success: false, message: 'Review content cannot be empty' });
    }

    try {
        // Create a new review
        const newReview = new ProductReview({
            productId,
            customerName,
            customerId,
            review,
            customerRating
        });

        // Save the new review to the database
        await newReview.save();

        // Return a successful response with the new review data
        return res.status(201).json({
            success: true,
            message: 'Review added successfully',
            review: newReview
        });
    } catch (error) {
        // Log any server errors and return an internal error response
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// PUT route to update an existing review by ID
router.put('/:id', async (req, res) => {
    try {
        // Use the correct model name here (ProductReview)
        const updatedReview = await ProductReview.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!updatedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.status(200).json(updatedReview);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(400).json({ error: 'Failed to update review' });
    }
});

// DELETE route to delete a review by ID
router.delete('/:id', async (req, res) => {
    try {
        // Use the correct model name here (ProductReview)
        const review = await ProductReview.findByIdAndDelete(req.params.id);

        // Check if the review exists
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

module.exports = router;
