const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/users");
const saltRounds = 10;
const cors = require("cors");
router.use(cors());

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

router.get("/getLoggedInUser", async (req, res) => {
  const token = req.get("Authorization");
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.status(200).json({ error: err, message: "Server Error" });
        return;
      } else {
        const user = await User.findById(decodedToken.id);
        res.status(200).json({ user: user });
        return;
      }
    });
    return;
  } else {
    res.status(400).json({ error: "No Token Found" });
    return;
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    const authorize = bcrypt.compareSync(password, user.password);
    if (authorize) {
      const token = createToken(user._id);
      res.status(200).json({ message: user, token: token });
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } else {
    res.status(400).json({ error: "Invalid credentials" });
    return;
  }
});

const validate = async (data) => {
  const { username, email, password, college, github_username, achievements } = data;

  // Required fields check
  if (!username || !email || !password || !college || !github_username) {
    return { message: "Please enter all required fields" };
  }

  // Length validations
  if (username.length < 1 || email.length < 1 || password.length < 1) {
    return { message: "Please enter all required fields" };
  }

  if (password.length < 6) {
    return { message: "Password should be at least 6 characters long" };
  }

  // Format validations
  if (username.includes(" ")) {
    return {
      message:
        "Username should only contain alphabets, numbers and special characters like _ - .",
    };
  }

  if (email.includes(" ")) {
    return { message: "Invalid email address" };
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { message: "Invalid email format" };
  }

  // GitHub username validation (basic format check)
  const githubUsernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
  if (!githubUsernameRegex.test(github_username)) {
    return { message: "Invalid GitHub username format" };
  }

  return true;
};

router.post("/signup", async (req, res) => {
  try {
    // Check for existing users
    const existingUser = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (existingUser) {
      if (existingUser.username === req.body.username) {
        return res.status(400).json({ error: "Username already exists" });
      }
      if (existingUser.email === req.body.email) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    const validation = await validate(req.body);
    if (validation === true) {
      const hash = bcrypt.hashSync(req.body.password, saltRounds);
      
      // Calculate achievements count from comma-separated string
      const achievements = req.body.achievements ? req.body.achievements.split(',').map(a => a.trim()).filter(a => a.length > 0) : [];
      const achievements_count = achievements.length;

      const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        fullName: req.body.fullName,
        college: req.body.college,
        hackathons_participated: req.body.hackathons_participated || 0,
        skills: req.body.skills || [],
        location: req.body.location,
        github_username: req.body.github_username,
        achievements_count: achievements_count,
        friends: req.body.friends || [],   // Add default as an empty array
        bio: req.body.bio || "",           // Add default as an empty string
        image: req.body.image || ""        // Add default as an empty string
      });

      const token = createToken(newUser._id);
      res.status(200).json({ message: newUser, token: token });
    } else {
      res.status(400).json({ error: validation.message || "server side error" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;