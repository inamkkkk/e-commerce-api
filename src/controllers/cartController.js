const cartService = require('../services/cartService');
const createHttpError = require('http-errors');

const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.getCartByUserId(userId);
    if (!cart) {
      // If no cart is found for the user, return an empty cart or appropriate response
      return res.status(200).json({ status: 'success', data: { cart: { userId: userId, items: [], totalAmount: 0 } } });
    }
    res.status(200).json({ status: 'success', data: { cart } });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { items } = req.body; // Expect an array of { productId, quantity }

    // Basic validation for items array and its elements
    if (!Array.isArray(items) || items.length === 0) {
      return next(createHttpError(400, 'Invalid items format. Please provide an array of items.'));
    }

    for (const item of items) {
      if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return next(createHttpError(400, 'Each item must have a valid productId and a positive quantity.'));
      }
    }

    const updatedCart = await cartService.addToCart(userId, items);
    res.status(200).json({ status: 'success', data: { cart: updatedCart } });
  } catch (error) {
    // Specific error handling for service layer issues can be added here if needed
    // For example, if a product is not found, cartService might throw a specific error
    if (error.message.includes('Product not found')) {
      return next(createHttpError(404, error.message));
    }
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { items } = req.body; // Expect an array of { productId, quantity }

    // Basic validation for items array and its elements
    if (!Array.isArray(items) || items.length === 0) {
      return next(createHttpError(400, 'Invalid items format. Please provide an array of items to remove.'));
    }

    for (const item of items) {
      if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return next(createHttpError(400, 'Each item to remove must have a valid productId and a positive quantity.'));
      }
    }

    const updatedCart = await cartService.removeFromCart(userId, items);
    res.status(200).json({ status: 'success', data: { cart: updatedCart } });
  } catch (error) {
    // Specific error handling for service layer issues can be added here if needed
    if (error.message.includes('Item not found in cart')) {
      return next(createHttpError(404, error.message));
    }
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart};