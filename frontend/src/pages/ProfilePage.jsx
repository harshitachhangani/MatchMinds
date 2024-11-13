// ProfilePage.js
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfilePic from "../assets/pfp.png";
import AddSkills from "../components/AddSkills";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState(false);
  const [currUser, setCurrUser] = useState({});
  const [updatedDetails, setUpdatedDetails] = useState({
    fullName: "",
    bio: "",
    image: "",
    college: "",
    location: "",
    github_username: "",
  });
  const [reader] = useState(new FileReader());
  const [hackathon, setHackathon] = useState({
    name: "",
    website: "",
    problemStatement: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("LOGIN_INFO"))
      ?.split("=")[1];

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/auth/getLoggedInUser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrUser(data.user);
          setUpdatedDetails({
            fullName: data.user.fullName || "",
            bio: data.user.bio || "",
            image: data.user.image || "",
            college: data.user.college || "",
            location: data.user.location || "",
            github_username: data.user.github_username || "",
          });
        } else {
          setError("Failed to load user data");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load user data");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleInputChange = (e) => {
    setUpdatedDetails({
      ...updatedDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleHackathonChange = (e) => {
    setHackathon({
      ...hackathon,
      [e.target.name]: e.target.value,
    });
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        setError("Image size should be less than 5MB");
        return;
      }
      reader.onload = (e) => {
        setUpdatedDetails({ ...updatedDetails, image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/userCRUD/updateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currUser.username,
          ...updatedDetails,
        }),
      });

      const data = await response.json();
      
      if (data.message === "User details updated") {
        setCurrUser({ ...currUser, ...updatedDetails });
        setEdit(false);
      } else {
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitHackathon = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/hackathonsCRUD/createHackathon", {
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
      });

      const data = await response.json();
      
      if (data.message) {
        setShowForm(false);
        setHackathon({ name: "", website: "", problemStatement: "" });
      } else {
        setError(data.error || "Failed to create hackathon");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create hackathon");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    document.cookie = "LOGIN_INFO=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="bg-[#0F172A] min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0F172A] min-h-screen text-gray-300">
      <Navbar />
      {error && (
        <div className="bg-red-500 text-white p-3 text-center">
          {error}
          <button 
            onClick={() => setError("")} 
            className="ml-3 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      )}
      <div className="flex gap-10 p-6">
        <div className="bg-gray-800 p-6 rounded-xl w-1/4 flex flex-col items-center shadow-lg">
          {edit ? (
            <div className="w-full">
              <div className="flex flex-col items-center">
                <img
                  src={updatedDetails.image || currUser.image || ProfilePic}
                  className="rounded-full h-44 w-44 object-cover mb-4"
                  alt="Profile"
                />
                <input
                  type="file"
                  onChange={uploadImage}
                  className="mb-4 w-full text-sm text-gray-400"
                  accept="image/*"
                />
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  name="fullName"
                  value={updatedDetails.fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full p-2 bg-gray-700 rounded-lg text-white"
                />
                <input
                  type="text"
                  name="college"
                  value={updatedDetails.college}
                  onChange={handleInputChange}
                  placeholder="College"
                  className="w-full p-2 bg-gray-700 rounded-lg text-white"
                />
                <input
                  type="text"
                  name="location"
                  value={updatedDetails.location}
                  onChange={handleInputChange}
                  placeholder="Location"
                  className="w-full p-2 bg-gray-700 rounded-lg text-white"
                />
                <input
                  type="text"
                  name="github_username"
                  value={updatedDetails.github_username}
                  onChange={handleInputChange}
                  placeholder="GitHub Username"
                  className="w-full p-2 bg-gray-700 rounded-lg text-white"
                />
                <textarea
                  name="bio"
                  value={updatedDetails.bio}
                  onChange={handleInputChange}
                  placeholder="Bio"
                  className="w-full p-2 bg-gray-700 rounded-lg text-white resize-none"
                  rows="3"
                />
                <div className="flex gap-4">
                  <button
                    className="bg-green-700 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full disabled:opacity-50"
                    onClick={saveDetails}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full"
                    onClick={() => {
                      setEdit(false);
                      setUpdatedDetails({
                        fullName: currUser.fullName || "",
                        bio: currUser.bio || "",
                        image: currUser.image || "",
                        college: currUser.college || "",
                        location: currUser.location || "",
                        github_username: currUser.github_username || "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <img
                src={currUser.image || ProfilePic}
                className="rounded-full h-44 w-44 object-cover"
                alt="Profile"
              />
              <h1 className="text-3xl font-semibold tracking-wide mt-6 text-white">
                {currUser.fullName}
              </h1>
              <p className="mt-2 text-gray-400">{currUser.email}</p>
              {currUser.college && (
                <p className="mt-2 text-gray-400">🎓 {currUser.college}</p>
              )}
              {currUser.location && (
                <p className="mt-2 text-gray-400">📍 {currUser.location}</p>
              )}
              {currUser.github_username && (
                <p className="mt-2 text-gray-400">
                  <a
                    href={`https://github.com/${currUser.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    GitHub: {currUser.github_username}
                  </a>
                </p>
              )}
              <p className="mt-2 text-gray-500 text-center">
                {currUser.bio || "No bio yet..."}
              </p>

              <div className="mt-5 flex gap-4">
                <button
                  className="bg-green-700 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  onClick={() => setEdit(true)}
                >
                  Edit Profile
                </button>
                <button
                  className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  onClick={logout}
                >
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>

        <div className="rounded-xl w-3/4 bg-gray-900 p-6 shadow-lg">
          <AddSkills user={currUser} />
          <button
            className="bg-blue-800 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mt-6 transition-colors"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel New Hackathon" : "New Hackathon"}
          </button>
          
          {showForm && (
            <form onSubmit={handleSubmitHackathon} className="mt-6 bg-gray-800 p-6 rounded-lg shadow-md">
              <input
                type="text"
                name="name"
                placeholder="Hackathon Name"
                value={hackathon.name}
                onChange={handleHackathonChange}
                className="w-full p-2 mb-3 bg-gray-700 rounded-lg placeholder-gray-400 text-gray-300"
                required
              />
              <input
                type="url"
                name="website"
                placeholder="Website URL"
                value={hackathon.website}
                onChange={handleHackathonChange}
                className="w-full p-2 mb-3 bg-gray-700 rounded-lg placeholder-gray-400 text-gray-300"
                required
              />
              <textarea
                name="problemStatement"
                placeholder="Problem Statement"
                value={hackathon.problemStatement}
                onChange={handleHackathonChange}
                className="w-full p-2 mb-3 bg-gray-700 rounded-lg placeholder-gray-400 text-gray-300 resize-none"
                rows="4"
                required
              />
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Hackathon"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}