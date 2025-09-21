const Product = require('../models/Product');
const createHttpError = require('http-errors');

const getAllProducts = async (query = {}) => {
  // TODO: Implement filtering, pagination, sorting based on query params

  // Example implementation: Basic filtering and pagination
  const { search, limit = 10, page = 1, sortBy } = query;

  let filter = {};
  if (search) {
    filter = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }]};
  }

  let sortOptions = {};
  if (sortBy) {
    const [field, order] = sortBy.split(':');
    sortOptions[field] = order === 'desc' ? -1 : 1;
  } else {
    // Default sort by creation date if not specified
    sortOptions = { createdAt: -1 };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const products = await Product.find(filter)
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip(skip);

  // TODO: Add total count for pagination metadata if needed
  const totalProducts = await Product.countDocuments(filter);

  return {
    products,
    pagination: {
      currentPage: parseInt(page),
      itemsPerPage: parseInt(limit),
      totalItems: totalProducts,
      totalPages: Math.ceil(totalProducts / parseInt(limit))}
  };
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw createHttpError(404, 'Product not found.');
  }
  return product;
};

const createProduct = async (productData) => {
  // TODO: Add validation for incoming productData before creating
  const { name, description, price, category, stock } = productData;

  if (!name || !description || price === undefined || !category || stock === undefined) {
    throw createHttpError(400, 'Missing required product fields.');
  }

  if (typeof price !== 'number' || price < 0) {
    throw createHttpError(400, 'Price must be a non-negative number.');
  }

  if (typeof stock !== 'number' || stock < 0) {
    throw createHttpError(400, 'Stock must be a non-negative number.');
  }

  const product = new Product(productData);
  await product.save();
  return product;
};

const updateProduct = async (id, updateData) => {
  // TODO: Add validation for updateData
  const { name, description, price, category, stock } = updateData;

  if (price !== undefined && (typeof price !== 'number' || price < 0)) {
    throw createHttpError(400, 'Price must be a non-negative number.');
  }

  if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
    throw createHttpError(400, 'Stock must be a non-negative number.');
  }

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
  deleteProduct};