const Order = require("../models/order");
const Cart = require("../models/Cart");

const placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }
    const newOrder = new Order({
      userId,
      cartItems: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      amount,
      paymentStatus: "pending", // Can be updated after payment integration
    });

    await newOrder.save();

    // Optional: Clear the cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });

    const amount = cart.items.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);
  } catch (e) {
    console.error("order error:", e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { placeOrder };
