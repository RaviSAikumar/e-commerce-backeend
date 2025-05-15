const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const {
  addToCart,
  getCartItems,
  removeFromCart,
  updateCartItemQuantity,
} = require("../controllers/cart-controller");

router.post("/addtocart", authMiddleware, addToCart);
router.get("/getitems", authMiddleware, getCartItems);
router.delete("/remove/:productId", authMiddleware, removeFromCart);
router.put("/update/:productId", authMiddleware, updateCartItemQuantity);

module.exports = router;
