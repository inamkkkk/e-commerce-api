const Cart = require('../models/Cart');
const Product = require('../models/Product');
const createHttpError = require('http-errors');

const getCartByUserId = async (userId) => {
  let cart = await Cart.findOne({ userId }).populate('items.productId', 'name price');
  if (!cart) {
    // Create an empty cart if not found
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
};

const addToCart = async (userId, itemsToAdd) => {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  for (const item of itemsToAdd) {
    const { productId, quantity } = item;
    const product = await Product.findById(productId);
    if (!product) {
      throw createHttpError(404, `Product with ID ${productId} not found.`);
    }
    if (product.stock < quantity) {
      throw createHttpError(400, `Not enough stock for product ${product.name}. Available: ${product.stock}`);
    }

    const existingItemIndex = cart.items.findIndex(
      (cartItem) => cartItem.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item already exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ productId, quantity });
    }
  }

  await cart.save();
  // TODO: Implement more robust stock management (e.g., reserve stock, transactional updates)
  return cart.populate('items.productId', 'name price');
};

const removeFromCart = async (userId, itemsToRemove) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw createHttpError(404, 'Cart not found for this user.');
  }

  for (const item of itemsToRemove) {
    const { productId, quantity } = item;
    const existingItemIndex = cart.items.findIndex(
      (cartItem) => cartItem.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      if (cart.items[existingItemIndex].quantity <= quantity) {
        // Remove item entirely if quantity to remove is greater or equal
        cart.items.splice(existingItemIndex, 1);
      } else {
        // Decrease quantity
        cart.items[existingItemIndex].quantity -= quantity;
      }
    }
  }

  await cart.save();
  return cart.populate('items.productId', 'name price');
};

module.exports = {
  getCartByUserId,
  addToCart,
  removeFromCart,
};
