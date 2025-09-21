const Joi = require('joi');

const signupSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Name cannot be an empty field.',
    'string.min': 'Name should have a minimum of 3 characters.',
    'string.max': 'Name should have a maximum of 30 characters.',
    'any.required': 'Name is a required field.'}),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email cannot be an empty field.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is a required field.'}),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password cannot be an empty field.',
    'string.min': 'Password should have a minimum of 6 characters.',
    'any.required': 'Password is a required field.'}),
  role: Joi.string().valid('customer', 'admin').default('customer').messages({
    'any.only': 'Role must be either "customer" or "admin".'})});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email cannot be an empty field.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is a required field.'}),
  password: Joi.string().required().messages({
    'string.empty': 'Password cannot be an empty field.',
    'any.required': 'Password is a required field.'})});

module.exports = {
  signupSchema,
  loginSchema};