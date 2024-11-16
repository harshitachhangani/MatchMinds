const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const auth = require('./auth');

// Helper function to run Python script
const runPythonScript = (userId) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['recommendation_system.py', userId]);
        let dataString = '';

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python Error: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python process exited with code ${code}`));
                return;
            }
            try {
                const result = JSON.parse(dataString);
                resolve(result);
            } catch (error) {
                reject(new Error('Failed to parse Python output'));
            }
        });
    });
};

// Get recommendations for a user
router.get('/recommendations/:userId', auth, async (req, res) => {
    try {
        const result = await runPythonScript(req.params.userId);
        
        if (result.status === 'error') {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ 
            status: 'error', 
            message: error.message || 'Failed to get recommendations' 
        });
    }
});

// Get cached recommendations
router.get('/recommendations/:userId/cached', auth, async (req, res) => {
    try {
        const client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db('mydb');
        
        const cachedRecommendations = await db.collection('recommendations')
            .findOne({ user_id: req.params.userId });
            
        if (!cachedRecommendations) {
            return res.status(404).json({
                status: 'error',
                message: 'No cached recommendations found'
            });
        }
        
        res.json({
            status: 'success',
            recommendations: cachedRecommendations.recommendations,
            cachedAt: cachedRecommendations.updated_at
        });
        
    } catch (error) {
        console.error('Error getting cached recommendations:', error);
        res.status(500).json({ 
            status: 'error', 
            message: error.message || 'Failed to get cached recommendations' 
        });
    }
});

module.exports = router;