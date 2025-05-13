require("dotenv").config();
const cors = require("cors");
const connectToDB = require("./database/db");
const express = require("express");
const authRoutes = require("./routers/auth-router");
const homeRoutes = require("./routers/home-routes");
const adminRoutes = require("./routers/admin-routes");
const uploadImageRouters = require("./routers/image-routes");
connectToDB();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://shopping-eight-alpha.vercel.app",
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
