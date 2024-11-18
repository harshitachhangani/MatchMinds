const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const GitHubScraperBridge = require('../github_scraper_bridge');

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
    skills: [String],
    location: String,
    github_username: String,
    total_repositories: {
        type: Number,
        default: 0
    },
    friends: [String],
    bio: String,
    image: String, 
    total_contributions: {
        type: Number,
        default: 0
    },
    achievements_count: {  // New field
        type: Number,
        default: 0
    }
});

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('github_username') && user.github_username) {
        try {
            const stats = await GitHubScraperBridge.getUserStats(user.github_username);
            user.total_repositories = stats.total_repositories;
            user.total_contributions = stats.total_contributions;
        } catch (error) {
            console.error(`Error fetching GitHub stats for user ${user.username}:`, error);
        }
    }
    next();
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