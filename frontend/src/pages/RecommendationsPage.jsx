import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Loader2 } from "lucide-react";

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
                            <div key={rec.id} className="bg-[#1F2937] rounded-lg p-6">
                                {/* Header Section */}
                                <div className="flex justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold">{rec.cardContent.header.username}</h3>
                                        <p className="text-sm text-gray-400">{rec.cardContent.header.college}</p>
                                    </div>
                                    <div>
                                        <p className="text-green-500 font-semibold">{rec.cardContent.header.matchScore}</p>
                                    </div>
                                </div>
                                
                                {/* Body Section */}
                                <div className="mb-4">
                                    <h4 className="text-lg font-semibold">Skills</h4>
                                    <ul className="list-disc pl-5 text-gray-300">
                                        {rec.cardContent.body.skills?.map((skill, index) => (
                                            <li key={index}>{skill}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mb-4">
                                    <h4 className="text-lg font-semibold">Experience</h4>
                                    <p className="text-gray-300">Hackathons: {rec.cardContent.body.experience?.hackathons || 0}</p>
                                    <p className="text-gray-300">Achievements: {rec.cardContent.body.experience?.achievements || 0}</p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="text-lg font-semibold">GitHub Stats</h4>
                                    <p className="text-gray-300">Repos: {rec.cardContent.body.githubStats?.repos || 0}</p>
                                    <p className="text-gray-300">Contributions: {rec.cardContent.body.githubStats?.contributions || 0}</p>
                                </div>
                                
                                {/* Footer Section */}
                                <div className="pt-4 border-t border-gray-700">
                                    <h5 className="text-sm text-gray-500">Similarity Metrics</h5>
                                    <p className="text-sm text-gray-300">Skill Match: {rec.cardContent.footer.similarityMetrics?.skillMatch || 'N/A'}</p>
                                    <p className="text-sm text-gray-300">Experience Match: {rec.cardContent.footer.similarityMetrics?.experienceMatch || 'N/A'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}