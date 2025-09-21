const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const createHttpError = require('http-errors');
const mongoose = require('mongoose');

const createOrder = async (userId, itemsFromRequest) => {
  if (!itemsFromRequest || itemsFromRequest.length === 0) {
    throw createHttpError(400, 'Cannot create an order with no items.');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let totalPrice = 0;
    const orderItems = [];
    const productUpdates = [];

    for (const item of itemsFromRequest) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw createHttpError(404, `Product with ID ${item.productId} not found.`);
      }
      if (product.stock < item.quantity) {
        throw createHttpError(400, `Not enough stock for product ${product.name}. Available: ${product.stock}`);
      }

      totalPrice += product.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtOrder: product.price,
      });

      // Prepare stock update
      productUpdates.push({
        updateOne: {
          filter: { _id: item.productId },
          update: { $inc: { stock: -item.quantity } },
        },
      });
    }

    // Atomically update product stocks
    await Product.bulkWrite(productUpdates, { session });

    const order = new Order({
      userId,
      items: orderItems,
      totalPrice,
      status: 'pending', // Initial status
    });

    await order.save({ session });

    // Clear the user's cart after order creation (if coming from cart)
    await Cart.deleteOne({ userId }, { session });

    // Simulate a payment service call
    // TODO: Replace with actual payment gateway integration (e.g., Stripe, PayPal)
    await simulatePayment(order.totalPrice);

    // Update order status to completed after successful payment
    order.status = 'completed';
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getOrderById = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, userId }).populate('items.productId', 'name price');
  if (!order) {
    throw createHttpError(404, 'Order not found or not authorized to view.');
  }
  return order;
};

const getOrdersByUserId = async (userId) => {
  const orders = await Order.find({ userId }).populate('items.productId', 'name price').sort({ createdAt: -1 });
  return orders;
};

// Mock payment service
const simulatePayment = async (amount) => {
  return new Promise(resolve => setTimeout(() => {
    console.log(`Simulating payment of $${amount}. Payment successful.`);
    resolve({ success: true, transactionId: `txn_${Date.now()}` });
  }, 1500));
};

module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUserId,
};
