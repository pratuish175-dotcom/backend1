// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/ // Example: Indian 10-digit number format
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/, // Basic email validation
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Or use a stronger password policy
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
userSchema.set('toJSON',{
    virtuals:true,
});
exports.User =mongoose.model('User',userSchema);
exports.userSchema =userSchema;
