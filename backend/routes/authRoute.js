const router = require("express").Router();
const User = require("../models/userModel");
const { registerUser, loginUser } = require("../controllers/authController");

router.get("/", (req, res) => {
  res.send("<h1>This is from auth</h1>");
});

// Register user
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
