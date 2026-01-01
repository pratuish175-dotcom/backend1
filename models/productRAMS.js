const mongoose = require("mongoose");

const productRamsSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null
    }
});

// Virtual field for "id"
productRamsSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

// Ensure virtuals are included in JSON output
productRamsSchema.set("toJSON", {
    virtuals: true
});

// Export the Mongoose model
module.exports = mongoose.model("ProductRams", productRamsSchema);
