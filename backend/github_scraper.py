import requests
from datetime import datetime
import json
from pymongo import MongoClient

# MongoDB connection details
MONGO_URI = "mongodb+srv://harshitachhangani22:8YVlqDXUnEme8f9Z@matchminds.jsl7h.mongodb.net/?retryWrites=true&w=majority&appName=matchminds"
MONGO_DB = "mydb"
MONGO_COLLECTION = "users"

# MongoDB client
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
users_collection = db[MONGO_COLLECTION]

class GitHubContributionScraper:
    def __init__(self, github_token: str = None):
        self.session = requests.Session()
        self.github_token = github_token
        if github_token:
            self.session.headers.update({
                'Authorization': f'token {github_token}',
                'Accept': 'application/vnd.github.v3+json'
            })

        self.base_url = "https://api.github.com"
        self.graphql_url = "https://api.github.com/graphql"

    def get_user_github_stats(self, username: str) -> dict:
        try:
            # Get user data from REST API
            user_data = self._get_rest_api_data(username)
            
            # Get contribution data from GraphQL API
            graphql_data = self._get_graphql_data(username)
            
            stats = {
                "total_repositories": user_data.get("public_repos", 0),
                "total_contributions": graphql_data.get("contributionsCollection", {}).get("contributionCalendar", {}).get("totalContributions", 0)
            }
            
            return stats
        
        except Exception as e:
            print(f"Error fetching data for {username}: {str(e)}")
            return {}

    def _get_rest_api_data(self, username: str) -> dict:
        url = f"{self.base_url}/users/{username}"
        response = self.session.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Failed to fetch REST API data: {response.status_code}")
            return {}

    def _get_graphql_data(self, username: str) -> dict:
        query = """
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
              }
            }
          }
        }
        """
        
        variables = {"username": username}
        
        if self.github_token:
            response = self.session.post(
                self.graphql_url,
                json={"query": query, "variables": variables}
            )
            
            if response.status_code == 200:
                return response.json().get("data", {}).get("user", {})
        
        return {}

# Flask API
from flask import Flask, request, jsonify
from bson.json_util import dumps

app = Flask(__name__)

@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data['github_username']
    
    # Scrape GitHub data
    scraper = GitHubContributionScraper(github_token="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")
    github_stats = scraper.get_user_github_stats(username)
    
    # Update user data in MongoDB
    user_data = {**data, **github_stats}
    users_collection.insert_one(user_data)
    
    return jsonify(user_data), 201

if __name__ == '__main__':
    app.run(debug=True)