const User = require('../models/User');
const { comparePassword, generateToken } = require('../utils/authUtils');
const createHttpError = require('http-errors');

const signup = async (userData) => {
  const { email } = userData;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'User with that email already exists.');
  }

  const user = new User(userData);
  await user.save();
  // user.password is not returned by default due to select: false in schema
  const token = generateToken({ id: user._id, role: user.role });
  return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
};

const login = async (email, password) => {
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
  login,
};
