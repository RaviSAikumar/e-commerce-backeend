const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brand-controller");

// POST - Create a new brand
router.post("/create", brandController.createBrand);

// GET - Fetch all brands
router.get("/", brandController.getAllBrands);

// GET - Fetch a single brand by ID
router.get("/:id", brandController.getBrandById);

// PUT - Update a brand by ID
router.put("/:id", brandController.updateBrand);

// DELETE - Delete a brand by ID
router.delete("/:id", brandController.deleteBrand);

module.exports = router;
