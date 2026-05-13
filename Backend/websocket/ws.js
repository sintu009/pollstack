const { WebSocketServer } = require("ws");

const clients = new Map(); // pollId -> Set of ws connections

function setupWebSocket(server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  console.log("WebSocket server ready on /ws");

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url, "http://localhost");
    const pollId = url.searchParams.get("pollId");

    if (!pollId) {
      ws.close(1008, "pollId required");
      return;
    }

    // Add to clients map
    if (!clients.has(pollId)) clients.set(pollId, new Set());
    clients.get(pollId).add(ws);

    console.log(`WS connected: pollId=${pollId}, total=${clients.get(pollId).size}`);

    // Send confirmation
    ws.send(JSON.stringify({ type: "CONNECTED", pollId }));

    // Ping/pong keepalive
    ws.isAlive = true;
    ws.on("pong", () => { ws.isAlive = true; });

    ws.on("close", () => {
      clients.get(pollId)?.delete(ws);
      if (clients.get(pollId)?.size === 0) clients.delete(pollId);
      console.log(`WS disconnected: pollId=${pollId}`);
    });

    ws.on("error", () => {
      clients.get(pollId)?.delete(ws);
    });
  });

  // Keepalive interval - ping every 30s
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on("close", () => clearInterval(interval));
}

function broadcast(pollId, data) {
  const sockets = clients.get(pollId);
  if (!sockets || sockets.size === 0) return;
  const msg = JSON.stringify(data);
  sockets.forEach((ws) => {
    if (ws.readyState === 1) ws.send(msg);
  });
  console.log(`WS broadcast: pollId=${pollId}, clients=${sockets.size}, type=${data.type}`);
}

module.exports = { setupWebSocket, broadcast };
