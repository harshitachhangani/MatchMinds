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
    <div className="min-h-screen flex bg-[#0F172A] text-gray-300">
      <div className="w-1/2 flex flex-col justify-center items-center px-8 py-16">
        <h1 className="text-5xl font-bold text-white mb-4 italic tracking-wide">
          MatchMinds
        </h1>
        <h2 className="text-3xl font-light text-gray-400 tracking-wide">
          Let's find your team
        </h2>
        <img src={loginPic} alt="graphics" className="w-80 mt-10" />
      </div>
  
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 50 }}
        className="w-1/2 bg-gray-800 flex justify-center items-center p-12 rounded-l-lg shadow-lg"
      >
        <div className="flex flex-col w-full max-w-md">
          <h1 className="text-4xl font-semibold mb-6 text-white">Register</h1>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border-2 border-gray-600 bg-gray-700 rounded-lg p-3 w-full mb-4 text-gray-300"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 border-gray-600 bg-gray-700 rounded-lg p-3 w-full mb-4 text-gray-300"
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-600 bg-gray-700 rounded-lg p-3 w-full mb-4 text-gray-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-gray-600 bg-gray-700 rounded-lg p-3 w-full mb-6 text-gray-300"
          />
  
          <p className="text-gray-400 text-sm mb-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
  
          <button
            onClick={signup}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg w-full transition-colors duration-300"
          >
            Submit
          </button>
        </div>
      </motion.div>
    </div>
  );  
}
