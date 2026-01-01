const mongoose = require("mongoose");


const SubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",  // Assuming you have a Category model
    required: true,   // Ensure categoryId is required when creating a subcategory
  },
});

module.exports = mongoose.model("Subcategory", SubcategorySchema);
