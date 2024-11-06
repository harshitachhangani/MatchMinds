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
    expiresIn: 3 * 24 * 60 * 60,
  });
};


router.get("/getLoggedInUser",async (req,res)=>{
    const token=req.get("Authorization")
    console.log(token)
    if (token){
        jwt.verify(token,process.env.JWT_SECRET,async (err,decodedToken)=>{
            if (err){
                res.status(200).json({error:err,message:"Server Error"})
                return 
            }
            else{
                const user=await User.findById(decodedToken.id)
                res.status(200).json({user:user})
                return
            }
        })
        return 
    }
    else{
        res.status(400).json({error:"No Token Found"})
        return 
    }
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    const authorize = bcrypt.compareSync(password, user.password);
    console.log(authorize);
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
    const { username, email, password } = data
    if (!username || !email || !password) {
        return { message: "Please enter all the fields" }
    }
    if (username.length < 1 || email.length < 1 || password.length < 1) {
        return { message: "Please enter all the fields" }
    }
    if (password.length < 6) {
        return { message: "Password should be atleast 6 characters long" }
    }
    if (username.includes(" ")) {
        return { message: "Username should only contain alphabets and numbers and special characters like _ - ." }
    }
    if (email.includes(" ")) {
        return { message: "Invalid email address" }
    }
    return true
}

router.post("/signup", async (req, res) => {
    try {
        const existingUser = await User.find()
        const check = await existingUser.filter((user) => {
            if (user.username === req.body.username) {
                res.status(400).json({ error: "Username already exists" })
                return true
            }
            else if (user.email === req.body.email) {
                res.status(400).json({ error: "Email already exists" })
                return true
            }
        })

        if (check !== true) {
            const validation = await validate(req.body)
            if (validation === true) {
                const hash = bcrypt.hashSync(req.body.password, saltRounds);
                const new_user = await User.create({
                    username: req.body.username,
                    email: req.body.email,
                    password: hash,
                    fullName: req.body.fullName
                })
                const token = createToken(new_user._id)
                res.status(200).json({ message: new_user, token: token })
                return
            }
            else {
                res.status(400).json({ error: validation.message || "server side error" })
                return
            }
        }
        else {
            res.status(400).json({ error: "User already exists" })
            return
        }
        return
    }
    catch (err) {
        res.status(400).json({ error: err.message})
        return
    }
})

module.exports = router;