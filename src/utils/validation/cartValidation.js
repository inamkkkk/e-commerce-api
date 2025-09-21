const Joi = require('joi');
const { ObjectId } = require('mongoose').Types; // To validate ObjectId strings

const itemSchema = Joi.object({
  productId: Joi.string().custom((value, helpers) => {
    if (!ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'ObjectId validation').required(),
  quantity: Joi.number().integer().min(1).required()});

const addToCartSchema = Joi.object({
  items: Joi.array().items(itemSchema).min(1).required()});

const removeFromCartSchema = Joi.object({
  // We can assume that if an item is in the cart, its productId is valid.
  // However, the quantity to remove should also be validated.
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(), // Assuming productId already exists in the cart
      quantity: Joi.number().integer().min(1).required(), // Quantity to remove
    })
  ).min(1).required()});

module.exports = {
  addToCartSchema,
  removeFromCartSchema};