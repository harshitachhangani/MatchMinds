const express = require("express");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const app = express();

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.get("/", (req, res) => {
    res.send("WebSocket Server For Chatter");
});

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("joinRoom", (data) => {
    socket.join(data.roomCode);
    console.log("joined room", data.roomCode);
  });

  socket.on("sendMessage", (data) => {
    socket.to(data.roomCode).emit("recieveMessage", data);
  });
});

server.listen(3000, () => {
    console.log("Socket Server Listening PORT 3000");
});
