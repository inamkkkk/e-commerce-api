const express = require('express');
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { addToCartSchema, removeFromCartSchema } = require('../utils/validation/cartValidation');

const router = express.Router();

router.use(authenticate); // All cart routes require authentication

router.get('/', cartController.getCart);
router.post('/add', validate(addToCartSchema), cartController.addToCart);
router.post('/remove', validate(removeFromCartSchema), cartController.removeFromCart);

module.exports = router;
