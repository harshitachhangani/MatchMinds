import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Loader2, Github, Award, Code, Users } from "lucide-react";

export default function RecommendationsPage() {
    const [recommendedUsers, setRecommendedUsers] = useState([]);
    const [currUser, setCurrUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Get auth token
                const token = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("LOGIN_INFO"))
                    ?.split("=")[1];
                
                if (!token) {
                    throw new Error("Not authenticated");
                }
                
                // Get current user
                const userRes = await fetch("http://localhost:5000/auth/getLoggedInUser", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                });
                
                if (!userRes.ok) throw new Error("Failed to fetch user data");
                const userData = await userRes.json();
                setCurrUser(userData.user);
                
                // Get recommendations using the user's ID
                const recRes = await fetch(`http://localhost:5000/api/recommendations/${userData.user._id}`, {
                    headers: {
                        Authorization: token,
                    },
                });
                
                if (!recRes.ok) {
                    const errorData = await recRes.json();
                    throw new Error(errorData.message || "Failed to fetch recommendations");
                }
                
                const recData = await recRes.json();
                
                if (recData.status === 'error') {
                    throw new Error(recData.message);
                }
                
                setRecommendedUsers(recData.recommendations);
                
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    const MetricBar = ({ percentage, color = "bg-blue-500" }) => {
        const width = parseFloat(percentage) || 0;
        return (
            <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                    className={`${color} h-2 rounded-full`} 
                    style={{ width: `${Math.min(width, 100)}%` }}
                />
            </div>
        );
    };

    return (
        <div className="bg-[#0F172A] text-white min-h-screen">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-8">Recommended Teammates</h1>
                
                {error ? (
                    <div className="text-center py-8">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : recommendedUsers.length === 0 ? (
                    <div className="text-center py-8">
                        <p>No recommendations found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendedUsers.map((rec) => (
                            <div key={rec.id} className="bg-[#1F2937] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                                {/* Header Section */}
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold">{rec.cardContent.header.username}</h3>
                                        <p className="text-sm text-gray-400">{rec.cardContent.header.college}</p>
                                    </div>
                                    <div className="bg-green-900/30 px-3 py-1 rounded-full">
                                        <p className="text-green-400 font-semibold">{rec.cardContent.header.matchScore}</p>
                                    </div>
                                </div>
                                
                                {/* Skills Section */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Code className="w-5 h-5 text-blue-400" />
                                        <h4 className="text-lg font-semibold">Skills</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {rec.cardContent.body.skills?.map((skill, index) => (
                                            <span 
                                                key={index}
                                                className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded-md text-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Experience Section */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="w-5 h-5 text-purple-400" />
                                        <h4 className="text-lg font-semibold">Experience</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-400 text-sm">Hackathons</p>
                                            <p className="text-lg font-semibold">{rec.cardContent.body.experience?.hackathons || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Achievements</p>
                                            <p className="text-lg font-semibold">{rec.cardContent.body.experience?.githubStats?.achievements || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* GitHub Stats */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Github className="w-5 h-5 text-orange-400" />
                                        <h4 className="text-lg font-semibold">GitHub Stats</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-400 text-sm">Repositories</p>
                                            <p className="text-lg font-semibold">{rec.cardContent.body.experience?.githubStats?.repos || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Contributions</p>
                                            <p className="text-lg font-semibold">{rec.cardContent.body.experience?.githubStats?.contributions || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Similarity Metrics */}
                                <div className="pt-4 border-t border-gray-700">
                                    <h5 className="text-sm font-semibold text-gray-400 mb-3">Similarity Metrics</h5>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-300">Similar Skills</span>
                                                <span className="text-gray-300">{rec.cardContent.footer.similarityMetrics?.skillMatch}</span>
                                            </div>
                                            <MetricBar percentage={rec.cardContent.footer.similarityMetrics?.skillMatch} color="bg-blue-500" />
                                        </div>
                                        
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-300">Complementary Skills</span>
                                                <span className="text-gray-300">{rec.cardContent.footer.similarityMetrics?.complementarySkills}</span>
                                            </div>
                                            <MetricBar percentage={rec.cardContent.footer.similarityMetrics?.complementarySkills} color="bg-purple-500" />
                                        </div>
                                        
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-300">Experience Match</span>
                                                <span className="text-gray-300">{rec.cardContent.footer.similarityMetrics?.experienceMatch}</span>
                                            </div>
                                            <MetricBar percentage={rec.cardContent.footer.similarityMetrics?.experienceMatch} color="bg-green-500" />
                                        </div>
                                        
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-300">Repository Match</span>
                                                <span className="text-gray-300">{rec.cardContent.footer.similarityMetrics?.repoMatch}</span>
                                            </div>
                                            <MetricBar percentage={rec.cardContent.footer.similarityMetrics?.repoMatch} color="bg-orange-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}