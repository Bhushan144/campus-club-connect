// middlewares/authMiddleware.js

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

/**
 * @desc    Protect routes by checking for a valid JWT in cookies
 * @access  Private
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read the JWT from the 'jwt' httpOnly cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID embedded in the token
      // Attach the user object to the request, excluding the password
      req.user = await User.findById(decoded.userId).select('-password');
      
      // Proceed to the next middleware or the route handler
      next();
    } catch (error) {
      console.error(error);
      res.status(401); // Unauthorized
      throw new Error('Not authorized, token failed verification');
    }
  } else {
    res.status(401); // Unauthorized
    throw new Error('Not authorized, no token provided');
  }
});

/**
 * @desc    Authorize user based on roles
 * @param   {...string} roles - A list of roles that are allowed to access the route
 * @access  Private
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role (from the 'protect' middleware) is in the allowed roles list
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); // Forbidden
      throw new Error(
        `User role '${req.user.role}' is not authorized to access this route`
      );
    }
    next();
  };
};

export { protect, authorize };