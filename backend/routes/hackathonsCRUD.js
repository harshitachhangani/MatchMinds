// write an endpoint to create a hackathon
// code
const express = require("express");
const router = express.Router();
const Hackathon = require("../models/hackathons");

router.post("/createHackathon", async (req, res) => {
    try {
        const { name, link, username } = req.body;
        const getAllHackathons = await Hackathon.find({ name: name });
        if (getAllHackathons.length > 0) {
            return res.status(400).json({ error: "Hackathon already exists" });
        } else {
            const hackathon = new Hackathon({
                name: name,
                link: link,
                interestedPeoples: username,
            });
            await hackathon.save();
            res.status(200).json({ message: "Hackathon created" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "server side error" });
    }
});

router.get("/getAllHackathons", async (req, res) => {
    try {
        const hackathons = await Hackathon.find();
        res.status(200).json(hackathons);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "server side error" });
    }
});

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
        res.status(400).json({ error: "server side error" });
    }
});

module.exports = router;
