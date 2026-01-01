const mongoose = require('mongoose');

const myListSchema = new mongoose.Schema({
  productTitle: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  price: {
    type: Number,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('MyList', myListSchema);
