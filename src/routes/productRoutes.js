const express = require('express');
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { createProductSchema, updateProductSchema } = require('../utils/validation/productValidation');

const router = express.Router();

router.route('/')
  .get(productController.getAllProducts)
  .post(authenticate, authorize(['admin']), validate(createProductSchema), productController.createProduct);

router.route('/:id')
  .get(productController.getProductById)
  .patch(authenticate, authorize(['admin']), validate(updateProductSchema), productController.updateProduct)
  .delete(authenticate, authorize(['admin']), productController.deleteProduct);

module.exports = router;