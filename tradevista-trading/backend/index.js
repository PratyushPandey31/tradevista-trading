require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const HoldingsModel = require("./model/HoldingsModel");
const PositionsModel = require("./model/PositionsModel");
const OrdersModel = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());


// ✅ Fetch Holdings
app.get("/allHoldings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (err) {
    res.status(500).json({ error: "Error fetching holdings!" });
  }
});

// ✅ Fetch Positions
app.get("/allPositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (err) {
    res.status(500).json({ error: "Error fetching positions!" });
  }
});


// 🔥 ✅ FIXED ORDER API (MAIN CHANGE)
app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    // 1. Save Order
    const newOrder = new OrdersModel({
      name,
      qty,
      price,
      mode,
    });

    await newOrder.save();

    // 2. 🔥 Update Holdings (IMPORTANT FIX)
    if (mode === "BUY") {
      let stock = await HoldingsModel.findOne({ name });

      if (stock) {
        const totalQty = stock.qty + qty;

        const avgPrice =
          (stock.avg * stock.qty + price * qty) / totalQty;

        stock.qty = totalQty;
        stock.avg = avgPrice;

        await stock.save();
      } else {
        await HoldingsModel.create({
          name,
          qty,
          avg: price,
        });
      }
    }

    res.json({
      success: true,
      message: "Order placed & holdings updated",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: "Error placing order!",
    });
  }
});


// ✅ MongoDB Connection
mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected successfully!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });