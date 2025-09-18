const Cart = require('../models/Cart');

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (cart) {
      res.json(cart);
    } else {
      res.json({products:[]});
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.params.userId });

    if (cart) {
      const itemIndex = cart.products.findIndex(p => p.productId == productId);

      if (itemIndex > -1) {
        let productItem = cart.products[itemIndex];
        productItem.quantity = quantity;
        cart.products[itemIndex] = productItem;
      } else {
        cart.products.push({ productId, quantity });
      }
      cart = await cart.save();
      res.json(cart);
    } else {
      const newCart = await Cart.create({
        userId: req.params.userId,
        products: [{ productId, quantity }]
      });
      res.json(newCart);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
      const { productId, quantity } = req.body;
      const cart = await Cart.findOne({ userId: req.params.userId });

      if (!cart) {
          return res.status(404).json({ message: 'Cart not found' });
      }

      const itemIndex = cart.products.findIndex(p => p.productId == productId);

      if (itemIndex > -1) {
          cart.products[itemIndex].quantity = quantity;
          await cart.save();
          res.json(cart);
      } else {
          return res.status(404).json({ message: 'Product not found in cart' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      { $pull: { products: { productId: req.params.productId } } },
      { new: true }
    );

    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCart, deleteFromCart };