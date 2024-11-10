import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfilePic from "../assets/pfp.png";
import TeamDetails from "../components/TeamDetails";
import AddSkills from "../components/AddSkills";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState(false); // Initialize the edit state
  const [updatedDetails, setUpdatedDetails] = useState({
    fullName: "",
    description: "",
    image: "",
  });
  const [reader, setReader] = useState();
  const [hackathon, setHackathon] = useState({
    name: "",
    website: "",
    venue: "",
    teamSize: "",
  });
  const [currUser, setCurrUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/auth/getLoggedInUser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: document.cookie
          .split("; ")
          .find((row) => row.startsWith("LOGIN_INFO"))
          .split("=")[1],
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCurrUser(data.user);
      })
      .catch((err) => console.log(err));

    setReader(new FileReader());
  }, []);

  const saveDetails = () => {
    fetch("http://localhost:5000/userCRUD/updateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: currUser.username,
        image: updatedDetails.image,
        bio: updatedDetails.description,
        fullName: updatedDetails.fullName,
      }),
    })
      .then((res) => res.json())
      .then(() => window.location.reload())
      .catch((err) => console.log(err));
  };

  const uploadImage = (e) => {
    reader.onload = (e) => {
      setUpdatedDetails({ ...updatedDetails, image: e.target.result });
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleInputChange = (event) => {
    setHackathon({ ...hackathon, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:5000/hackathonsCRUD/createHackathon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: currUser.username,
        name: hackathon.name,
        link: hackathon.website,
        problemStatement: hackathon.problemStatement,
      }),
    })
      .then((res) => res.json())
      .then(() => console.log("Hackathon created"))
      .catch((err) => console.log(err));
  };

  const logout = () => {
    document.cookie = "LOGIN_INFO=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

  return (
    <div className="bg-[#0F172A] min-h-screen text-gray-300">
      <Navbar />
      <div className="flex gap-10 p-6">
        <div className="bg-gray-800 p-6 rounded-xl w-1/4 flex flex-col items-center shadow-lg">
          <img
            src={currUser.image || ProfilePic}
            className="cursor-pointer rounded-full h-44"
            alt="Profile"
          />
          <h1 className="text-3xl font-semibold tracking-wide mt-6 text-white">{currUser.fullName}</h1>
          <p className="mt-2 text-gray-400">{currUser.email}</p>
          <p className="mt-2 text-gray-500">{currUser.bio || "Update Bio..."}</p>

          <div className="mt-5 flex gap-4">
            <button
              className="bg-green-700 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              onClick={() => setEdit((prev) => !prev)}
            >
              {edit ? "Done" : "Edit Profile"}
            </button>
            <button
              className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              onClick={logout}
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="rounded-xl w-3/4 bg-gray-900 p-6 shadow-lg">
          <AddSkills user={currUser} />
          <button
            className="bg-blue-800 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mt-6 transition-colors"
            onClick={() => setShowForm(!showForm)}
          >
            New Hackathon
          </button>
          {showForm && (
            <form onSubmit={handleSubmit} className="mt-6 bg-gray-800 p-6 rounded-lg shadow-md">
              <input
                type="text"
                name="name"
                placeholder="Hackathon Name"
                value={hackathon.name}
                onChange={handleInputChange}
                className="w-full p-2 mb-3 bg-gray-700 rounded-lg placeholder-gray-400 text-gray-300"
              />
              <input
                type="text"
                name="website"
                placeholder="Website"
                value={hackathon.website}
                onChange={handleInputChange}
                className="w-full p-2 mb-3 bg-gray-700 rounded-lg placeholder-gray-400 text-gray-300"
              />
              <textarea
                name="problemStatement"
                placeholder="Problem Statement"
                value={hackathon.problemStatement}
                onChange={handleInputChange}
                className="w-full p-2 mb-3 bg-gray-700 rounded-lg placeholder-gray-400 text-gray-300"
              />
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Submit Hackathon
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
