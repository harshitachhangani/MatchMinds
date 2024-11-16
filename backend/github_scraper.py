import os
import sys
import json
import requests

class GitHubContributionScraper:
    def __init__(self, github_token: str = None):
        self.session = requests.Session()
        self.github_token = github_token or os.getenv("GITHUB_ACCESS_TOKEN")  # Replace with your token
        if self.github_token:
            self.session.headers.update({
                'Authorization': f'token {self.github_token}',
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
            print(f"Error fetching data for {username}: {str(e)}", file=sys.stderr)
            return {}

    def _get_rest_api_data(self, username: str) -> dict:
        url = f"{self.base_url}/users/{username}"
        response = self.session.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Failed to fetch REST API data: {response.status_code}", file=sys.stderr)
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
            else:
                print(f"Failed to fetch GraphQL data: {response.status_code}", file=sys.stderr)

        return {}

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Username argument required"}))
        sys.exit(1)
    
    username = sys.argv[1]
    scraper = GitHubContributionScraper()
    stats = scraper.get_user_github_stats(username)
    print(json.dumps(stats))