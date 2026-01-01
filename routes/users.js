const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {authenticateToken} = require('../models/middleware/authmiddleware')

// Store JWT secret in a .env file in production
const JWT_SECRET = 'pratuish980';

/**
 * @route POST /api/users/signup
 * @desc Register a new user
 */
router.post('/signup', async (req, res) => {
    try {
      const { name, phone, email, password } = req.body;
  
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // 🔐 Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const user = new User({ name, phone, email, password: hashedPassword });
      await user.save();
  
      res.status(201).json({ success: true, message: 'User registered successfully', user });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
/**
 * @route POST /api/users/signin
 * @desc Login a user and return JWT token
 */
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    // Compare password with hashed one
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    // Generate token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.get('/', authenticateToken, async (req, res) => {
    try {
      // Retrieve the user from the database using the userId from the token
      const user = await User.findById(req.user.userId).select('-password');  // Don't return the password
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  router.get('/count', async (req, res) => {
    try {
      // Count the total number of users in the database
      const userCount = await User.countDocuments();
      res.json({
        success: true,
        count: userCount,
      });
    } catch (error) {
      console.error('Error counting users:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
  // GET: Get user by ID (No authentication)
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id).select('-password'); // Don't return the password
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  router.put('/:id', async (req, res) => {
    const { id } = req.params; // Get user ID from request parameters
    const { name, phone, email, password } = req.body; // Get updated user data from request body
  
    try {
      // Find the user by their ID
      const user = await User.findById(id);
  
      // If the user doesn't exist, send a 404 error
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Update the user fields with the new values
      user.name = name || user.name; // If a new name is provided, update it; else keep the old name
      user.phone = phone || user.phone; // Same logic for phone
      user.email = email || user.email; // Same logic for email
      if (password) {
        // If password is provided, hash it before saving
        const hashedPassword = await bcrypt.hash(password, 10); // Use bcrypt to hash the password
        user.password = hashedPassword;
      }
  
      // Save the updated user back to the database
      await user.save();
  
      // Send a success response with the updated user data
      res.json({
        success: true,
        message: 'User updated successfully',
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
  
  // DELETE: Delete user by ID
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findByIdAndDelete(id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
 
  

module.exports = router;
