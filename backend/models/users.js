// models/users.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const achievementSchema = new mongoose.Schema({
    title: String,
    year: Number,
    category: String
});

const userSchema = new mongoose.Schema({
    fullName: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    college: String,
    hackathons_participated: {
        type: Number,
        default: 0
    },
    achievements: [achievementSchema],
    skills: [String],
    location: String,
    github_username: String,
    image: String,
    friends: [String],
    bio: String,
    sex: String
});

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email});
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        }
        return ({message: "incorrect password"});
    }
    return ({message: "incorrect email"});
};

module.exports = mongoose.model('User', userSchema);