import sys
import json
import numpy as np
from pymongo import MongoClient
from bson import ObjectId
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
import logging
from datetime import datetime
from typing import Dict, List, Optional
import os

class TeamRecommender:
    def __init__(self, mongo_uri: str = os.getenv("MONGO_URI")):
        self.mongo_uri = mongo_uri
        self.scaler = StandardScaler()
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    def get_user_by_id(self, user_id: str) -> Optional[Dict]:
        """Fetch user from MongoDB by ID."""
        try:
            client = MongoClient(self.mongo_uri)
            db = client.mydb
            user_id_obj = ObjectId(user_id)
            return db.users.find_one({"_id": user_id_obj})
        except Exception as e:
            self.logger.error(f"Error fetching user: {str(e)}")
            return None
        finally:
            client.close()

    def safe_get_numeric(self, user: Dict, field: str, default: int = 0) -> float:
        """Safely get numeric value from user dict, converting empty strings to default."""
        value = user.get(field, default)
        if value == '':  # Handle empty strings
            return float(default)
        try:
            return float(value)
        except (ValueError, TypeError):
            return float(default)

    def calculate_similarities(self, user1: Dict, user2: Dict) -> Dict[str, float]:
        """Calculate various similarity metrics between users."""
        try:
            # Skills similarity (Jaccard)
            skills1 = set(filter(None, user1.get('skills', [])))  # Remove empty strings
            skills2 = set(filter(None, user2.get('skills', [])))
            skill_similarity = len(skills1.intersection(skills2)) / len(skills1.union(skills2)) if skills1 or skills2 else 0

            # Experience vector similarity
            exp_metrics = {
                'hackathons': 'hackathons_participated',
                'repos': 'total_repositories',
                'contributions': 'total_contributions'
            }
            
            # Safely get numeric values
            vector1 = [self.safe_get_numeric(user1, metric) for metric in exp_metrics.values()]
            vector2 = [self.safe_get_numeric(user2, metric) for metric in exp_metrics.values()]
            
            # Handle zero vectors
            if all(v == 0 for v in vector1) and all(v == 0 for v in vector2):
                exp_similarity = 0.0
            else:
                vector1_arr = np.array(vector1).reshape(1, -1)
                vector2_arr = np.array(vector2).reshape(1, -1)
                
                # Only normalize if we have non-zero values
                if np.any(vector1_arr) or np.any(vector2_arr):
                    combined = np.vstack([vector1_arr, vector2_arr])
                    normalized = self.scaler.fit_transform(combined)
                    exp_similarity = cosine_similarity(normalized[0].reshape(1, -1), 
                                                    normalized[1].reshape(1, -1))[0][0]
                else:
                    exp_similarity = 0.0

            return {
                'skill_similarity': skill_similarity,
                'experience_similarity': exp_similarity,
                'overall_score': (skill_similarity * 0.6) + (exp_similarity * 0.4)
            }
        except Exception as e:
            self.logger.error(f"Error calculating similarities: {str(e)}")
            return {
                'skill_similarity': 0.0,
                'experience_similarity': 0.0,
                'overall_score': 0.0
            }

    def format_recommendation(self, user: Dict, similarities: Dict) -> Dict:
        """Format user data and similarities for frontend display."""
        return {
            "id": str(user['_id']),
            "cardContent": {
                "header": {
                    "username": user.get('username', ''),
                    "college": user.get('college', ''),
                    "matchScore": f"{similarities['overall_score'] * 100:.1f}%"
                },
                "body": {
                    "skills": list(filter(None, user.get('skills', []))),  # Remove empty strings
                    "experience": {
                        "hackathons": self.safe_get_numeric(user, 'hackathons_participated'),
                        "githubStats": {
                            "repos": self.safe_get_numeric(user, 'total_repositories'),
                            "contributions": self.safe_get_numeric(user, 'total_contributions')
                        }
                    }
                },
                "footer": {
                    "similarityMetrics": {
                        "skillMatch": f"{similarities['skill_similarity'] * 100:.1f}%",
                        "experienceMatch": f"{similarities['experience_similarity'] * 100:.1f}%"
                    }
                }
            }
        }

    def get_recommendations(self, user_id: str, limit: int = 6) -> Dict:
        """Get and format team recommendations."""
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

            # Calculate similarities and format recommendations
            recommendations = []
            for user in all_users:
                try:
                    similarities = self.calculate_similarities(target_user, user)
                    recommendation = self.format_recommendation(user, similarities)
                    recommendations.append(recommendation)
                except Exception as e:
                    self.logger.error(f"Error processing user {user.get('_id')}: {str(e)}")
                    continue

            # Sort by match score and limit results
            recommendations.sort(
                key=lambda x: float(x['cardContent']['header']['matchScore'].rstrip('%')),
                reverse=True
            )
            recommendations = recommendations[:limit]

            # Store recommendations in database
            self._store_recommendations(user_id, recommendations)

            return {
                "status": "success",
                "recommendations": recommendations
            }

        except Exception as e:
            self.logger.error(f"Error getting recommendations: {str(e)}")
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
            "message": "User ID not provided"
        }))
        sys.exit(1)
    
    recommender = TeamRecommender()
    result = recommender.get_recommendations(sys.argv[1])
    print(json.dumps(result))