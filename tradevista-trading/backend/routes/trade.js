const express = require("express");
const router = express.Router();
const Holding = require("../models/Holding");
const User = require("../models/User");
const Order = require("../models/Order");
const auth = require("../middleware/auth");

// @route   POST /trade/buy
// @desc    Place a buy order
// @access  Private
router.post("/buy", auth, async (req, res) => {
  const { symbol, quantity, price } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const cost = price * quantity;

    if (user.balance < cost) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct balance
    user.balance -= cost;
    await user.save();

    // Update or create holding
    let holding = await Holding.findOne({ userId, symbol });

    if (holding) {
      const totalQuantity = holding.quantity + quantity;
      const newAvgPrice = ((holding.avgPrice * holding.quantity) + cost) / totalQuantity;
      
      holding.quantity = totalQuantity;
      holding.avgPrice = newAvgPrice;
    } else {
      holding = new Holding({ userId, symbol, quantity, avgPrice: price });
    }

    await holding.save();

    // Create Order history
    await Order.create({
      userId,
      symbol,
      type: "BUY",
      quantity,
      price
    });

    // Real-Time Emit (If IO is set)
    const io = req.app.get("io");
    if (io) {
      io.emit("portfolioUpdate", userId);
    }

    res.json({ message: "Buy successful", balance: user.balance });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route   POST /trade/sell
// @desc    Place a sell order
// @access  Private
router.post("/sell", auth, async (req, res) => {
  const { symbol, quantity, price } = req.body;
  const userId = req.user.id;

  try {
    const holding = await Holding.findOne({ userId, symbol });
    const user = await User.findById(userId);

    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    // Calculate revenue
    const revenue = price * quantity;
    holding.quantity -= quantity;
    user.balance += revenue;

    // If completely sold, can either delete or keep at 0
    // We'll keep at 0 or remove it
    if (holding.quantity === 0) {
      await Holding.deleteOne({ _id: holding._id });
    } else {
      await holding.save();
    }
    await user.save();

    await Order.create({
      userId,
      symbol,
      type: "SELL",
      quantity,
      price
    });

    // Real-Time Emit (If IO is set)
    const io = req.app.get("io");
    if (io) {
      io.emit("portfolioUpdate", userId);
    }

    res.json({ message: "Sell successful", balance: user.balance });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
