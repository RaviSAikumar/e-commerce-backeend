const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add or update item in cart
const addToCart = async (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity } = req.body;

  if (!productId || quantity < 1) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product or quantity" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const index = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );
      if (index >= 0) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.status(200).json({
      success: true,
      message: "Item added/updated",
      cart: populatedCart,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all cart items
const getCartItems = async (req, res) => {
  const userId = req.user.userId;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
      return res.status(200).json({ success: true, cart: { items: [] } });
    }
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();

    const populatedCart = await cart.populate("items.product");
    res
      .status(200)
      .json({ success: true, message: "Item removed", cart: populatedCart });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Update item quantity in cart
const updateCartItemQuantity = async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid quantity" });
  }

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await cart.populate("items.product");
    res.status(200).json({
      success: true,
      message: "Quantity updated",
      cart: populatedCart,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
const clearCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      // If no cart exists, nothing to clear
      return res.status(200).json({
        success: true,
        message: "Cart is already empty",
        cart: { items: [] },
      });
    }
    cart.items = [];
    await cart.save();

    res.status(200).json({ success: true, message: "Cart cleared", cart });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
module.exports = {
  addToCart,
  getCartItems,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
};
