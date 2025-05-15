const express = require("express");
const router = express.Router();
const {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategoryById,
  getAllCategories,
} = require("../controllers/category-controller");

// POST - Create a new category
router.post("/create", createCategory);

// GET - Fetch all categories
router.get("/", getAllCategories);

// GET - Fetch a single category by ID
router.get("/:id", getCategoryById);

// PUT - Update a category by ID
router.put("/:id", updateCategory);

// DELETE - Delete a category by ID
router.delete("/:id", deleteCategory);

module.exports = router;
