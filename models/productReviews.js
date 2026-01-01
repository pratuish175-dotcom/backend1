const mongoose = require('mongoose');

const productReviewSchema = new mongoose.Schema({
  productId: { type: String, required: true }, // <-- Change ObjectId to String
  customerName: { type: String, required: true },
  customerId: { type: String, required: true },
  review: { type: String, required: true },
  customerRating: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('ProductReview', productReviewSchema);
