import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];
    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({ message: 'Not authorized, invalid token format' });
    }
    try {
      // Verify token only if it looks like a JWT (3 parts separated by dots)
      if (token.split('.').length !== 3) {
        return res.status(401).json({ message: 'Not authorized, malformed token' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '2025!@#$');
      req.user = { id: decoded.id };
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      // Differentiate JWT errors for clarity
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Not authorized, invalid or malformed token' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired' });
      }
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
