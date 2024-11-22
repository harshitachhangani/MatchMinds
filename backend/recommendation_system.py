import sys
import os
import json
import numpy as np
import torch
import torch.nn as nn
import torch_geometric
from torch_geometric.data import Data
from torch_geometric.nn import GCNConv
from pymongo import MongoClient
from bson import ObjectId
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from scipy.stats import pearsonr
import logging
from datetime import datetime
from typing import Dict, List, Optional

class TeamGNN(nn.Module):
    def __init__(self, num_features: int, hidden_dim: int, output_dim: int):
        super(TeamGNN, self).__init__()
        self.conv1 = GCNConv(num_features, hidden_dim)
        self.conv2 = GCNConv(hidden_dim, output_dim)
        self.fc = nn.Linear(output_dim, num_features)

    def forward(self, data):
        x, edge_index = data.x, data.edge_index
        x = self.conv1(x, edge_index)
        x = torch.relu(x)
        x = self.conv2(x, edge_index)
        x = self.fc(x)
        return x

class HybridTeamRecommender:
    def __init__(self, mongo_uri: str = os.getenv("MONGO_URI")):
        self.mongo_uri = mongo_uri
        self.scaler = StandardScaler()
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
        
        # Hybrid recommendation weights
        self.content_based_weight = 0.6
        self.gnn_weight = 0.4
        
        # GNN-specific parameters
        self.gnn_hidden_dim = 64
        self.gnn_output_dim = 32
        self.gnn_epochs = 100

    def get_user_by_id(self, user_id: str) -> Optional[Dict]:
        """Fetch user from MongoDB by ID."""
        try:
            client = MongoClient(self.mongo_uri)
            db = client.mydb
            user_id_obj = ObjectId(user_id)
            user = db.users.find_one({"_id": user_id_obj})
            return user
        except Exception as e:
            self.logger.error(f"Error fetching user: {str(e)}")
            return None
        finally:
            client.close()

    def safe_get_numeric(self, user: Dict, field: str, default: int = 0) -> float:
        """Safely get numeric value from user dict."""
        value = user.get(field, default)
        if value == '':
            return float(default)
        try:
            return float(value)
        except (ValueError, TypeError):
            return float(default)

    def calculate_content_based_similarities(self, target_user: Dict, user: Dict) -> Dict[str, float]:
        """Calculate content-based similarity metrics."""
        try:
            # Skills similarity (Jaccard)
            skills1 = set(filter(None, target_user.get('skills', [])))
            skills2 = set(filter(None, user.get('skills', [])))

            # Calculate both similar and complementary skills
            similar_skills = len(skills1.intersection(skills2))
            total_skills = len(skills1.union(skills2))

            self.logger.debug(f"Skills 1: {skills1}")
            self.logger.debug(f"Skills 2: {skills2}")
            self.logger.debug(f"Similar Skills: {similar_skills}")
            self.logger.debug(f"Total Skills: {total_skills}")

            # Similar skills ratio
            similar_skills_ratio = similar_skills / total_skills if total_skills > 0 else 0

            # Experience metrics comparison
            exp_metrics = {
                'hackathons': 'hackathons_participated',
                'repos': 'total_repositories',
                'contributions': 'total_contributions',
                'achievements': 'achievements_count'
            }

            # Safely get numeric values
            vector1 = [self.safe_get_numeric(target_user, metric) for metric in exp_metrics.values()]
            vector2 = [self.safe_get_numeric(user, metric) for metric in exp_metrics.values()]

            # Calculate experience similarity
            if all(v == 0 for v in vector1) and all(v == 0 for v in vector2):
                exp_similarity = 0.0
            else:
                vector1_arr = np.array(vector1).reshape(1, -1)
                vector2_arr = np.array(vector2).reshape(1, -1)
                
                if np.any(vector1_arr) or np.any(vector2_arr):
                    combined = np.vstack([vector1_arr, vector2_arr])
                    normalized = self.scaler.fit_transform(combined)
                    exp_similarity = cosine_similarity(
                        normalized[0].reshape(1, -1), 
                        normalized[1].reshape(1, -1)
                    )[0][0]
                else:
                    exp_similarity = 0.0

            # Calculate final content-based score
            skill_score = similar_skills_ratio * 0.5
            exp_score = exp_similarity * 0.5

            return {
                'skill_similarity': similar_skills_ratio,
                'experience_similarity': exp_similarity,
                'content_based_score': skill_score + exp_score
            }

        except Exception as e:
            self.logger.error(f"Error in content-based similarity: {str(e)}")
            return {
                'skill_similarity': 0.0,
                'experience_similarity': 0.0,
                'content_based_score': 0.0
            }

    def create_feature_matrix(self, users: List[Dict]) -> np.ndarray:
        """Create feature matrix from user data for GNN."""
        features = []
        for user in users:
            user_features = [
                self.safe_get_numeric(user, 'hackathons_participated'),
                self.safe_get_numeric(user, 'total_repositories'),
                self.safe_get_numeric(user, 'total_contributions'),
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
                # Use content-based similarity as edge weight
                content_sim = self.calculate_content_based_similarities(users[i], users[j])
                sim_score = content_sim['content_based_score']
                adj_matrix[i, j] = sim_score
                adj_matrix[j, i] = sim_score
        
        return adj_matrix

    def train_gnn(self, model: TeamGNN, data: Data) -> None:
        """Train the GNN model."""
        optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
        criterion = nn.MSELoss()
        
        model.train()
        for _ in range(self.gnn_epochs):
            optimizer.zero_grad()
            out = model(data)
            loss = criterion(out, data.x)
            loss.backward()
            optimizer.step()

    def get_hybrid_recommendations(self, user_id: str, limit: int = 9) -> Dict:
        """Get hybrid recommendations combining content-based and GNN approaches."""
        try:
            # Get target user
            target_user = self.get_user_by_id(user_id)
            if not target_user:
                return {
                    "status": "error",
                    "message": f"User not found with ID: {user_id}"
                }

            # Get all other users
            client = MongoClient(self.mongo_uri)
            db = client.mydb
            all_users = list(db.users.find({"_id": {"$ne": ObjectId(user_id)}}))

            if not all_users:
                return {
                    "status": "error",
                    "message": "No other users found for comparison"
                }

            # Prepare data for GNN
            features = self.create_feature_matrix(all_users + [target_user])
            adj_matrix = self.create_adjacency_matrix(all_users + [target_user])
            
            # Convert to PyTorch Geometric Data
            edge_index = torch_geometric.utils.dense_to_sparse(torch.tensor(adj_matrix))[0]
            data = Data(x=torch.tensor(features, dtype=torch.float),
                        edge_index=edge_index)
            
            # Initialize and train GNN
            model = TeamGNN(features.shape[1], self.gnn_hidden_dim, self.gnn_output_dim)
            self.train_gnn(model, data)
            
            # Get embeddings
            embeddings = model(data).detach().numpy()
            
            # Get target user index (last index)
            target_idx = len(all_users)
            target_embedding = embeddings[target_idx]
            
            # Calculate GNN similarities
            gnn_similarities = cosine_similarity([target_embedding], embeddings)[0]
            
            # Prepare recommendations
            recommendations = []
            for idx in range(len(all_users)):
                if idx == target_idx:
                    continue
                
                user = all_users[idx]
                
                # Calculate content-based similarity
                content_similarities = self.calculate_content_based_similarities(target_user, user)
                
                # Calculate individual similarity metrics
                similar_skills = content_similarities['skill_similarity'] * 100  # Percentage form
                exp_similarity = content_similarities['experience_similarity'] * 100  # Percentage form
                content_based_score = content_similarities['content_based_score'] * 100  # Percentage form
                
                # Complementary skills (not common)
                complementary_skills = (1 - content_similarities['skill_similarity']) * 100  # Complementary skills in percentage
                
                # Repository match (example)
                repo_match = 1 - abs(user['total_repositories'] - target_user['total_repositories']) / max(user['total_repositories'], target_user['total_repositories'], 1)
                repo_match = repo_match * 100  # Percentage form

                # Combine content-based and GNN similarities
                gnn_similarity = gnn_similarities[idx]
                
                # Hybrid scoring
                hybrid_score = (
                    self.content_based_weight * content_based_score + 
                    self.gnn_weight * gnn_similarity * 100  # Scaling for percentage format
                )
                
                # Create recommendation
                recommendation = {
                    "id": str(user['_id']),
                    "cardContent": {
                        "header": {
                            "username": user.get('username', ''),
                            "college": user.get('college', ''),
                            "matchScore": f"{hybrid_score:.1f}%"
                        },
                        "body": {
                            "skills": list(filter(None, user.get('skills', []))),
                            "experience": {
                                "hackathons": self.safe_get_numeric(user, 'hackathons_participated'),
                                "githubStats": {
                                    "repos": self.safe_get_numeric(user, 'total_repositories'),
                                    "contributions": self.safe_get_numeric(user, 'total_contributions'),
                                    "achievements": self.safe_get_numeric(user, 'achievements_count')
                                }
                            }
                        },
                        "footer": {
                            "similarityMetrics": {
                                "similarSkills": f"{similar_skills:.1f}%",
                                "complementarySkills": f"{complementary_skills:.1f}%",
                                "experienceMatch": f"{exp_similarity:.1f}%",
                                "repoMatch": f"{repo_match:.1f}%",
                                "hybridScore": f"{hybrid_score:.1f}%"
                            }
                        }
                    }
                }
                
                recommendations.append(recommendation)

            # Sort recommendations by hybrid score
            recommendations.sort(
                key=lambda x: float(x['cardContent']['header']['matchScore'].rstrip('%')),
                reverse=True
            )
            recommendations = recommendations[:limit]

            # Store recommendations
            self._store_recommendations(user_id, recommendations)

            return {
                "status": "success",
                "recommendations": recommendations
            }

        except Exception as e:
            self.logger.error(f"Error getting hybrid recommendations: {str(e)}")
            return {
                "status": "error",
                "message": str(e)
            }
        finally:
            if 'client' in locals():
                client.close()

    def _store_recommendations(self, user_id: str, recommendations: List[Dict]) -> None:
        """Store recommendations in MongoDB for caching."""
        try:
            client = MongoClient(self.mongo_uri)
            db = client.mydb
            db.recommendations.update_one(
                {'user_id': user_id},
                {
                    '$set': {
                        'recommendations': recommendations,
                        'updated_at': datetime.now()
                    }
                },
                upsert=True
            )
        except Exception as e:
            self.logger.error(f"Error storing recommendations: {str(e)}")
        finally:
            client.close()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({
            "status": "error",
            "message": "Usage: python script.py <user_id>"
        }))
        sys.exit(1)

    recommender = HybridTeamRecommender()
    result = recommender.get_hybrid_recommendations(sys.argv[1])
    print(json.dumps(result))