import { useState } from "react";
import { useNavigate } from "react-router-dom";
import login_graphics from "../assets/login_graphics.png";
import { RotatingLines } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  async function login() {
    setLoader(true);
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        document.cookie = `LOGIN_INFO=${data.token}`;
        const jwt = document.cookie
          .split("; ")
          .find((row) => row.startsWith("LOGIN_INFO"))
          .split("=")[1];
        if (jwt) {
          navigate("/profile");
        }
      } else {
        alert("Invalid user details");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoader(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-[#0F172A] text-gray-300">
      <div className="w-1/2 flex flex-col justify-center items-center px-8 py-16">
        <h1 className="text-5xl font-bold text-white mb-4 italic tracking-wide">
          Match Maker
        </h1>
        <h2 className="text-3xl font-light text-gray-400 tracking-wide">
          Let's find your team
        </h2>
        <img src={login_graphics} alt="login graphics" className="w-80 mt-10" />
      </div>

      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 50 }}
        className="w-1/2 bg-gray-800 flex justify-center items-center p-12 rounded-l-lg shadow-lg"
      >
        <div className="flex flex-col w-full max-w-md">
          <h1 className="text-4xl font-semibold mb-6 text-white">Login</h1>
          <input
            type="text"
            placeholder="Email"
            value={email}
            className="border-2 border-gray-600 bg-gray-700 rounded-lg p-3 w-full mb-4 text-gray-300"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            className="border-2 border-gray-600 bg-gray-700 rounded-lg p-3 w-full mb-4 text-gray-300"
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <p className="text-gray-400 text-sm mb-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>

          {loader && (
            <div className="flex justify-center mb-6">
              <RotatingLines
                visible={loader}
                height="40"
                width="40"
                color="gray"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
              />
            </div>
          )}

          <button
            onClick={login}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg w-full transition-colors duration-300"
          >
            Submit
          </button>
        </div>
      </motion.div>
    </div>
  );
}
