const Product = require("../models/Product"); // ✅ Fixed import

// POST - Create a new product

const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      subCategory,
      brand,
      gender,
    } = req.body;

    if (!req.files || !req.files.image) {
      return res
        .status(400)
        .json({ success: false, message: "Main image is required" });
    }

    // Upload main image
    const mainImageResult = await uploadToCloudinary(req.files.image[0].path);

    // Upload subImages if provided
    let subImagesUrls = [];
    if (req.files.subImages) {
      const uploads = req.files.subImages.map((file) =>
        uploadToCloudinary(file.path)
      );
      const results = await Promise.all(uploads);
      subImagesUrls = results.map((result) => result.url);
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      subCategory,
      brand,
      gender,
      image: mainImageResult.url,
      subImages: subImagesUrls,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET - Fetch all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("subCategory")
      .populate("brand");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET - Fetch a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("subCategory")
      .populate("brand");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT - Update a product by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Upload new main image if provided
    if (req.files?.image) {
      const uploadedImage = await uploadToCloudinary(req.files.image[0].path);
      updatedFields.image = uploadedImage.url;
      // (Optional) Delete old image from cloudinary using product.image's publicId
    }

    // Upload new subImages if provided
    if (req.files?.subImages) {
      const subImageUrls = await Promise.all(
        req.files.subImages.map(async (file) => {
          const uploaded = await uploadToCloudinary(file.path);
          return uploaded.url;
        })
      );
      updatedFields.subImages = subImageUrls;
      // (Optional) delete old subImages
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// DELETE - Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/products/filter?gender=Men&categoryId=YOUR_ID
const getFilteredProducts = async (req, res) => {
  const { gender, categoryId } = req.query;

  const filter = {};
  if (gender) filter.gender = gender;
  if (categoryId) filter.category = categoryId;

  try {
    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("brand", "name");

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch filtered products" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFilteredProducts,
};
