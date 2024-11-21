const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
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
    // Broadcast to all users in the room except the sender
    socket.to(data.roomCode).emit("recieveMessage", data);
  });
});

server.listen(3000, () => {
    console.log("Socket Server Listening PORT 3000");
});

module.exports = { io, server };