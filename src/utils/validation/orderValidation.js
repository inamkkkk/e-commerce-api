const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;

const orderItemSchema = Joi.object({
  productId: Joi.string().custom((value, helpers) => {
    if (!ObjectId.isValid(value)) {
      return helpers.error('any.invalid', { message: 'Invalid product ID format' });
    }
    return value;
  }, 'ObjectId validation').required().messages({
    'any.required': 'Product ID is required',
    'string.empty': 'Product ID cannot be empty'}),
  quantity: Joi.number().integer().min(1).required().messages({
    'any.required': 'Quantity is required',
    'number.base': 'Quantity must be a number',
    'number.integer': 'Quantity must be an integer',
    'number.min': 'Quantity must be at least 1'})});

const createOrderSchema = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).required().messages({
    'any.required': 'Order items are required',
    'array.min': 'Order must contain at least one item'}),
  // totalPrice will be calculated by the service, status will be default
  // status and totalPrice are managed by the service logic
});

module.exports = {
  createOrderSchema};