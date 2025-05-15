const express = require("express");
const router = express.Router();
const subCategoryController = require("../controllers/subcategory-controller");

// POST - Create a new sub-category
router.post("/", subCategoryController.createSubCategory);

// GET - Fetch all sub-categories
router.get("/", subCategoryController.getAllSubCategories);

// GET - Fetch a single sub-category by ID
router.get("/:id", subCategoryController.getSubCategoryById);

// PUT - Update a sub-category by ID
router.put("/:id", subCategoryController.updateSubCategory);

// DELETE - Delete a sub-category by ID
router.delete("/:id", subCategoryController.deleteSubCategory);

module.exports = router;
