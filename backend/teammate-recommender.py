import numpy as np
import pandas as pd
from pymongo import MongoClient
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from scipy.stats import pearsonr
import torch
import torch.nn as nn
import torch_geometric
from torch_geometric.data import Data
from torch_geometric.nn import GCNConv
import networkx as nx
from typing import List, Dict, Tuple
import logging
import datetime
from datetime import datetime
import json
from conti_scrape import GitHubContributionScraper

class TeamGNN(nn.Module):
    def __init__(self, num_features: int, hidden_dim: int, output_dim: int):
        super(TeamGNN, self).__init__()
        self.conv1 = GCNConv(num_features, hidden_dim)
        self.conv2 = GCNConv(hidden_dim, output_dim)
        
    def forward(self, data):
        x, edge_index = data.x, data.edge_index
        x = self.conv1(x, edge_index)
        x = torch.relu(x)
        x = self.conv2(x, edge_index)
        return x

class TeamRecommendationSystem:
    def __init__(self, mongo_uri: str, github_token: str):
        """Initialize the recommendation system."""
        self.client = MongoClient(mongo_uri)
        self.db = self.client.hackathon_db
        self.github_scraper = GitHubContributionScraper(github_token)
        self.scaler = StandardScaler()
        
        # Initialize logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    def create_feature_matrix(self, users: List[Dict]) -> np.ndarray:
        """Create feature matrix from user data."""
        features = []
        for user in users:
            user_features = [
                user.get('hackathons_participated', 0),
                user.get('github_metrics', {}).get('total_repositories', 0),
                user.get('github_metrics', {}).get('total_contributions', 0),
                len(user.get('skills', [])),
                len(user.get('achievements', []))
            ]
            features.append(user_features)
        
        feature_matrix = np.array(features)
        return self.scaler.fit_transform(feature_matrix)

    def create_adjacency_matrix(self, users: List[Dict]) -> np.ndarray:
        """Create adjacency matrix based on user similarities."""
        n_users = len(users)
        adj_matrix = np.zeros((n_users, n_users))
        
        for i in range(n_users):
            for j in range(i+1, n_users):
                similarity = self.calculate_similarities(users[i], users[j])
                # Use average of all similarity metrics
                sim_score = np.mean([v for v in similarity.values()])
                adj_matrix[i, j] = sim_score
                adj_matrix[j, i] = sim_score
        
        return adj_matrix

    def train_gnn(self, model: TeamGNN, data: Data, epochs: int = 100) -> None:
        """Train the GNN model."""
        optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
        criterion = nn.MSELoss()
        
        model.train()
        for epoch in range(epochs):
            optimizer.zero_grad()
            out = model(data)
            loss = criterion(out, data.x)  # Reconstruction loss
            loss.backward()
            optimizer.step()

    def get_recommendations(self, user_id: str, top_k: int = 5) -> List[Dict]:
        """Get team recommendations using GNN."""
        try:
            user_id = int(user_id)  # Convert to int for MongoDB query
            # Get all users
            users = list(self.db.users.find())
            user_idx = next((i for i, u in enumerate(users) if u['_id'] == user_id), None)
            
            if user_idx is None:
                self.logger.error(f"User {user_id} not found")
                return []
            
            # Create feature matrix
            features = self.create_feature_matrix(users)
            
            # Create adjacency matrix based on similarities
            adj_matrix = self.create_adjacency_matrix(users)
            
            # Convert to PyTorch Geometric Data
            edge_index = torch_geometric.utils.dense_to_sparse(torch.tensor(adj_matrix))[0]
            data = Data(x=torch.tensor(features, dtype=torch.float),
                       edge_index=edge_index)
            
            # Initialize and train GNN
            model = TeamGNN(features.shape[1], 64, 32)
            self.train_gnn(model, data)
            
            # Get embeddings
            embeddings = model(data).detach().numpy()
            
            # Calculate similarities with target user
            target_embedding = embeddings[user_idx]
            similarities = cosine_similarity([target_embedding], embeddings)[0]
            
            # Get top-k recommendations
            top_indices = np.argsort(similarities)[::-1][1:top_k+1]  # Exclude self
            
            recommendations = []
            for idx in top_indices:
                user = users[idx]
                sim_metrics = self.calculate_similarities(users[user_idx], user)
                
                recommendations.append({
                    'user_id': user['_id'],
                    'username': user['username'],
                    'college': user['college'],
                    'skills': user['skills'],
                    'hackathons_participated': user['hackathons_participated'],
                    'achievements': user['achievements'],
                    'similarity_metrics': sim_metrics,
                    'overall_score': similarities[idx],
                    'github_stats': {
                        'repositories': user.get('github_metrics', {}).get('total_repositories', 0),
                        'contributions': user.get('github_metrics', {}).get('total_contributions', 0)
                    }
                })
            
            # Store recommendations
            self.db.recommendations.update_one(
                {'user_id': user_id},
                {
                    '$set': {
                        'recommendations': recommendations,
                        'updated_at': datetime.now()
                    }
                },
                upsert=True
            )
            
            return recommendations
            
        except Exception as e:
            self.logger.error(f"Error getting recommendations: {str(e)}")
            return []

    def update_github_stats(self, user_id: str) -> None:
        """Update GitHub statistics for a user."""
        try:
            user = self.db.users.find_one({"_id": user_id})
            if not user or not user.get('github_username'):
                return
            
            # Scrape GitHub data
            github_stats = self.github_scraper.get_contribution_stats(user['github_username'])
            
            # Extract relevant metrics
            github_metrics = {
                'total_repositories': github_stats['basic_info']['public_repos'],
                'total_contributions': github_stats['contribution_stats']['contributionsCollection']
                                    ['contributionCalendar']['totalContributions'],
                'language_stats': github_stats['language_stats'],
                'top_repos': github_stats['repository_stats']['top_repos']
            }
            
            # Update user document
            self.db.users.update_one(
                {"_id": user_id},
                {"$set": {"github_metrics": github_metrics}}
            )
            
        except Exception as e:
            self.logger.error(f"Error updating GitHub stats for user {user_id}: {str(e)}")

    def calculate_similarities(self, user1: Dict, user2: Dict) -> Dict[str, float]:
        """Calculate various similarity metrics between two users."""
        try:
            # Jaccard Similarity for skills
            skills1 = set(user1.get('skills', []))
            skills2 = set(user2.get('skills', []))
            jaccard = len(skills1.intersection(skills2)) / len(skills1.union(skills2)) if skills1 or skills2 else 0
            
            # Create feature vectors for other similarities
            features = ['hackathons_participated', 
                       'github_metrics.total_repositories',
                       'github_metrics.total_contributions']
            
            vector1 = [user1.get(f, 0) if '.' not in f else 
                      user1.get(f.split('.')[0], {}).get(f.split('.')[1], 0) 
                      for f in features]
            vector2 = [user2.get(f, 0) if '.' not in f else 
                      user2.get(f.split('.')[0], {}).get(f.split('.')[1], 0) 
                      for f in features]
            
            # Cosine similarity
            cos_sim = cosine_similarity([vector1], [vector2])[0][0]
            
            # Pearson correlation
            try:
                pearson = pearsonr(vector1, vector2)[0]
            except:
                pearson = 0
                
            return {
                'jaccard_similarity': jaccard,
                'cosine_similarity': cos_sim,
                'pearson_correlation': pearson
            }
            
        except Exception as e:
            self.logger.error(f"Error calculating similarities: {str(e)}")
            return {'jaccard_similarity': 0, 'cosine_similarity': 0, 'pearson_correlation': 0}

    def format_ui_recommendations(self, recommendations: List[Dict]) -> Dict:
        """Format recommendations for UI display."""
        return {
            'status': 'success',
            'recommendations': [
                {
                    'id': rec['user_id'],
                    'cardContent': {
                        'header': {
                            'username': rec['username'],
                            'college': rec['college'],
                            'matchScore': f"{rec['overall_score']*100:.1f}%"
                        },
                        'body': {
                            'skills': rec['skills'],
                            'experience': {
                                'hackathons': rec['hackathons_participated'],
                                'achievements': len(rec['achievements'])
                            },
                            'githubStats': {
                                'repos': rec['github_stats']['repositories'],
                                'contributions': rec['github_stats']['contributions']
                            }
                        },
                        'footer': {
                            'similarityMetrics': {
                                'skillMatch': f"{rec['similarity_metrics']['jaccard_similarity']*100:.1f}%",
                                'experienceMatch': f"{rec['similarity_metrics']['cosine_similarity']*100:.1f}%"
                            }
                        }
                    }
                }
                for rec in recommendations
            ]
        }

# Usage example
if __name__ == "__main__":
    recommender = TeamRecommendationSystem(
        mongo_uri="mongodb://localhost:27017/",
        github_token="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"
    )
    
    # Update GitHub stats for a user
    user_id = "1"  # Changed to string to match MongoDB _id type
    recommender.update_github_stats(user_id)
    
    # Get and format recommendations
    recommendations = recommender.get_recommendations(user_id)
    ui_formatted = recommender.format_ui_recommendations(recommendations)
    
    print(json.dumps(ui_formatted, indent=2))