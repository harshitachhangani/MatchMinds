const { spawn } = require('child_process');
const path = require('path');

class GitHubScraperBridge {
  static async getUserStats(username) {
    return new Promise((resolve, reject) => {
      const pythonScriptPath = path.join(__dirname, 'github_scraper.py');
      const pythonProcess = spawn('python', [pythonScriptPath, username]);
      
      let result = '';

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
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
          const stats = JSON.parse(result);
          resolve(stats);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

module.exports = GitHubScraperBridge;