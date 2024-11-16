const { PythonShell } = require('python-shell');
const path = require('path');

class PythonBridge {
    constructor() {
        // Change this to 'python' instead of 'python3' for Windows
        this.pythonPath = 'python';
        this.scriptPath = path.join(__dirname, 'teammate-recommender.py');
    }

    async getRecommendations(userId) {
        return new Promise((resolve, reject) => {
            let options = {
                mode: 'json',
                pythonPath: this.pythonPath,
                pythonOptions: ['-u'],
                scriptPath: path.dirname(this.scriptPath),
                args: [userId.toString()]
            };

            console.log('Executing Python script with options:', {
                pythonPath: this.pythonPath,
                scriptPath: options.scriptPath,
                args: options.args
            });

            PythonShell.run(path.basename(this.scriptPath), options, function (err, results) {
                if (err) {
                    console.error('Python script error:', err);
                    reject(err);
                } else {
                    try {
                        const result = Array.isArray(results) && results.length > 0
                            ? (typeof results[0] === 'string' ? JSON.parse(results[0]) : results[0])
                            : { status: 'error', message: 'No results returned' };
                        
                        console.log('Python script results:', result);
                        resolve(result);
                    } catch (error) {
                        console.error('Error parsing Python output:', error);
                        reject(error);
                    }
                }
            });
        });
    }
}

module.exports = new PythonBridge();