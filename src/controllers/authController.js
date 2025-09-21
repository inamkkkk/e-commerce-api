const authService = require('../services/authService');

const signup = async (req, res, next) => {
  try {
    const { user, token } = await authService.signup(req.body);
    res.status(201).json({ status: 'success', data: { user, token } });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.status(200).json({ status: 'success', data: { user, token } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
};
