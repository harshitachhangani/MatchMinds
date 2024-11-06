import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { CiBookmarkPlus } from "react-icons/ci";
import { CiBookmarkCheck } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import ProfileCard from "../components/ProfileCard";
import { Link } from "react-router-dom";

export default function Dashboard() {

    const [hackathons, setHackathons] = useState([]);
    const [currUser, setCurrUser] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [selectedHackathon, setSelectedHackathon] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
       // fetch("https://teammatch-backend.onrender.com/auth/getLoggedInUser", {
        fetch("https://localhost:5000/auth/getLoggedInUser", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: document.cookie.split("; ").find((row) => row.startsWith("LOGIN_INFO")).split("=")[1],
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setCurrUser(data.user);
                // console.log(data, "DATA");
            })
            .catch((err) => {
                console.log(err);
            });

      //  fetch("https://teammatch-backend.onrender.com/hackathonsCRUD/getAllHackathons")
      fetch("http://localhost:5000/hackathonsCRUD/getAllHackathons")
            .then((response) => response.json())
            .then((data) => {
                setHackathons(data);
                // console.log(data, "hackathons");
            });

       // fetch("https://teammatch-backend.onrender.com/userCRUD/getUsers", {
        fetch("http://localhost:5000/userCRUD/getUsers", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setAllUsers(data);
                setFilteredUsers(data);
                // console.log(data, "allUsers");
            })
            .catch((err) => {
                console.log(err);
            });

    }, []);


    const addHackathonInterested = (e) => {

        const currElement = e.target.parentElement.parentElement.children[0].innerText

        //fetch('https://teammatch-backend.onrender.com/hackathonsCRUD/updateHackathon', {
            fetch('http://localhost:5000/hackathonsCRUD/updateHackathon', {
            
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: currUser.username,
                hackName: currElement
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const [searchedUser, setSearchedUser] = useState("");

    const searching = (e) => {
        if (e.target.value === "") {
            setFilteredUsers(allUsers);
        }
        setSearchedUser(e.target.value);
        const temp = allUsers.filter((user) => user.skills.map((skill) => skill.toLowerCase()).includes(e.target.value.toLowerCase()));
        setFilteredUsers(temp);
        console.log(temp, "temp");
    }



    return (
        <div className="bg-green-100 h-screen overflow-y-scroll">
            <Navbar />
            <div className="flex gap-7 h-full pb-10">
                <div className="bg-white mt-10 ml-7 rounded-3xl w-1/3 h-full">
                    <div className="p-5">
                        <h1 className="text-2xl font-bold tracking-wide mb-8">
                            Hey There! Browse Your Hackathons{" "}
                        </h1>
                        {hackathons.map((hackathon, i) => (
                            <div
                                key={i}
                                className="border-2 border-green-800 rounded-xl p-2 w-full mb-2"
                            >
                                <div className="flex justify-between items-center">
                                    <Link to={hackathon.link} target="blank">
                                        <h3 className="hover:text-green-900">{hackathon.name} </h3>
                                    </Link>
                                    <button onClick={addHackathonInterested}>
                                        <CiBookmarkPlus size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-10 rounded-xl w-full pr-10 h-5/6">
                    <div className="flex border-black rounded-2xl mb-10">
                        <input
                            className="p-3 flex-grow border-0 outline-none	"
                            type="text"
                            placeholder="Search for your mate"
                            onChange={searching}
                            />
                        <div className="bg-white p-3 	">
                            <FiSearch size={24} />
                        </div>
                    </div>
                    {/* <div className="p-10"> */}
                        <div className="h-full grid grid-cols-3 gap-10 overflow-y-scroll ">
                            {filteredUsers.map((user, i) => (
                                user.username !== currUser.username &&
                                <ProfileCard user={user} currUser={currUser} key={i} />
                            ))}
                        </div>
                    {/* </div> */}
                </div>
            </div>
        </div>
    );
};

