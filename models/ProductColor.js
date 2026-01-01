const mongoose = require("mongoose");

const productColorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hexCode: {
    type: String,
    required: true,
  }
});

// Virtual ID
productColorSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

productColorSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("ProductColor", productColorSchema);
