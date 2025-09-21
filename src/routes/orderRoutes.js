const express = require('express');
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middlewares/authMiddleware');
// const validate = require('../middlewares/validationMiddleware');
// const { createOrderSchema } = require('../utils/validation/orderValidation'); // Not directly used as items are from cart

const router = express.Router();

router.use(authenticate); // All order routes require authentication

router.route('/')
  .post(orderController.createOrder) // Items derived from cart, internal validation handles it
  .get(orderController.getOrders); // Get all orders for the authenticated user

router.route('/:id')
  .get(orderController.getOrderById);

module.exports = router;
