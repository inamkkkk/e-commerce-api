const Product = require('../models/Product');
const createHttpError = require('http-errors');

const getAllProducts = async (query = {}) => {
  // TODO: Implement filtering, pagination, sorting based on query params
  const products = await Product.find(query);
  return products;
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw createHttpError(404, 'Product not found.');
  }
  return product;
};

const createProduct = async (productData) => {
  const product = new Product(productData);
  await product.save();
  return product;
};

const updateProduct = async (id, updateData) => {
  const product = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!product) {
    throw createHttpError(404, 'Product not found.');
  }
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw createHttpError(404, 'Product not found.');
  }
  return { message: 'Product deleted successfully.' };
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
