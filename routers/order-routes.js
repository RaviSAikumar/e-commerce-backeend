const express = require("express");
const router = express.Router();

const { placeOrder } = require("../controllers/order-controller");
const authMiddleware = require("../middleware/auth-middleware");

router.post("/placeorder", authMiddleware, placeOrder);

module.exports = router;
