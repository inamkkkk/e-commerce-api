const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']},
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']},
  priceAtOrder: { // Store price at the time of order
    type: Number,
    required: [true, 'Price at order is required'],
    min: [0, 'Price at order cannot be negative']}
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']},
  items: {
    type: [OrderItemSchema],
    required: [true, 'Order must contain at least one item'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Order must have at least one item.'
    }
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']},
  status: {
    type: String,
    enum: {
      values: ['pending', 'completed', 'cancelled'],
      message: '{VALUE} is not a valid order status'
    },
    default: 'pending'},
  createdAt: {
    type: Date,
    default: Date.now}});

// TODO: Add any necessary pre/post hooks or static methods to the OrderSchema here.
// For example, a pre-save hook to calculate totalPrice if not provided or to validate item prices.

module.exports = mongoose.model('Order', OrderSchema);