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
            user = db.users.find_one({"_id": user_id_obj})
            
            # Try to load generated skills if they exist
            try:
                with open('generated_skills.json', 'r') as f:
                    generated_skills = json.load(f)
                    # Update user's skills with generated skills
                    if generated_skills:
                        user['skills'] = generated_skills
                        # Update the user in database with new skills
                        db.users.update_one(
                            {"_id": user_id_obj},
                            {"$set": {"skills": generated_skills}}
                        )
            except FileNotFoundError:
                self.logger.info("No generated skills found, using existing skills")
            except json.JSONDecodeError:
                self.logger.error("Error reading generated skills")
            
            return user
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
            skills1 = set(filter(None, user1.get('skills', [])))
            skills2 = set(filter(None, user2.get('skills', [])))
            
            # Calculate both similar and complementary skills
            similar_skills = len(skills1.intersection(skills2))
            total_skills = len(skills1.union(skills2))
            
            # Similar skills ratio (weighted more heavily)
            similar_skills_ratio = similar_skills / total_skills if total_skills > 0 else 0
            
            # Complementary skills ratio (weighted less heavily)
            complementary_skills = total_skills - similar_skills
            complementary_skills_ratio = complementary_skills / total_skills if total_skills > 0 else 0

            # Experience vector similarity with additional metrics
            exp_metrics = {
                'hackathons': 'hackathons_participated',
                'repos': 'total_repositories',
                'contributions': 'total_contributions',
                'achievements': 'achievements_count'
            }
            
            # Safely get numeric values
            vector1 = [self.safe_get_numeric(user1, metric) for metric in exp_metrics.values()]
            vector2 = [self.safe_get_numeric(user2, metric) for metric in exp_metrics.values()]
            
            # Calculate repository score (normalized comparison)
            repos1 = self.safe_get_numeric(user1, 'total_repositories')
            repos2 = self.safe_get_numeric(user2, 'total_repositories')
            max_repos = max(repos1, repos2)
            repo_similarity = min(repos1, repos2) / max_repos if max_repos > 0 else 0

            # Calculate experience similarity
            if all(v == 0 for v in vector1) and all(v == 0 for v in vector2):
                exp_similarity = 0.0
            else:
                vector1_arr = np.array(vector1).reshape(1, -1)
                vector2_arr = np.array(vector2).reshape(1, -1)
                
                if np.any(vector1_arr) or np.any(vector2_arr):
                    combined = np.vstack([vector1_arr, vector2_arr])
                    normalized = self.scaler.fit_transform(combined)
                    exp_similarity = cosine_similarity(normalized[0].reshape(1, -1), 
                                                    normalized[1].reshape(1, -1))[0][0]
                else:
                    exp_similarity = 0.0

            # Calculate final scores with updated weights
            skill_score = (similar_skills_ratio * 0.4) + (complementary_skills_ratio * 0.1)
            
            # Calculate normalized contribution and achievement scores
            contribution_score = ((vector1[2] + vector2[2]) / 2000) * 0.05
            achievement_score = ((vector1[3] + vector2[3]) / 10) * 0.05
            
            exp_score = (exp_similarity * 0.2) + (repo_similarity * 0.2) + contribution_score + achievement_score

            return {
                'skill_similarity': similar_skills_ratio,
                'complementary_skills': complementary_skills_ratio,
                'experience_similarity': exp_similarity,
                'repo_similarity': repo_similarity,
                'overall_score': skill_score + exp_score
            }
            
        except Exception as e:
            self.logger.error(f"Error calculating similarities: {str(e)}")
            return {
                'skill_similarity': 0.0,
                'complementary_skills': 0.0,
                'experience_similarity': 0.0,
                'repo_similarity': 0.0,
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
                        "skillMatch": f"{similarities['skill_similarity'] * 100:.1f}%",
                        "complementarySkills": f"{similarities['complementary_skills'] * 100:.1f}%",
                        "experienceMatch": f"{similarities['experience_similarity'] * 100:.1f}%",
                        "repoMatch": f"{similarities['repo_similarity'] * 100:.1f}%"
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