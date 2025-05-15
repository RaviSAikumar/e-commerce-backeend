const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },

    image: { type: String }, // Main image URL
    subImages: [{ type: String }], // Array of image URLs

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },

    gender: { type: String, enum: ["Men", "Women"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
