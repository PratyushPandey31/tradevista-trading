const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// @route   POST /auth/register
// @desc    Register user
// @access  Public
router.post("/register", async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    let usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const payload = { id: user.id };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || "sekret_jwt_key_123",
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: { 
            id: user.id, 
            name: user.name,
            username: user.username,
            email: user.email, 
            balance: user.balance 
          } 
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST /auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { id: user.id };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || "sekret_jwt_key_123",
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: { 
            id: user.id, 
            name: user.name,
            username: user.username,
            email: user.email, 
            balance: user.balance 
          } 
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
