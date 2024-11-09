import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfilePic from "../assets/pfp.png";
import TeamDetails from "../components/TeamDetails";
import AddSkills from "../components/AddSkills";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [showForm, setShowForm] = useState(false);
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

  const handleInputChange = (event) => {
    setHackathon({ ...hackathon, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(hackathon);
  };

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
        console.log(data);
      })
      .catch((err) => console.log(err));

    setReader(new FileReader());
  }, []);

  const saveDetails = () => {
    console.log(updatedDetails, "updatedDetails");
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
      .then((data) => {
        window.location.reload();
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

  const uploadImage = (e) => {
    reader.onload = (e) => {
      setUpdatedDetails({ ...updatedDetails, image: e.target.result });
    };
    const f = e.target.files[0];
    reader.readAsDataURL(f);
  };

  const [edit, setEdit] = useState(false);
  const editDetails = () => {
    setEdit(!edit);
    console.log(edit, "Edit details");
  };

  const logout = () => {
    document.cookie = "LOGIN_INFO=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

  const createHackathon = () => {
    fetch("http://localhost:5000/hackathonsCRUD/createHackathon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: currUser.username,
        name: hackathon.name,
        link: hackathon.website,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Navbar />
      <div className="flex gap-7 bg-gray-100 min-h-screen p-5">
        <div className="bg-white p-4 rounded-xl w-1/4 flex flex-col items-center shadow-lg">
          <div className="h-44 object-contain">
            {currUser.image ? (
              <img
                src={currUser.image}
                className="cursor-pointer rounded-full h-44 "
                alt="Profile"
              />
            ) : (
              <img
                src={ProfilePic}
                className="rounded-full cursor-pointer h-44"
                alt="Profile"
              />
            )}
          </div>
          <h1 className="text-3xl font-semibold tracking-wide mt-6 text-gray-800">{currUser.fullName}</h1>
          <p className="mt-2 text-gray-600">{currUser.email}</p>
          {currUser.bio ? (
            <p className="mt-2 text-gray-600">{currUser.bio}</p>
          ) : (
            <p className="mt-2 text-gray-400">Update Bio...</p>
          )}

          <div className="mt-5">
            <button
              className="bg-green-700 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
              onClick={editDetails}
            >
              {edit ? "Done" : "Edit Profile"}
            </button>
            <button
              className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded ml-4 transition-colors duration-200"
              onClick={logout}
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="rounded-xl w-2/3 mx-10">
          <AddSkills user={currUser} />
          <div className="mt-4">
            <button
              className="bg-green-900 hover:bg-green-800 text-white rounded-lg py-2 px-4 transition-colors duration-200"
              onClick={() => setShowForm(!showForm)}
            >
              New Hackathon
            </button>
            {showForm && (
              <form onSubmit={handleSubmit} className="mt-4 bg-white p-4 rounded-lg shadow-lg">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={hackathon.name}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg p-2 w-full mb-2"
                />
                <input
                  type="text"
                  name="website"
                  placeholder="Website"
                  value={hackathon.website}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg p-2 w-full mb-2"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 px-4 mt-2 transition-colors duration-200"
                  onClick={createHackathon}
                >
                  Submit Hackathon
                </button>
              </form>
            )}
          </div>

          {edit && (
            <div className="mt-10 border border-gray-300 rounded-xl p-4 w-fit bg-white shadow-lg">
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-lg w-full mb-2"
                placeholder="New Name..."
                onChange={(e) => setUpdatedDetails({ ...updatedDetails, fullName: e.target.value })}
              />
              <textarea
                cols="30"
                rows="5"
                className="border border-gray-300 p-2 rounded-lg w-full mb-2"
                placeholder="Bio"
                onChange={(e) => setUpdatedDetails({ ...updatedDetails, description: e.target.value })}
              ></textarea>
              <button className="border border-gray-300 rounded-lg bg-gray-200 p-2 mb-2">
                <input onChange={uploadImage} type="file" accept="image/*" />
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
                onClick={saveDetails}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
