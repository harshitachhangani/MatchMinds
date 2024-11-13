import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";

export default function RecommendationsPage() {
    const [recommendedUsers, setRecommendedUsers] = useState([]);
    const [currUser, setCurrUser] = useState({});

    useEffect(() => {
        // Fetch current user data
        fetch("http://localhost:5000/auth/getLoggedInUser", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: document.cookie.split("; ").find((row) => row.startsWith("LOGIN_INFO")).split("=")[1],
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setCurrUser(data.user);
                return data.user.username;
            })
            .then((username) => {
                // Fetch recommended users
                fetch(`http://localhost:5000/userCRUD/getRecommendedUsers/${username}`)
                    .then((res) => res.json())
                    .then((data) => setRecommendedUsers(data))
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className="bg-[#0F172A] text-white h-screen overflow-y-scroll">
            <Navbar />
            <div className="mt-10 p-10">
                <h1 className="text-2xl font-bold mb-8">Recommended Users</h1>
                <div className="grid grid-cols-3 gap-10">
                    {recommendedUsers.map((user, i) => (
                        <ProfileCard user={user} currUser={currUser} key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
