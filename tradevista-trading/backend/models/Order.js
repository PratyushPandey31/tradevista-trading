const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: "COMPLETED" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
