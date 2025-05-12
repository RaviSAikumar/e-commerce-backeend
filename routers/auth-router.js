const express = require("express");
const {
  registerUser,
  loginUser,
  getUsers,
} = require("../controllers/auth-controller");

const router = express.Router();

//all routes related to authentication and authorization

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get", getUsers);

module.exports = router;
