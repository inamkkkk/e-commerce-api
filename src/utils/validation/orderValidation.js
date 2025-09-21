const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;

const orderItemSchema = Joi.object({
  productId: Joi.string().custom((value, helpers) => {
    if (!ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'ObjectId validation').required(),
  quantity: Joi.number().integer().min(1).required(),
});

const createOrderSchema = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).required(),
  // totalPrice will be calculated by the service, status will be default
  // status and totalPrice are managed by the service logic
});

module.exports = {
  createOrderSchema,
};
