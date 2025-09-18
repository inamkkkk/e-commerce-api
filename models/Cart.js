const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    products: [{
        productId: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;