const express = require('express');
const router = express.Router();
const PythonBridge = require('../pythonBridge');
const auth = require('./auth');

router.get('/recommendations/:userId', auth, async (req, res) => {
    try {
        const recommendations = await PythonBridge.getRecommendations(req.params.userId);
        res.json(recommendations);
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ 
            status: 'error', 
            message: error.message || 'Failed to get recommendations' 
        });
    }
});

module.exports = router;