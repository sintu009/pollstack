const { WebSocketServer, OPEN } = require("ws");

const clients = new Map(); // pollId -> Set of ws connections

function cleanupSocket(pollId, ws) {
  const sockets = clients.get(pollId);
  if (!sockets) return;
  sockets.delete(ws);
  if (sockets.size === 0) clients.delete(pollId);
}

function setupWebSocket(server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  console.log("WebSocket server ready on /ws");

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url || "/", "https://pollstack-zadw.onrender.com");
    const pollId = url.searchParams.get("pollId");

    if (!pollId) {
      ws.close(1008, "pollId required");
      return;
    }

    if (!clients.has(pollId)) clients.set(pollId, new Set());
    clients.get(pollId).add(ws);

    console.log(`WS connected: pollId=${pollId}, total=${clients.get(pollId).size}`);

    try {
      ws.send(JSON.stringify({ type: "CONNECTED", pollId }));
    } catch (err) {
      console.warn("Failed to send WS confirmation:", err.message || err);
    }

    ws.isAlive = true;
    ws.on("pong", () => {
      ws.isAlive = true;
    });

    ws.on("close", () => {
      cleanupSocket(pollId, ws);
      console.log(`WS disconnected: pollId=${pollId}, remaining=${clients.get(pollId)?.size || 0}`);
    });

    ws.on("error", (err) => {
      cleanupSocket(pollId, ws);
      console.warn(`WS error for pollId=${pollId}:`, err.message || err);
    });
  });

  wss.on("error", (err) => {
    console.error("WebSocket server error:", err.message || err);
  });

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) {
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping(() => { });
    });
  }, 30000);

  wss.on("close", () => clearInterval(interval));
}

function broadcast(pollId, data) {
  const sockets = clients.get(pollId);
  if (!sockets || sockets.size === 0) return;

  const msg = JSON.stringify(data);
  for (const ws of sockets) {
    if (ws.readyState !== OPEN) {
      cleanupSocket(pollId, ws);
      continue;
    }
    try {
      ws.send(msg);
    } catch (err) {
      console.warn(`WS broadcast failed for pollId=${pollId}:`, err.message || err);
      cleanupSocket(pollId, ws);
    }
  }

  const count = clients.get(pollId)?.size || 0;
  console.log(`WS broadcast: pollId=${pollId}, clients=${count}, type=${data.type}`);
}

module.exports = { setupWebSocket, broadcast };
