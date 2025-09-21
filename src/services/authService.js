const User = require('../models/User');
const { comparePassword, generateToken } = require('../utils/authUtils');
const createHttpError = require('http-errors');

const signup = async (userData) => {
  const { email } = userData;
  // TODO: Validate incoming userData to ensure all required fields are present and of the correct type.
  // For example, check if email is a valid format, password meets complexity requirements, etc.

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'User with that email already exists.');
  }

  const user = new User(userData);
  try {
    await user.save();
  } catch (error) {
    // TODO: Handle specific Mongoose validation errors and provide more granular feedback.
    // For example, if a field is missing or has an invalid format.
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw createHttpError(400, messages.join(', '));
    }
    // Rethrow unexpected errors
    throw error;
  }

  // user.password is not returned by default due to select: false in schema
  const token = generateToken({ id: user._id, role: user.role });
  return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
};

const login = async (email, password) => {
  // TODO: Add input validation for email and password to ensure they are not empty.
  if (!email || !password) {
    throw createHttpError(400, 'Email and password are required.');
  }

  const user = await User.findOne({ email }).select('+password'); // Select password for comparison
  if (!user) {
    throw createHttpError(401, 'Invalid credentials.');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw createHttpError(401, 'Invalid credentials.');
  }

  const token = generateToken({ id: user._id, role: user.role });
  // user.password is now selected, explicitly remove it before returning
  user.password = undefined; // Remove password before returning the user object
  return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
};

module.exports = {
  signup,
  login};