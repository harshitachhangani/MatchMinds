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
            // Create a new chat room if it doesn't exist
            const newChatRoom = new ChatRooms({
                user1: roomCode.slice(0, roomCode.length / 2),
                user2: roomCode.slice(roomCode.length / 2),
                roomCode: roomCode,
                messages: []
            });
            await newChatRoom.save();
            res.status(200).json([]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server side error" });
    }
});

router.post("/getRoomCode", async (req, res) => {
    try {
        const { username, friend } = req.body;
        const roomString = username < friend ? username + friend : friend + username;
        
        let chatRoom = await ChatRooms.findOne({ roomCode: roomString });
        
        if (!chatRoom) {
            // Create a new chat room if it doesn't exist
            chatRoom = new ChatRooms({
                user1: username,
                user2: friend,
                roomCode: roomString,
                messages: []
            });
            await chatRoom.save();
        }
        
        res.status(200).json({ roomCode: roomString });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server side error" });
    }
});

router.post("/saveChats", async (req, res) => {
    try {
        const { user1, user2, roomCode, message } = req.body;

        // Find or create chat room
        let chatRoom = await ChatRooms.findOne({ roomCode });
        
        if (!chatRoom) {
            chatRoom = new ChatRooms({
                user1,
                user2,
                roomCode,
                messages: []
            });
        }

        // Add message to chat room
        chatRoom.messages.push({ 
            sender: user1, 
            message 
        });

        // Save updated chat room
        await chatRoom.save();
        
        res.status(200).json({ message: "Message saved successfully" });
    } catch (error) {
        console.error("Error saving chat:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;