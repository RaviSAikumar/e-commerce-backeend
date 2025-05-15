const Order = require("../models/order");
const Cart = require("../models/Cart");

const placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { shippingAddress } = req.body;

    // Validate shipping address fields (basic example)
    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.country ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required",
      });
    }

    // Get the cart for this user
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Calculate pricing details (can be improved or moved to helper)
    let totalPrice = 0;
    cart.items.forEach((item) => {
      totalPrice += item.product.price * item.quantity;
    });

    let discount = 0;
    if (totalPrice > 500) discount = totalPrice * 0.2;
    else if (totalPrice > 200) discount = totalPrice * 0.15;
    else if (totalPrice > 150) discount = totalPrice * 0.1;

    let shippingCharges = totalPrice > 150 ? 0 : 10;
    const platformCharges = 10;

    const totalAmount =
      totalPrice - discount + shippingCharges + platformCharges;

    // Create new order
    const newOrder = new Order({
      userId,
      cartItems: cart.items.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      })),
      amount: totalPrice,
      discount,
      shippingCharges,
      platformCharges,
      totalAmount,
      paymentStatus: "pending", // Update after payment success/failure
      shippingAddress,
    });

    await newOrder.save();

    // Clear the cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while placing order",
      error: error.message,
    });
  }
};

module.exports = {
  placeOrder,
};
