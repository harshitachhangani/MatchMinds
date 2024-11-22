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
from groq import Groq
from dotenv import load_dotenv
import itertools  # For generating permutations

class TeamRecommender:
    def __init__(self, 
                 mongo_uri: str = os.getenv("MONGO_URI"),
                 groq_key: str = os.getenv("GROQ_API_KEY")):
        self.mongo_uri = mongo_uri
        self.scaler = StandardScaler()
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
        
        # Initialize Groq Llama-3 client
        if not groq_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        self.groq_client = Groq(api_key=groq_key)

    def generate_skills(self, prob_statement: str) -> List[str]:
        """Generate technology skills based on problem statement using Llama-3."""
        try:
            query = (f"Given the following hackathon problem statement: '{prob_statement}', "
                    "provide a list of specific technologies in JSON array format required to develop "
                    "a comprehensive solution. Provide only the array of technologies, without additional text.")
            
            # Create chat completion
            completion = self.groq_client.chat.completions.create(
                model="gemma2-9b-it",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that provides a list of specific technologies in array format ONLY."},
                    {"role": "user", "content": query}
                ],
                temperature=0.7,
                max_tokens=700,
                top_p=1,
            )
            
            # Extract response text
            skills_text = completion.choices[0].message.content.strip()
            
            # Clean and parse the JSON array
            skills_text = skills_text.replace('```json', '').replace('```', '').strip()
            
            try:
                skills_array = json.loads(skills_text)
            except json.JSONDecodeError:
                # Fallback parsing for potential non-standard JSON
                skills_text = skills_text.replace("'", '"')
                skills_array = json.loads(skills_text)
            
            # Clean up skills
            skills = [skill.split('//')[0].strip() for skill in skills_array]
            skills = [skill for skill in skills if skill]
            
            return skills
        except Exception as e:
            self.logger.error(f"Error generating skills: {str(e)}")

    def get_user_by_id(self, user_id: str, prob_statement: Optional[str] = None) -> Optional[Dict]:
        """Fetch user from MongoDB by ID without updating their skills in the database."""
        try:
            client = MongoClient(self.mongo_uri)
            db = client.mydb
            user_id_obj = ObjectId(user_id)
            user = db.users.find_one({"_id": user_id_obj})
            
            # Only generate skills if a problem statement is provided, 
            # but don't store them in the database.
            if prob_statement:
                generated_skills = self.generate_skills(prob_statement)
                # Use the generated skills temporarily without saving them to the user record
                user['skills'] = generated_skills
            
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
        
    def generate_skill_combinations(self, user_skills: List[str], recommended_skills: List[str]) -> List[List[str]]:
        """Generate skill combinations that match user's existing skills with the recommended ones."""
        # Find the intersection of user skills and recommended skills
        common_skills = set(user_skills).intersection(recommended_skills)
        
        # Generate all possible non-empty permutations of the recommended skills that include the common skills
        skill_combinations = []
        if common_skills:
            remaining_skills = [skill for skill in recommended_skills if skill not in common_skills]
            for r in range(1, len(remaining_skills) + 1):
                for comb in itertools.combinations(remaining_skills, r):
                    skill_combinations.append(list(common_skills) + list(comb))
        else:
            skill_combinations = [[skill] for skill in recommended_skills]

        return skill_combinations

    def calculate_similarities(self, user1: Dict, user2: Dict) -> Dict[str, float]:
        """Calculate similarities based on skills (Jaccard similarity)"""
        try:
            # Only calculate skill similarity based on recommended skills
            skills1 = set(filter(None, user1.get('skills', [])))
            skills2 = set(filter(None, user2.get('skills', [])))
            
            # Calculate skill similarity
            similar_skills = len(skills1.intersection(skills2))
            total_skills = len(skills1.union(skills2))
            
            # Skill similarity percentage
            skill_match = similar_skills / total_skills * 100 if total_skills > 0 else 0
            
            # Complementary skills calculation
            remaining_skills = list(skills2 - skills1)
            complementary_skills_ratio = len(remaining_skills) / len(skills2) * 100 if skills2 else 0
            
            # Experience metrics (simplified)
            experience_match = min(
                self.safe_get_numeric(user1, 'hackathonsParticipated', 0),
                self.safe_get_numeric(user2, 'hackathonsParticipated', 0)
            ) / max(
                self.safe_get_numeric(user1, 'hackathonsParticipated', 0),
                self.safe_get_numeric(user2, 'hackathonsParticipated', 0)
            ) * 100 if (user1.get('hackathonsParticipated') or user2.get('hackathonsParticipated')) else 0
            
            # GitHub repository match (simplified)
            repo_match = min(
                self.safe_get_numeric(user1, 'githubRepos', 0),
                self.safe_get_numeric(user2, 'githubRepos', 0)
            ) / max(
                self.safe_get_numeric(user1, 'githubRepos', 0),
                self.safe_get_numeric(user2, 'githubRepos', 0)
            ) * 100 if (user1.get('githubRepos') or user2.get('githubRepos')) else 0
            
            return {
                'skill_similarity': skill_match,
                'overall_score': skill_match,
                'skill_match': round(skill_match, 1),
                'complementary_skills': round(complementary_skills_ratio, 1),
                'experience_match': round(experience_match, 1),
                'repo_match': round(repo_match, 1)
            }
        except Exception as e:
            self.logger.error(f"Error calculating similarities: {str(e)}")
            return {
                'skill_similarity': 0.0,
                'overall_score': 0.0,
                'skill_match': 0.0,
                'complementary_skills': 0.0,
                'experience_match': 0.0,
                'repo_match': 0.0
            }
        
    def format_recommendation(self, user: Dict, similarities: Dict) -> Dict:
        """Format user data and similarities for frontend display."""
        
        # Extract the necessary data from the user
        hackathons_participated = user.get('hackathons_participated', 0)
        achievements_count = user.get('achievements_count', 0)
        total_repositories = user.get('total_repositories', 0)
        total_contributions = user.get('total_contributions', 0)
        
        return {
            "id": str(user['_id']),
            "cardContent": {
                "header": {
                    "username": user.get('username', ''),
                    "college": user.get('college', ''),
                    "matchScore": f"{similarities['overall_score']:.1f}%"
                },
                "body": {
                    "skills": list(filter(None, user.get('skills', []))),
                    "experience": {
                        "hackathons": hackathons_participated,
                        "githubStats": {
                            "repos": total_repositories,
                            "contributions": total_contributions,
                            "achievements": achievements_count
                        }
                    }
                },
                "footer": {
                    "similarityMetrics": {
                        "skillMatch": similarities.get('skill_match', 0),
                        "complementarySkills": similarities.get('complementary_skills', 0),
                        "experienceMatch": similarities.get('experience_match', 0),
                        "repoMatch": similarities.get('repo_match', 0)
                    }
                }
            }
        }

    
    def get_recommendations(self, user_id: str, prob_statement: Optional[str] = None, limit: int = 9) -> Dict:
        """Get and format team recommendations with skill-based combinations."""
        try:
            # Get target user with potentially updated skills
            target_user = self.get_user_by_id(user_id, prob_statement)
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

            # Get the skills recommended by Gemini
            recommended_skills = self.generate_skills(prob_statement)

            # Generate skill combinations based on the user's existing skills and recommended skills
            skill_combinations = self.generate_skill_combinations(target_user.get('skills', []), recommended_skills)

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
    # Load environment variables
    load_dotenv()
    
    # Check if the correct number of arguments are provided
    if len(sys.argv) != 3:
        print(json.dumps({
            "status": "error",
            "message": "Both User ID and Problem Statement are required"
        }))
        sys.exit(1)
    
    user_id = sys.argv[1]
    prob_statement = sys.argv[2]

    # Initialize the recommender
    recommender = TeamRecommender()
    
    # Get recommendations from TeamRecommender
    result = recommender.get_recommendations(user_id, prob_statement)
    
    # Print the result as a formatted JSON response
    print(json.dumps(result, indent=2))
