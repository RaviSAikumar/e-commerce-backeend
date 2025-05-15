const { SubCategory } = require("../models/SubCategory");

exports.createSubCategory = async (req, res) => {
  try {
    const subCategory = new SubCategory(req.body);
    const savedSubCategory = await subCategory.save();
    res.status(201).json(savedSubCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("category");
    res.json(subCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate(
      "category"
    );
    if (!subCategory)
      return res.status(404).json({ message: "SubCategory not found" });
    res.json(subCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedSubCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);
    res.json({ message: "SubCategory deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
