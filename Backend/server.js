require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");
const { setupWebSocket } = require("./websocket/ws");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/polls", require("./routes/pollRoutes"));
app.use("/api/responses", require("./routes/responseRoutes"));
app.use("/api/templates", require("./routes/templateRoutes"));

// WebSocket
setupWebSocket(server);

// Start
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket available at ws://localhost:${PORT}/ws`);
  });
});
