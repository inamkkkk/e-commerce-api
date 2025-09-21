const productService = require('../services/productService');

const getAllProducts = async (req, res, next) => {
  try {
    // TODO: Add input validation for query parameters if necessary.
    // For example, validate sorting, filtering, or pagination parameters.
    const products = await productService.getAllProducts(req.query);
    res.status(200).json({ status: 'success', results: products.length, data: { products } });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    // TODO: Add validation for req.params.id to ensure it's a valid format.
    // For example, check if it's a valid ObjectId if using MongoDB.
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      // TODO: Implement a more specific error for "not found" scenarios.
      // This could involve creating a custom error class or using existing ones.
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    res.status(200).json({ status: 'success', data: { product } });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    // TODO: Implement robust input validation for req.body.
    // Ensure all required fields are present and have the correct types/formats.
    // Consider using a validation library like Joi or express-validator.
    const product = await productService.createProduct(req.body);
    res.status(201).json({ status: 'success', data: { product } });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    // TODO: Add validation for req.params.id to ensure it's a valid format.
    // TODO: Implement robust input validation for req.body.
    // Ensure fields to be updated are valid.
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) {
      // TODO: Implement a more specific error for "not found" scenarios.
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    res.status(200).json({ status: 'success', data: { product } });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    // TODO: Add validation for req.params.id to ensure it's a valid format.
    const deletedProduct = await productService.deleteProduct(req.params.id);
    if (!deletedProduct) {
      // TODO: Implement a more specific error for "not found" scenarios.
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    res.status(204).json({ status: 'success', data: null }); // 204 No Content for successful deletion
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct};