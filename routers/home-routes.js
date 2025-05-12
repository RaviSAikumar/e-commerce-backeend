const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");

//all routes related to authentication and authorization

router.get("/welcome", authMiddleware, (req, res) => {
  const { userId, username, role } = req.userInfo;
  res.json({
    message: "welcome to home page",
    data: {
      _id: userId,
      username: username,
      role: role,
    },
  });
});

module.exports = router;
