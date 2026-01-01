// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'pratuish980';  // Ensure this is same as the one used for signing the token

// Middleware to check the token
const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract token from Authorization header

  if (!token) {
    return res.status(403).json({ message: 'Access denied, token missing!' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Save decoded information (userId) into the request object
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { authenticateToken };
