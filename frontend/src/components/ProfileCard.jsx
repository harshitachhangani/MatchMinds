import React, { useState } from 'react';
import ProfilePic from "../assets/pfp.png";
import { FiUserPlus } from "react-icons/fi";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { CiTwitter } from "react-icons/ci";
import { FiMessageCircle } from "react-icons/fi";

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
                        className="rounded-full h-20 w-20"
                    />
                    :
                    <img
                        src={ProfilePic}
                        alt="Profile"
                        className="rounded-full h-20 w-20"
                    />
                }
                <p className="mt-2 text-xl font-bold">{user.fullName}</p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
                {user.skills && user.skills.map((skill, index) => (
                    <div
                        key={index}
                        className="border-2 border-gray-300 rounded-3xl hover:border-gray-500 text-center"
                    >
                        {skill && skill.length > 5 ? `${skill.substring(0, 5)}...` : skill}
                    </div>
                ))}
            </div>
            <div className="mt-4 flex justify-between">
                <button className="hover:bg-green-200 text-white rounded-full p-2 flex items-center" onClick={addFriend}>
                    <FiUserPlus />
                </button>
                {/* Add LinkedIn URL in user JSON data */}
                <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:bg-green-200 text-white rounded-full p-2 flex items-center">
                    <FaLinkedin />
                </a>
                {/* Add GitHub URL in user JSON data */}
                <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:bg-green-200 text-white rounded-full p-2 flex items-center">
                    <FaGithub />
                </a>
            </div>
        </div>
    );
};

export default ProfileCard;
