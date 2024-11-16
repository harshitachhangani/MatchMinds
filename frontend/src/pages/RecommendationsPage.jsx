import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProfileCardRecommend from "../components/ProfileCardRecommend";
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
                            <ProfileCardRecommend 
                                key={rec.id}
                                user={rec}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}