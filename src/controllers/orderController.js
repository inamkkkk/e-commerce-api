const orderService = require('../services/orderService');
const cartService = require('../services/cartService'); // To fetch cart items
const createHttpError = require('http-errors');

const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch user's cart items to create the order
    const userCart = await cartService.getCartByUserId(userId);
    if (!userCart || userCart.items.length === 0) {
      throw createHttpError(400, 'Cannot create an order from an empty cart.');
    }

    // Transform cart items into the format expected by createOrder service
    const itemsToOrder = userCart.items.map(item => ({
      productId: item.productId._id, // item.productId is populated here
      quantity: item.quantity,
    }));

    const order = await orderService.createOrder(userId, itemsToOrder);
    res.status(201).json({ status: 'success', data: { order } });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const order = await orderService.getOrderById(req.params.id, userId);
    res.status(200).json({ status: 'success', data: { order } });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await orderService.getOrdersByUserId(userId);
    res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrders,
};
