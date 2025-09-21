const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Product name must be a string.',
    'string.empty': 'Product name cannot be empty.',
    'string.min': 'Product name must be at least 3 characters long.',
    'string.max': 'Product name must be at most 100 characters long.',
    'any.required': 'Product name is required.'}),
  description: Joi.string().min(10).required().messages({
    'string.base': 'Product description must be a string.',
    'string.empty': 'Product description cannot be empty.',
    'string.min': 'Product description must be at least 10 characters long.',
    'any.required': 'Product description is required.'}),
  price: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Product price must be a number.',
    'number.positive': 'Product price must be a positive number.',
    'number.precision': 'Product price must have at most 2 decimal places.',
    'any.required': 'Product price is required.'}),
  stock: Joi.number().integer().min(0).required().messages({
    'number.base': 'Product stock must be a number.',
    'number.integer': 'Product stock must be an integer.',
    'number.min': 'Product stock cannot be negative.',
    'any.required': 'Product stock is required.'})});

const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(100).messages({
    'string.base': 'Product name must be a string.',
    'string.empty': 'Product name cannot be empty.',
    'string.min': 'Product name must be at least 3 characters long.',
    'string.max': 'Product name must be at most 100 characters long.'}),
  description: Joi.string().min(10).messages({
    'string.base': 'Product description must be a string.',
    'string.empty': 'Product description cannot be empty.',
    'string.min': 'Product description must be at least 10 characters long.'}),
  price: Joi.number().positive().precision(2).messages({
    'number.base': 'Product price must be a number.',
    'number.positive': 'Product price must be a positive number.',
    'number.precision': 'Product price must have at most 2 decimal places.'}),
  stock: Joi.number().integer().min(0).messages({
    'number.base': 'Product stock must be a number.',
    'number.integer': 'Product stock must be an integer.',
    'number.min': 'Product stock cannot be negative.'})}).min(1).messages({
  'object.min': 'At least one field must be provided for update.'}); // At least one field must be provided for update

module.exports = {
  createProductSchema,
  updateProductSchema};