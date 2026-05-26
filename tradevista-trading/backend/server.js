require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Setup Socket.IO Server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Expose io object globally to access in routes
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Mock Price Data
let mockPrices = {
  AAPL: 150.00,
  MSFT: 310.00,
  GOOGL: 140.00,
  AMZN: 135.00,
  TSLA: 250.00,
  META: 300.00,
  NFLX: 420.00,
  NVDA: 450.00
};

// Simulate Price Changes Every 5 Seconds
setInterval(() => {
  const updatedPrices = {};
  for (const [symbol, price] of Object.entries(mockPrices)) {
    // Random movement between -1% and +1%
    const change = price * (Math.random() * 0.02 - 0.01);
    const newPrice = Math.max(0.01, price + change);
    mockPrices[symbol] = parseFloat(newPrice.toFixed(2));
    updatedPrices[symbol] = mockPrices[symbol];
  }
  io.emit("priceUpdate", updatedPrices);
}, 5000);

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/trade", require("./routes/trade"));
app.use("/user", require("./routes/user"));

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
