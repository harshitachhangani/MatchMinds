import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { CiBookmarkPlus } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import ProfileCard from "../components/ProfileCard";
import { Link } from "react-router-dom";
import { FaBookmark } from "react-icons/fa";

export default function Dashboard() {
    const [hackathons, setHackathons] = useState([]);
    const [currUser, setCurrUser] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchedUser, setSearchedUser] = useState("");
    const [interestedHackathons, setInterestedHackathons] = useState([]);

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
            .then((data) => setCurrUser(data.user))
            .catch((err) => console.log(err));

        // Fetch hackathons
        fetch("http://localhost:5000/hackathonsCRUD/getAllHackathons")
            .then((response) => response.json())
            .then((data) => setHackathons(data));

        // Fetch user's interested hackathons
        fetch("http://localhost:5000/userCRUD/getUserById/" + currUser.username)
            .then((res) => res.json())
            .then((userData) => {
                setInterestedHackathons(userData.hackathons_interested || []);
            })
            .catch((err) => console.log(err));

        // Fetch all users
        fetch("http://localhost:5000/userCRUD/getUsers", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setAllUsers(data);
                setFilteredUsers(data);
            })
            .catch((err) => console.log(err));
    }, []);

    // const addHackathonInterested = (e) => {
    //     const currElement = e.target.parentElement.parentElement.children[0].innerText;

    //     fetch("http://localhost:5000/hackathonsCRUD/updateHackathon", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             username: currUser.username,
    //             hackName: currElement,
    //         }),
    //     })
    //         .then((response) => response.json())
    //         .then((data) => console.log(data))
    //         .catch((error) => console.error("Error:", error));
    // };

    const addHackathonInterested = (e) => {
        const currElement = e.target.parentElement.parentElement.children[0].innerText;
    
        fetch("http://localhost:5000/userCRUD/addHackathonInterested", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: currUser.username,
                hackathon: currElement,
            }),
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error("Error:", error));
    };

    const searching = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchedUser(searchTerm);

        // Filter based on username, skills, or bio
        const temp = allUsers.filter((user) => {
            const matchesUsername = user.username.toLowerCase().includes(searchTerm);
            const matchesSkills = user.skills.some((skill) => skill.toLowerCase().includes(searchTerm));
            const matchesBio = user.bio && user.bio.toLowerCase().includes(searchTerm);
            return matchesUsername || matchesSkills || matchesBio;
        });

        setFilteredUsers(temp);
    };

    return (
        <div className="bg-[#0F172A] h-screen overflow-y-scroll">
            <Navbar />
            <div className="flex gap-7 h-full pb-10">
                <div className="bg-[#1A2233] mt-10 ml-7 rounded-3xl w-1/3 h-full">
                    <div className="p-5">
                        <h1 className="text-2xl text-white font-bold tracking-wide mb-8">
                            Hey There! Browse Your Hackathons{" "}
                        </h1>
                        {hackathons.map((hackathon, i) => (
                            <div
                                key={i}
                                className="border-2 border-green-800 rounded-xl p-2 w-full mb-2"
                            >
                                <div className="flex justify-between items-center text-white">
                                    <Link to={hackathon.link} target="blank">
                                        <h3 className="hover:text-green-900">{hackathon.name}</h3>
                                    </Link>
                                    <button onClick={addHackathonInterested}>
                                        {interestedHackathons.includes(hackathon.name) ? (
                                            <FaBookmark size={20} className="text-white" />
                                        ) : (
                                            <CiBookmarkPlus size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-10 rounded-xl w-full pr-10 h-5/6">
                    <div className="flex border-black rounded-2xl mb-10">
                        <input
                            className="p-3 flex-grow border-0 outline-none bg-[#1A2233]"
                            type="text"
                            placeholder="Search for your mate"
                            onChange={searching}
                            value={searchedUser}
                        />
                        <div className="bg-[#1A2233] text-white p-3">
                            <FiSearch size={24} />
                        </div>
                    </div>
                    <div className=" h-full grid grid-cols-3 gap-10 overflow-y-scroll">
                        {filteredUsers.map((user, i) => (
                            user.username !== currUser.username &&
                            <ProfileCard user={user} currUser={currUser} key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
