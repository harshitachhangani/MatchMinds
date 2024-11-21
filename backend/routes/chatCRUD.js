const express = require("express");
const router = express.Router();
const ChatRooms = require("../models/chatRooms");

router.get("/getChats/:roomCode", async (req, res) => {
    try {
        const roomCode = req.params.roomCode;
        console.log("Fetching chats for roomCode:", roomCode); // Debugging log

        const chatRoom = await ChatRooms.findOne({
            roomCode: roomCode,
        });
        
        if (chatRoom) {
            console.log("Chat room found:", chatRoom); // Debugging log
            res.status(200).json(chatRoom.messages || []);
        } else {
            console.log("No chat room found, creating new one"); // Debugging log
            
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
        console.error("Error in getChats route:", error);
        
        // Ensure a JSON response is always sent
        res.status(500).json({ 
            error: "Server side error", 
            details: error.message 
        });
    }
});

router.post("/getRoomCode", async (req, res) => {
    try {
        const { username, friend } = req.body;
        console.log("Getting room code for:", username, friend); // Debugging log

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
            console.log("New chat room created:", roomString); // Debugging log
        }
        
        res.status(200).json({ roomCode: roomString });
    } catch (error) {
        console.error("Error in getRoomCode route:", error);
        
        // Ensure a JSON response is always sent
        res.status(500).json({ 
            error: "Server side error", 
            details: error.message 
        });
    }
});

router.post("/saveChats", async (req, res) => {
    try {
        const { user1, user2, roomCode, message } = req.body;
        console.log("Saving chat:", { user1, user2, roomCode, message }); // Debugging log

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
        
        console.log("Message saved successfully"); // Debugging log
        res.status(200).json({ message: "Message saved successfully" });
    } catch (error) {
        console.error("Error saving chat:", error);
        
        // Ensure a JSON response is always sent
        res.status(500).json({ 
            error: "Server error", 
            details: error.message 
        });
    }
});

module.exports = router;