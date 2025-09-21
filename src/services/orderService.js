const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const createHttpError = require('http-errors');
const mongoose = require('mongoose');
const axios = require('axios'); // Assuming you might use axios for external API calls

// --- Payment Gateway Configuration ---
// TODO: Replace with actual environment variables for API keys and endpoints.
const PAYMENT_GATEWAY_API_URL = process.env.PAYMENT_GATEWAY_API_URL || 'https://api.example-payment.com/v1/charge';
const PAYMENT_GATEWAY_API_KEY = process.env.PAYMENT_GATEWAY_API_KEY || 'sk_test_xxxxxxxxxxxxxxxxxxxx'; // Replace with your actual test key

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
      // Validate item structure
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        throw createHttpError(400, 'Invalid item format. Each item must have a productId and a positive quantity.');
      }

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
        priceAtOrder: product.price, // Store price at the time of order
      });

      // Prepare stock update
      productUpdates.push({
        updateOne: {
          filter: { _id: item.productId },
          update: { $inc: { stock: -item.quantity } }}});
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
    // Ensure Cart model has a userId field to match this query.
    await Cart.deleteOne({ userId }, { session });

    // TODO: Integrate with a real payment gateway.
    // The 'simulatePayment' function is a placeholder. Replace it with actual API calls.
    // Example using a hypothetical payment gateway API:
    let paymentResult;
    try {
      paymentResult = await processPayment(order._id, order.totalPrice, userId); // Pass order details to payment processor
      // If payment fails, the processPayment function should throw an error.
    } catch (paymentError) {
      // If payment fails, we need to revert stock changes and potentially create a failed order.
      // For simplicity here, we'll just abort the transaction and re-throw.
      // A more robust system might log the payment failure and update the order status to 'payment_failed'.
      throw createHttpError(500, `Payment processing failed: ${paymentError.message}`);
    }


    // Update order status to completed after successful payment
    order.status = 'completed';
    order.paymentResult = { // Store payment details
      provider: 'ExamplePaymentGateway', // Or actual provider name
      transactionId: paymentResult.transactionId,
      status: 'success'
    };
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    // If an error occurs before commit, abort the transaction
    await session.abortTransaction();
    session.endSession();
    // Re-throw the error to be handled by the caller
    throw error;
  }
};

// --- Payment Gateway Integration ---
// TODO: Replace this with actual integration to a payment gateway (e.g., Stripe, PayPal).
// This function will make an HTTP request to the payment provider's API.
const processPayment = async (orderId, amount, userId) => {
  // In a real scenario, you would pass more payment details (e.g., payment method token)
  // For demonstration, we'll use a simplified mock.

  console.log(`Attempting to process payment for Order ID: ${orderId}, Amount: $${amount}`);

  try {
    // Example using axios to call a hypothetical payment API
    const response = await axios.post(PAYMENT_GATEWAY_API_URL, {
      amount: amount,
      currency: 'usd', // Assuming USD
      orderId: orderId,
      description: `Order ${orderId} from User ${userId}`,
      // Add customer details, payment method token, etc. as required by the gateway
    }, {
      headers: {
        'Authorization': `Bearer ${PAYMENT_GATEWAY_API_KEY}`,
        'Content-Type': 'application/json'}});

    // TODO: Parse the response from the payment gateway to confirm success or failure.
    // This parsing logic depends heavily on the specific payment gateway's API.
    if (response.data && response.data.status === 'succeeded') {
      console.log(`Payment successful for Order ID: ${orderId}. Transaction ID: ${response.data.transactionId}`);
      return {
        success: true,
        transactionId: response.data.transactionId};
    } else {
      // Handle cases where the payment gateway returns a non-success status but no error
      console.error(`Payment failed for Order ID: ${orderId}. Gateway response:`, response.data);
      throw new Error(response.data.errorMessage || 'Payment declined by gateway.');
    }
  } catch (error) {
    console.error(`Error during payment processing for Order ID: ${orderId}`, error.response ? error.response.data : error.message);
    // Re-throw a more specific error if possible, or a generic one.
    throw new Error(`Payment Gateway Error: ${error.message}`);
  }
};


const getOrderById = async (orderId, userId) => {
  // Ensure the order belongs to the requesting user.
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

// Removed the mock 'simulatePayment' as it's replaced by 'processPayment'.

module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUserId};