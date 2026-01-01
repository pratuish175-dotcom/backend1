const mongoose = require("mongoose");

const productWeightSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null
    }
});

// Virtual field for "id"
productWeightSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

// Ensure virtuals are included in JSON output
productWeightSchema.set("toJSON", {
    virtuals: true
});

// Export the Mongoose model
module.exports = mongoose.model("ProductWeight", productWeightSchema);
