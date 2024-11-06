import { useState } from "react";
import loginPic from "../assets/signup_graphics.png";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  async function signup() {
    //const response = await fetch("https://teammatch-backend.onrender.com/auth/signup", {
    const response = await fetch("http://localhost:5000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullName, username, email, password }),
    });
    const data = await response.json();

    if (response.ok) {
      navigate("/login");
    } else {
      alert(data.message); // Show the error message returned from the server
    }
  }

  return (
    <div className="flex gap-10">
      <div className="w-1/2 min-h-screen px-7 flex flex-col justify-center items-center">
        <h1 className="text-5xl font-bold text-black-700 mb-5 tracking-wide italic ">
          Match Maker OR What
        </h1>
        <h1 className="text-5xl font-light text-black-700 mb-5 tracking-wide">
          Let's find your team
        </h1>
        <img src={loginPic} alt="graphics" className="w-64 h-64" />
      </div>
      <motion.div
        className="w-1/2 bg-green-100 flex justify-center items-center"
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 50 }}
      >
        <div className="flex flex-col w-1/2 -mt-8">
          <h1 className="text-4xl font-semibold mb-5">REGISTER</h1>
          <input
            type="text"
            placeholder="Full Name ..."
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border-2 border-black rounded-xl p-2 w-full mb-5"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 border-black rounded-xl p-2 w-full mb-5"
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
            className="border-2 border-black rounded-xl p-2 w-full mb-5"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            className="border-2 border-black rounded-xl p-2 w-full mb-5"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Link to="/login">Already have an account? Login</Link>
          <button
            onClick={signup}
            className="bg-black text-white p-2 rounded-full w-full mt-5"
          >
            Submit
          </button>
        </div>
      </motion.div>
    </div>
  );
}
