const authService = require('../services/authService');

const signup = async (req, res, next) => {
  try {
    // TODO: Add input validation for signup request body.
    // Ensure required fields like name, email, and password are present and meet basic criteria.
    const { user, token } = await authService.signup(req.body);
    res.status(201).json({ status: 'success', data: { user, token } });
  } catch (error) {
    // TODO: Add specific error handling for Mongoose validation errors or duplicate email errors.
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // TODO: Add input validation for login request body.
    // Ensure email and password are provided.
    const { user, token } = await authService.login(email, password);
    res.status(200).json({ status: 'success', data: { user, token } });
  } catch (error) {
    // TODO: Add specific error handling for incorrect credentials.
    next(error);
  }
};

module.exports = {
  signup,
  login};