const express = require("express");
const router = express.Router();
const AllUsers = require("../models/users");
const ChatRooms = require("../models/chatRooms");

router.post("/addFriend", async (req, res) => {
    try {
        
        const username = req.body.username;
        const friendRequest = req.body.friend;

        const user = await AllUsers.findOne({ username: username });
        const friend = await AllUsers.findOne({ username: friendRequest });
        const roomString = username < friendRequest ? username + friendRequest : friendRequest + username;
        
        if (friend) {
            if (user.friends.includes(friend.username)) {
                res.status(400).json({ error: "Already friends" });
            } 
            else {
                user.friends.push(friend.username);
                await user.save();
                
                friend.friends.push(username);
                await friend.save();
                
                const chatRoom = await ChatRooms.create({
                    user1: username,
                    user2: friendRequest,
                    roomCode: roomString,
                });

                res.status(200).json({ message: "Friend added" });
            }
        } else {
            res.status(400).json({ error: "Friend not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "server side error" });
    }
});

router.post("/addSkills", async (req, res) => {
    try {
        const username = req.body.username;
        const skill = req.body.skill;

        const user = await AllUsers.findOne({ username: username });
        console.log(user.skills,"user.skills")
        console.log(skill,"skill")
        if (user) {

            if (user.skills.includes(skill)) {
                res.status(400).json({ error: "Skill already exists" });
            }
            else {
                user.skills.push(skill);
                await user.save();
                res.status(200).json({ message: "Skill added" });
            }
        }
        else {
            res.status(400).json({ error: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "server side error" });
    }
});

router.get("/getUserById/:username", async (req, res) => {
    try {
        const user = await AllUsers.find({username: req.params.username});
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(400).json({ error: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "server side error" });
    }
}
);

router.get("/getUsers", async (req, res) => {
    try{
        console.log("get userssssss")
        const users = await AllUsers.find()
        console.log(users)
        res.status(200).json(users)
    }
    catch(error){
        console.log(error)
        res.status(400).json({ error: "server side error"})
    }
})

router.post("/removeFriend", async (req, res) => {
    try {
        const username = req.body.username;
        const friendRequest = req.body.friend;

        const user = await AllUsers.findOne({ username
        });
        const friend = await AllUsers.findOne({ username:
            friendRequest
        });

        if (friend) {
            if (user.friends.includes(friend.username)) {
                user.friends = user.friends.filter((friend) => friend !== friendRequest);
                await user.save();

                friend.friends = friend.friends.filter((friend) => friend !== username);
                await friend.save();

                res.status(200).json({ message: "Friend removed" });
            } else {
                res.status(400).json({ error: "Not friends" });
            }
        } else {
            res.status(400).json({ error: "Friend not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "server side error" });
    }
}
);

router.post("/updateUser", async (req, res) => {
    try {
        const {username, bio, fullName, image} = req.body;
        console.log(username, bio, fullName, "username, image, bio")
        const user = await AllUsers.findOne({ username: username });

        if (user) {
            if (bio !== "") {
                user.bio = bio;
            }
            if (image !== "") {
                user.image = image;
            }
            if (fullName !== "") {
                user.fullName = fullName;
            }
            await user.save();

            res.status(200).json({ message: "User details updated" });
        }
        else {
            res.status(400).json({ error: "User not found" });
        }


    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "server side error" });
    }
});

router.patch("/deleteDuplicate", async (req, res) => {
    try {
        const users = await AllUsers.find();
            // const db = require("../models/db"); // Import the appropriate module that provides the `db` object
            
        const check = await AllUsers.aggregate(
                [
                    {
                        $group: {
                            _id: "$username",
                            dups: { $push: "$_id" },
                            count: { $sum: 1 },
                        },
                    },
                    { $match: { count: { $gt: 1 } } },
                ],
                { allowDiskUse: true }
            )
        console.log(check, "check")
        check.forEach(function (doc) {
            doc.dups.shift();
            AllUsers.deleteMany({ _id: { $in: doc.dups } });
        });
        
        res.status(200).json({ message: "Duplicates removed" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "server side error" });
    }
});

router.get("/getRecommendedUsers/:username", async (req, res) => {
    try {
        const user = await AllUsers.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const recommendedUsers = await AllUsers.find({
            username: { $ne: user.username }, // Exclude the current user
            skills: { $in: user.skills },      // Match any skill the user has
        });

        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;