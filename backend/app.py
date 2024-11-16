from flask import Flask, request, jsonify
from flask_cors import CORS
from github_scraper import GitHubContributionScraper
from pymongo import MongoClient

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# MongoDB connection details
MONGO_URI = "mongodb+srv://harshitachhangani22:8YVlqDXUnEme8f9Z@matchminds.jsl7h.mongodb.net/?retryWrites=true&w=majority&appName=matchminds"
MONGO_DB = "mydb"
MONGO_COLLECTION = "users"

# MongoDB client
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
users_collection = db[MONGO_COLLECTION]

@app.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        
        # Ensure github_username is provided
        if 'github_username' not in data:
            return jsonify({"error": "Missing github_username"}), 400
        
        github_username = data['github_username']
        
        # Scrape GitHub data
        scraper = GitHubContributionScraper(github_token="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")
        github_stats = scraper.get_user_github_stats(github_username)
        
        # Combine the user data and GitHub stats
        user_data = {**data, **github_stats}
        
        # Insert the data into MongoDB
        result = users_collection.insert_one(user_data)
        
        # Get the inserted user's data, including the _id field (which is an ObjectId)
        user_data['_id'] = str(result.inserted_id)
        
        return jsonify(user_data), 201
    
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)