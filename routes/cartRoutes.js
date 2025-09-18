const express = require('express');
const { getCart, addToCart, updateCart, deleteFromCart } = require('../controllers/cartController');
const router = express.Router();

router.get('/:userId', getCart);
router.post('/:userId', addToCart);
router.put('/:userId', updateCart);
router.delete('/:userId/:productId', deleteFromCart);

module.exports = router;