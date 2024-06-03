const jwt = require('jsonwebtoken');
require('dotenv').config();
 
module.exports = function jwtVerification(req, res, next) {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Check if not token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, "thissisme");
    
    // Add user from payload
    req.user = decoded;
  
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
