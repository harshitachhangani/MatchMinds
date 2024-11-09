const express = require("express");
const router = express.Router();
const Hackathon = require("../models/hackathons");

// Endpoint to create a hackathon
router.post("/createHackathon", async (req, res) => {
    try {
        const { name, link, username, problemStatement } = req.body; // Extract problemStatement from request body

        const existingHackathon = await Hackathon.findOne({ name: name });
        if (existingHackathon) {
            return res.status(400).json({ error: "Hackathon already exists" });
        } else {
            const hackathon = new Hackathon({
                name: name,
                link: link,
                problemStatement: problemStatement, // Add problemStatement to the new hackathon
                interestedPeoples: [username],
            });
            await hackathon.save();
            res.status(200).json({ message: "Hackathon created" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Server side error" });
    }
});

// Endpoint to get all hackathons
router.get("/getAllHackathons", async (req, res) => {
    try {
        const hackathons = await Hackathon.find();
        res.status(200).json(hackathons);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Server side error" });
    }
});

// Endpoint to update hackathon with new interested people
router.post("/updateHackathon", async (req, res) => {
    try {
        const { username, hackName } = req.body;
        console.log(username, hackName, "username, hackName");

        const hackathon = await Hackathon.findOne({ name: hackName });
        console.log(hackathon, "hackathon");

        if (hackathon) {
            hackathon.interestedPeoples.push(username);
            await hackathon.save();
            res.status(200).json({ message: "User added to hackathon" });
        } else {
            res.status(400).json({ error: "Hackathon not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Server side error" });
    }
});

module.exports = router;
