const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).required(),
  price: Joi.number().positive().precision(2).required(),
  stock: Joi.number().integer().min(0).required(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().min(10),
  price: Joi.number().positive().precision(2),
  stock: Joi.number().integer().min(0),
}).min(1); // At least one field must be provided for update

module.exports = {
  createProductSchema,
  updateProductSchema,
};
