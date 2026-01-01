const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: String,
      productTitle: String,
      price: Number,
      quantity: Number,
      subtotal: Number,
      images: [String],
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String, // "ONLINE" or "COD"
    required: true,
  },
  paymentStatus: {
    type: String,
    default: "Pending", // Paid / Pending / Failed
  },
  razorpayId: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "Order Placed", // Shipping / Delivered / Cancelled
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
