from flask import Flask, request, jsonify
from bson.json_util import dumps
from github_scraper import GitHubContributionScraper  # Make sure you have this imported correctly
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MongoDB connection details
MONGO_URI = "mongodb+srv://harshitachhangani22:8YVlqDXUnEme8f9Z@matchminds.jsl7h.mongodb.net/?retryWrites=true&w=majority&appName=matchminds"
MONGO_DB = "mydb"
MONGO_COLLECTION = "users"

# MongoDB client
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
users_collection = db[MONGO_COLLECTION]

from bson.json_util import dumps  # already imported
from bson.objectid import ObjectId

@app.route('/register', methods=['POST'])
def register_user():
    try:
        # Get the JSON data from the request
        data = request.get_json()

        # Ensure github_username is provided
        if 'github_username' not in data:
            return jsonify({"error": "Missing github_username"}), 400
        
        github_username = data['github_username']
        
        # Ensure that github_username is mapped to username in MongoDB
        data['username'] = github_username
        
        # Try scraping GitHub data
        try:
            scraper = GitHubContributionScraper(github_token="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")
            github_stats = scraper.get_user_github_stats(github_username)
        except Exception as e:
            return jsonify({"error": f"Failed to scrape GitHub data: {str(e)}"}), 500
        
        # Combine the user data and GitHub stats
        user_data = {**data, **github_stats}
        
        # Insert the data into MongoDB
        result = users_collection.insert_one(user_data)
        
        # Get the inserted user's data, including the _id field (which is an ObjectId)
        user_data['_id'] = str(result.inserted_id)  # Convert ObjectId to string
        
        # Return success response
        return jsonify(user_data), 201
    
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
