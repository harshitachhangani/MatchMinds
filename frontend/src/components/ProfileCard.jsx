import React, { useState } from 'react';
import ProfilePic from "../assets/pfp.png";
import { FiUserPlus } from "react-icons/fi";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { CiTwitter } from "react-icons/ci";
import { FiMessageCircle } from "react-icons/fi";
import { FaTools, FaBriefcase } from 'react-icons/fa';

const ProfileCard = ({ user, currUser }) => {

    const [currSelectedUser, setCurrSelectedUser] = useState("")
    console.log(user, "userThisss")
    console.log(currUser, "currUserThisss")

    const addFriend = (e) => {   
        const currElement = e.target.parentElement.parentElement.parentElement.children[0].innerText
        console.log(currElement, "curele")
        console.log(currUser.username, "currUser")

        fetch('http://localhost:5000/userCRUD/addFriend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: currUser.username,
                friend: currElement
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert("friend added")
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    return (
        <div className="bg-[#1A2233] text-white rounded-lg p-4 shadow-lg">
            <div className="hidden">
                {user.username}
            </div>
            <div className="flex flex-col items-center">
                {
                    user.image ?
                    <img
                        src={user.image}
                        alt="Profile"
                        className="rounded-full h-32 w-32"
                    />
                    :
                    <img
                        src={ProfilePic}
                        alt="Profile"
                        className="rounded-full h-32 w-32"
                    />
                }
                <p className="mt-2 text-xl font-bold">{user.fullName}</p>
            </div>
    
            {/* Skills Section */}
            <div className="mt-4">
                <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <FaTools className="mr-2 text-blue-400" /> Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                    {user.skills && user.skills.map((skill, index) => (
                        <span 
                            key={index}
                            className="bg-gray-600 text-blue-400 px-4 py-1 rounded-md text-sm hover:bg-blue-600 hover:text-white transition-all"
                        >
                            {skill && skill.length > 7 ? `${skill.substring(0, 7)}...` : skill}
                        </span>
                    ))}
                </div>
            </div>
    
            {/* Experience Section */}
            <div className="mt-4">
                <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <FaBriefcase className="mr-2 text-blue-400" /> Experience
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-400">Hackathons</p>
                        <p className="text-white font-bold">
                            {user.hackathons_participated}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-400">Achievements</p>
                        <p className="text-white font-bold">
                            {user.achievements_count}
                        </p>
                    </div>
                    {/* Add more experience sections as needed */}
                </div>
            </div>
    
            {/* GitHub Stats Section */}
            <div className="mt-4">
                <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <FaGithub className="mr-2 text-blue-400" /> GitHub Stats
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-400">Repositories</p>
                        <p className="text-white font-bold">
                            {user.total_repositories}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-400">Contributions</p>
                        <p className="text-white font-bold">
                            {user.total_contributions}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex justify-evenly w-full">
                <button className="hover:bg-blue-200 text-white rounded-full p-2 flex items-center text-lg" onClick={addFriend}>
                    <FiUserPlus className="text-2xl" />
                </button>
                <a href={`https://github.com/${user.github_username}`} target="_blank" rel="noopener noreferrer" className="hover:bg-blue-200 text-white rounded-full p-2 flex items-center text-lg">
                    <FaGithub className="text-2xl" />
                </a>
            </div>

        </div>
    );
};

export default ProfileCard;
