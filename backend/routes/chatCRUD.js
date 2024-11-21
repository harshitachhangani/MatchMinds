const express = require("express");
const router = express.Router();
const ChatRooms = require("../models/chatRooms");

router.get("/getChats/:roomCode", async (req, res) => {
    try {
        const roomCode = req.params.roomCode;
        const chatRoom = await ChatRooms.findOne({
            roomCode: roomCode,
        });
        if (chatRoom) {
            res.status(200).json(chatRoom.messages);
        } else {
            res.status(400).json({ error: "Room not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "server side error" });
    }
});

router.post("/getRoomCode", async (req, res) => {
    try {
        const username = req.body.username;
        const friend = req.body.friend;
        const roomString = username < friend ? username + friend : friend + username;
        const chatRoom = await ChatRooms.findOne({ roomCode: roomString });
        if (chatRoom) {
            res.status(200).json({ roomCode: chatRoom.roomCode });
        } else {
            res.status(400).json({ error: "Room not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "server side error" });
    }
});

router.post("/saveChats", async (req, res) => {
    try {
        const { user1, user2, roomCode, message } = req.body;
        console.log(roomCode,"roomString")
        const msg = await ChatRooms.find({roomCode : roomCode})
        console.log(msg,"msg")
        if (!msg) {
            res.status(400).json({ error: "Room not found" });
        }
        else{
            msg[0].messages.push({sender: user1, message: message});
            await msg[0].save();
            res.status(200).json({ message: "Message saved", msg : msg });
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "server side error" });
    }
});
module.exports = router;