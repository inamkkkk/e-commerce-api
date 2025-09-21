const Joi = require('joi');
const { ObjectId } = require('mongoose').Types; // To validate ObjectId strings

const itemSchema = Joi.object({
  productId: Joi.string().custom((value, helpers) => {
    if (!ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'ObjectId validation').required(),
  quantity: Joi.number().integer().min(1).required(),
});

const addToCartSchema = Joi.object({
  items: Joi.array().items(itemSchema).min(1).required(),
});

const removeFromCartSchema = Joi.object({
  items: Joi.array().items(itemSchema).min(1).required(), // Can remove multiple items or specify quantity to remove
});

module.exports = {
  addToCartSchema,
  removeFromCartSchema,
};
