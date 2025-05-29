const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add or update item in cart, adjusting stock accordingly
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

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items in stock`,
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      // Create new cart with this product
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Check if product already in cart
      const index = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );
      if (index >= 0) {
        // Calculate new quantity after addition
        const newQuantity = cart.items[index].quantity + quantity;
        if (product.stock < newQuantity) {
          return res.status(400).json({
            success: false,
            message: `Only ${product.stock} items in stock`,
          });
        }
        cart.items[index].quantity = newQuantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    // Decrease product stock
    product.stock -= quantity;

    // Save both product and cart
    await product.save();
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

// Get all cart items for the logged-in user
const getCartItems = async (req, res) => {
  const userId = req.user.userId;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        cart: { items: [] },
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update cart item quantity with stock adjustment
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
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Calculate difference in quantity to adjust stock accordingly
    const quantityDiff = quantity - item.quantity;

    if (quantityDiff > 0) {
      // Need to decrease product stock by quantityDiff
      if (product.stock < quantityDiff) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items in stock`,
        });
      }
      product.stock -= quantityDiff;
    } else if (quantityDiff < 0) {
      // User reduced quantity, increase product stock
      product.stock += -quantityDiff;
    }
    // If quantityDiff == 0, no change in stock

    item.quantity = quantity;

    await product.save();
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

// Remove item from cart, restore product stock
const removeFromCart = async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    // Restore product stock by the quantity in the cart
    const product = await Product.findById(productId);
    if (product) {
      product.stock += item.quantity;
      await product.save();
    }

    // Remove item from cart
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

// Clear entire cart and restore product stock
const clearCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is already empty",
        cart: { items: [] },
      });
    }

    // Restore stock for all items
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
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
