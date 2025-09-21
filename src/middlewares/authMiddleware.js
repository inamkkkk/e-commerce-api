const createHttpError = require('http-errors');
const { verifyToken } = require('../utils/authUtils');
const User = require('../models/User'); // Required to attach user to req

const authenticate = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return next(createHttpError(401, 'No token provided.'));
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length); // Remove 'Bearer ' prefix
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password'); // Exclude password
    if (!user) {
      return next(createHttpError(401, 'Invalid token: User not found.'));
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(createHttpError(401, 'Token expired.'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(createHttpError(401, 'Invalid token.'));
    }
    next(createHttpError(500, 'Authentication failed.'));
  }
};

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(createHttpError(401, 'User not authenticated or role not found.'));
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return next(createHttpError(403, 'Forbidden: You do not have permission to access this resource.'));
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
