const cloudinary = require("cloudinary").v2;
require("dotenv").config(); // Make sure this is here

cloudinary.config({
  cloud_name: "dyjo33pmn",
  api_key: "676697442336417",
  api_secret: "Gr5NElQEVOSkAMNzDi1iDr9txBg",
});

module.exports = cloudinary;
