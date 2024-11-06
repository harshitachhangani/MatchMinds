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
    console.log(hackathon); // You can replace this with your own logic to handle the form submission
  };

  useEffect(() => {
    // Fetch the user's details 
 //   fetch("https://teammatch-backend.onrender.com/auth/getLoggedInUser", {
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
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCurrUser(data.user);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });

    setReader(new FileReader());
  }, []);

  const saveDetails = () => {
    console.log(updatedDetails, "updatedDetails");
   // fetch("https://teammatch-backend.onrender.com/userCRUD/updateUser", {
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
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // navigate("/profile");
        window.location.reload();

        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadImage = (e) => {
    reader.onload = (e) => {
      setUpdatedDetails({ ...updatedDetails, image: e.target.result });
    };
    // console.log(e.target.files[0],"file")
    const f = e.target.files[0];
    const check = reader.readAsDataURL(f);
    console.log(check, "check");
  };
  const [edit, setEdit] = useState(false);
  const editDetails = () => {
    setEdit(!edit);

    // You can replace this with your own logic to handle the form submission
    console.log(edit, "Edit details");
  };

  const logout = () => {
    document.cookie =
      "LOGIN_INFO=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

//   return (
    const createHackathon = () => {
       // fetch("https://teammatch-backend.onrender.com/hackathonsCRUD/createHackathon", {
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
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return (
        <div>
            <Navbar />
            <div className="flex gap-7 bg-green-100 min-h-screen p-5">
                <div className="bg-white p-2 rounded-xl w-1/4 flex flex-col items-center">
                    <div className="h-44 object-contain">
                    {
                        currUser.image ? <img
                        src={currUser.image}
                        className="cursor-pointer rounded-full h-44 "

                        alt="Profile"
                        /> :
                        <img
                        src={ProfilePic}
                        className="rounded-3xl cursor-pointer"
                        style={{ height: "250px" }}
                        alt="Profile"
                        />
                    }
                    </div>
                    <h1 className="text-3xl font-bold tracking-wide mt-10">{currUser.fullName}</h1> 
                    <p className="mt-2 text-lg">{currUser.email}</p>
                    {
                        currUser.bio ? <p className="mt-2 text-lg">{currUser.bio}</p> : <p className="mt-2 text-lg">Update Bio...</p>
                    }

                    <div className="mt-5">
                        <button className="bg-green-200 hover:bg-green-500 text-black font-bold py-2 px-4 rounded" onClick={editDetails}>
                            {
                                edit ? "Done" : "Edit Profile"
                            }
                            {/* Edit Profile */}
                        </button>

                        <button className="bg-green-200 hover:bg-green-500 text-black font-bold py-2 px-4 rounded ml-5" onClick={logout}>
                            Log Out
                        </button>
                    </div>

                </div>

                <div className="mt-10 rounded-xl w-2/3 mx-10">
                    <AddSkills user={currUser}/>
                    {/* New hackathon section */}
                    <div className="mt-4">
                        <button
                            className="bg-green-900 hover:bg-green-700 text-white rounded-xl p-2 px-3"
                            onClick={() => setShowForm(!showForm)}
                        >
                            New Hackathon
                        </button>
                        {showForm && (
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={hackathon.name}
                                    onChange={handleInputChange}
                                    className="border-2 border-black rounded-xl p-2 w-full mb-2 mt-7"
                                />
                                <input
                                    type="text"
                                    name="website"
                                    placeholder="Website"
                                    value={hackathon.website}
                                    onChange={handleInputChange}
                                    className="border-2 border-black rounded-xl p-2 w-full mb-2"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white rounded-xl p-2 px-3 mt-2"
                                    onClick={createHackathon}
                                >
                                    Submit Hackathon
                                </button>
                            </form>
                        )}
                    </div>
                    {
                        edit && 
                        <div className="mt-10 border-2 rounded-xl p-4 w-fit flex flex-col gap-2">
                            <input type="text" className="border-2 border-black p-2 rounded-full" placeholder="New Name..." onChange={
                                (e) => {
                                    setUpdatedDetails({...updatedDetails, fullName: e.target.value})
                                }
                            }/>
                            {/* <input type="textarea" className="border-2 border-black p-2 rounded-full" placeholder="New Name..."/> */}
                            <textarea name="" id="" cols="30" rows="10" className="border-2 border-black p-2 rounded-xl" onChange={
                                (e) => {
                                    setUpdatedDetails({...updatedDetails, description: e.target.value})
                                }
                            } ></textarea>

                            <button className="border-2 border-black rounded-md bg-white">
                                <input onChange={uploadImage} type="file" accept="image/*" />
                                {/* <input type="file" id="files" className="hidden cursor-pointer" accept="image/*" onChange={uploadImage}/>
                                <label for="files" className="cursor-pointer w-full">Add a profile pic ?</label> */}
                            </button>

                            <button type="submit" className="bg-green-200 hover:bg-green-500 text-black font-bold py-2 px-4 rounded" onClick={saveDetails}>
                                Save
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>

  );
}
