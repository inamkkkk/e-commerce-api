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
      quantity: item.quantity}));

    // TODO: Add validation for itemsToOrder if necessary, e.g., check if quantities are positive.
    // TODO: Consider adding a shipping address or payment details from req.body if applicable.
    // For now, assuming the service handles all necessary validations internally.

    const order = await orderService.createOrder(userId, itemsToOrder);
    res.status(201).json({ status: 'success', data: { order } });
  } catch (error) {
    // TODO: Enhance error handling for specific cases like product unavailability or stock issues.
    // The current generic error handling passes the error to the next middleware.
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    // TODO: Add validation for the orderId parameter, e.g., ensure it's a valid MongoDB ObjectId.
    if (!orderId || typeof orderId !== 'string') {
      return next(createHttpError(400, 'Order ID is required and must be a string.'));
    }
    // Basic check for ObjectId format, though the service will perform a more robust check.
    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(createHttpError(400, 'Invalid Order ID format.'));
    }

    const order = await orderService.getOrderById(orderId, userId);

    // TODO: If the order is not found or does not belong to the user, the service should ideally throw a 404 or 403 error.
    // Assuming orderService.getOrderById handles these cases and throws appropriate errors.
    if (!order) {
        // This case might be redundant if orderService already throws an error for not found.
        // However, it's a safeguard if the service returns null/undefined instead of throwing.
        return next(createHttpError(404, 'Order not found.'));
    }

    res.status(200).json({ status: 'success', data: { order } });
  } catch (error) {
    // TODO: Consider logging the error for debugging purposes.
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // TODO: Add support for query parameters for filtering, sorting, or pagination (e.g., /orders?status=shipped&limit=10&page=1).
    const { status, limit, page } = req.query;
    const queryParams = {
      status: status,
      limit: limit ? parseInt(limit, 10) : undefined,
      page: page ? parseInt(page, 10) : undefined};

    const orders = await orderService.getOrdersByUserId(userId, queryParams);
    res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
  } catch (error) {
    // TODO: Consider logging the error for debugging purposes.
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrders};