const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { config } = require('../config');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (candidatePassword, hashedPassword) => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

const generateToken = (payload) => {
  // TODO: Consider adding issuer and audience claims to the JWT for enhanced security.
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

const verifyToken = (token) => {
  // TODO: Implement robust error handling for JWT verification failures,
  // such as expired tokens or invalid signatures.
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    // TODO: Log JWT verification errors for security monitoring.
    console.error('JWT Verification Error:', error.message);
    throw new Error('Authentication failed'); // Or a more specific error
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken};