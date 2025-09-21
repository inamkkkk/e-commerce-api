const cartService = require('../services/cartService');
const createHttpError = require('http-errors');

const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.getCartByUserId(userId);
    res.status(200).json({ status: 'success', data: { cart } });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { items } = req.body; // Expect an array of { productId, quantity }
    const updatedCart = await cartService.addToCart(userId, items);
    res.status(200).json({ status: 'success', data: { cart: updatedCart } });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { items } = req.body; // Expect an array of { productId, quantity }
    const updatedCart = await cartService.removeFromCart(userId, items);
    res.status(200).json({ status: 'success', data: { cart: updatedCart } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
};
