import sys
import json
import numpy as np
from pymongo import MongoClient
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
import os
from bson import ObjectId

def get_recommendations(user_id, mongo_uri=os.getenv("MONGO_URI")):
    try:
        # Connect to MongoDB Atlas
        client = MongoClient(mongo_uri)
        db = client.mydb  # your database name
        
        # Convert string ID to ObjectId
        try:
            user_id = ObjectId(user_id)
        except:
            return json.dumps({
                "status": "error",
                "message": f"Invalid user ID format: {user_id}"
            })
        
        # Get target user
        target_user = db.users.find_one({"_id": user_id})
        if not target_user:
            return json.dumps({
                "status": "error",
                "message": f"User not found with ID: {user_id}"
            })
        
        # Get all other users
        all_users = list(db.users.find({"_id": {"$ne": user_id}}))
        
        if not all_users:
            return json.dumps({
                "status": "error",
                "message": "No other users found for comparison"
            })
        
        # Calculate similarity scores
        recommendations = []
        for user in all_users:
            # Skill similarity
            target_skills = set(target_user.get('skills', []))
            user_skills = set(user.get('skills', []))
            skill_overlap = len(target_skills.intersection(user_skills)) / len(target_skills.union(user_skills)) if target_skills or user_skills else 0
            
            # Experience similarity (normalized)
            target_exp = np.array([
                target_user.get('hackathons_participated', 0),
                target_user.get('total_repositories', 0),
                target_user.get('total_contributions', 0)
            ])
            
            user_exp = np.array([
                user.get('hackathons_participated', 0),
                user.get('total_repositories', 0),
                user.get('total_contributions', 0)
            ])
            
            # Normalize experience metrics
            scaler = MinMaxScaler()
            exp_combined = np.vstack([target_exp, user_exp])
            exp_normalized = scaler.fit_transform(exp_combined.reshape(-1, 1)).reshape(2, -1)
            
            # Calculate experience similarity using cosine similarity
            exp_similarity = cosine_similarity(exp_normalized[0].reshape(1, -1), 
                                            exp_normalized[1].reshape(1, -1))[0][0]
            
            # Calculate overall match score (weighted average)
            overall_score = (skill_overlap * 0.6) + (exp_similarity * 0.4)
            
            # Create recommendation object
            recommendations.append({
                "id": str(user['_id']),
                "cardContent": {
                    "header": {
                        "username": user.get('username', ''),
                        "college": user.get('college', ''),
                        "matchScore": f"{overall_score * 100:.1f}%"
                    },
                    "body": {
                        "skills": user.get('skills', []),
                        "experience": {
                            "hackathons": user.get('hackathons_participated', 0),
                            "githubStats": {
                                "repos": user.get('total_repositories', 0),
                                "contributions": user.get('total_contributions', 0)
                            }
                        }
                    },
                    "footer": {
                        "similarityMetrics": {
                            "skillMatch": f"{skill_overlap * 100:.1f}%",
                            "experienceMatch": f"{exp_similarity * 100:.1f}%"
                        }
                    }
                }
            })
        
        # Sort recommendations by overall match score
        recommendations.sort(key=lambda x: float(x['cardContent']['header']['matchScore'].rstrip('%')), reverse=True)
        
        # Take top 6 recommendations
        recommendations = recommendations[:6]
        
        return json.dumps({
            "status": "success",
            "recommendations": recommendations
        })
        
    except Exception as e:
        return json.dumps({
            "status": "error",
            "message": str(e)
        })

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({
            "status": "error",
            "message": "User ID not provided"
        }))
        sys.exit(1)
    
    user_id = sys.argv[1]
    result = get_recommendations(user_id)
    print(result)