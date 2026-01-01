const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  productTitle: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  // Use ObjectId for references to other models (Product and User)
  productId: {
    type: mongoose.Schema.Types.ObjectId,  // Updated to ObjectId
    ref: 'Product',  // Reference to the Product model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Updated to ObjectId
    ref: 'User',  // Reference to the User model
    required: true,
  },
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt
});

// Add virtual 'id' field
cartSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Configure to include virtuals in the JSON representation
cartSchema.set('toJSON', {
  virtuals: true,
});

module.exports = {
  Cart: mongoose.model('Cart', cartSchema),
  cartSchema,
};
