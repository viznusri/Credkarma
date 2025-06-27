const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database to check current role
    const user = await User.findById(decoded.userId).select('role');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    req.userId = decoded.userId;
    req.userRole = user.role;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};