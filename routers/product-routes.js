const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFilteredProducts,
} = require("../controllers//products-controller");

// ✅ POST - Create a new product
router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.fields([
    { name: "image", maxCount: 1 },
    { name: "subImages", maxCount: 5 }, // optional
  ]),
  createProduct
);
// ✅ GET - Fetch all products
router.get("/all", getAllProducts);

// ✅ GET - Fetch a single product by ID
router.get("/single/:id", getProductById);

// ✅ PUT - Update a product by ID
router.put(
  "/update/:id",
  authMiddleware,
  uploadMiddleware.fields([
    { name: "image", maxCount: 1 },
    { name: "subImages", maxCount: 5 },
  ]),
  updateProduct
);

// ✅ DELETE - Delete a product by ID
router.delete("/delete/:id", deleteProduct);

router.get("/gender", getFilteredProducts);

module.exports = router;
