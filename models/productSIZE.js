const mongoose = require("mongoose");

const productRamsSizeSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null
    }
});

// Virtual field for "id"
productRamsSizeSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

// Ensure virtuals are included in JSON output
productRamsSizeSchema.set("toJSON", {
    virtuals: true
});

// Export the Mongoose model
module.exports = mongoose.model("ProductRamsSize", productRamsSizeSchema);
