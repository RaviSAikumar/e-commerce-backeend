require("dotenv").config();
const cors = require("cors");
const connectToDB = require("./database/db");
const express = require("express");
const authRoutes = require("./routers/auth-router");
const homeRoutes = require("./routers/home-routes");
const adminRoutes = require("./routers/admin-routes");
const uploadImageRouters = require("./routers/image-routes");
const productRoutes = require("./routers/product-routes");
const categoryRoutes = require("./routers/category-routes");
const subCategoryRoutes = require("./routers/subcategory-routes");
const brandRoutes = require("./routers/brand-routes");
const cartRoutes = require("./routers/cart-routes");
const orderRoutes = require("./routers/order-routes");
connectToDB();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "shopping-ravi-sai-kumars-projects.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("home page");
});

app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", uploadImageRouters);

// Add the new routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/brands", brandRoutes);

//add to cart
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
