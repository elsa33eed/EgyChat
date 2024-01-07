const express = require("express");
const { createServer } = require("node:http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/HTML/egychat.html"));
});

let socketsConnected = new Set();

io.on("connection", (socket) => {
  socketsConnected.add(socket.id);
  console.log(socket.id);
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("start-typing", () => {
    socket.broadcast.emit("start-typing");
  });

  socket.on("stop-typing", () => {
    socket.broadcast.emit("stop-typing");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    socketsConnected.delete(socket.id);
  });

  socket.on("messages", (data) => {
    console.log(data);
    socket.broadcast.emit("chat-messages", data);
  });
});

server.listen(1212, () => {
  console.log("server running at http://localhost:1212");
});
