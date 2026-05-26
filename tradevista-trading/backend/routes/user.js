const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Holding = require("../models/Holding");
const Order = require("../models/Order");
const Watchlist = require("../models/Watchlist");

// @route   GET /user/profile
// @desc    Get user data
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route   GET /user/holdings
// @desc    Get user holdings
// @access  Private
router.get("/holdings", auth, async (req, res) => {
  try {
    const holdings = await Holding.find({ userId: req.user.id });
    res.json(holdings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route   GET /user/orders
// @desc    Get user orders
// @access  Private
router.get("/orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route   GET /user/watchlist
// @desc    Get user watchlist
// @access  Private
router.get("/watchlist", auth, async (req, res) => {
  try {
    let watchlist = await Watchlist.findOne({ userId: req.user.id });
    if (!watchlist) {
      watchlist = new Watchlist({ userId: req.user.id, symbols: [] });
      await watchlist.save();
    }
    res.json(watchlist.symbols);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route   POST /user/watchlist
// @desc    Add/Remove symbol from watchlist
// @access  Private
router.post("/watchlist", auth, async (req, res) => {
  const { symbol, action } = req.body; // action: 'add' or 'remove'
  try {
    let watchlist = await Watchlist.findOne({ userId: req.user.id });
    if (!watchlist) {
      watchlist = new Watchlist({ userId: req.user.id, symbols: [] });
    }

    if (action === "add" && !watchlist.symbols.includes(symbol)) {
      watchlist.symbols.push(symbol);
    } else if (action === "remove") {
      watchlist.symbols = watchlist.symbols.filter(s => s !== symbol);
    }

    await watchlist.save();
    res.json(watchlist.symbols);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
