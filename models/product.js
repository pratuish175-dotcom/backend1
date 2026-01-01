const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    price: { type: Number, required: true },
    oldPrice: { type: Number, required: true },
    catName: { type: String, default: "" },

    subCatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },

    discount: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory", required: true },

    countInStock: { type: Number, required: true },
    brand: { type: String },
    rating: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },

    // Dynamic Attributes
    productSize: { type: String, default: null },
    productRAMS: { type: String, default: null },
    productWeight: { type: String, default: null },

    // 🎨 Color Support
    productColor: [
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductColor",
      required: true
    },
    name: String,
    hexCode: String
  }
],



    dateCreated: { type: Date, default: Date.now },
  }
);

module.exports = mongoose.model("Product", productSchema);
