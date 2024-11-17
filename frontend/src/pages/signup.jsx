import { useState } from "react";
import loginPic from "../assets/signup_graphics.png";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { availableSkills } from "../data/skills";
import axios from "axios";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    college: "",
    hackathons_participated: 0,
    skills: [],
    location: "",
    github_username: "",
    achievements: "" // New field for achievements
  });

  const navigate = useNavigate();

  // Client-side validation function
  const validateForm = () => {
    const { username, email, password, college, github_username } = formData;

    // Required fields check
    if (!username || !email || !password || !college || !github_username) {
      alert("Please enter all required fields");
      return false;
    }

    // Length validations
    if (username.length < 1 || email.length < 1 || password.length < 1) {
      alert("Please enter all required fields");
      return false;
    }

    if (password.length < 6) {
      alert("Password should be at least 6 characters long");
      return false;
    }

    // Format validations
    if (username.includes(" ")) {
      alert("Username should only contain alphabets, numbers and special characters like _ - .");
      return false;
    }

    if (email.includes(" ")) {
      alert("Invalid email address");
      return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email format");
      return false;
    }

    // GitHub username validation
    const githubUsernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
    if (!githubUsernameRegex.test(github_username)) {
      alert("Invalid GitHub username format");
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillSelect = (e) => {
    const selectedSkill = e.target.value;
    if (selectedSkill && !formData.skills.includes(selectedSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, selectedSkill],
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Perform client-side validation first
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/auth/signup", formData);

      if (response.status === 200) {
        alert("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        // Handle specific error cases from the server
        const errorMessage = error.response.data.error;
        
        if (errorMessage === "Username already exists") {
          alert("This username is already taken. Please choose another username.");
        } else if (errorMessage === "Email already exists") {
          alert("An account with this email already exists. Please use a different email or login.");
        } else {
          // For any other server-side validation errors
          alert(errorMessage || "An error occurred during signup");
        }
      } else {
        alert("Network error. Please try again later.");
      }
    }
  };

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
        className="w-1/2 bg-gray-800 flex justify-center items-center p-12 rounded-l-lg shadow-lg overflow-y-auto max-h-screen"
      >
        <div className="flex flex-col w-full max-w-md">
          <h1 className="text-4xl font-semibold mb-6 text-white">Register</h1>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleInputChange}
            className="border-2 border-gray-600 bg-gray-700 rounded-lg p-3 w-full mb-4 text-gray-300"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            className="border-2 border-gray-600 bg-gray-700 rounded-lg p-3 w-full mb-4 text-gray-300"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="border-2 border-gray-600 bg-gray-700 rounded-lg p-3 w-full mb-4 text-gray-300"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="border-2 border-gray-600 bg-gray-700 rounded-lg p-3 w-full mb-4 text-gray-300"
          />

          <input
            type="text"
            name="college"
            placeholder="College"
            value={formData.college}
            onChange={handleInputChange}
            className="border-2 border-gray-600 bg-gray-700 rounded-lg p-3 w-full mb-4 text-gray-300"
          />

          <input
            type="number"
            name="hackathons_participated"
            placeholder="Number of Hackathons Participated"
            value={formData.hackathons_participated}
            onChange={handleInputChange}
            className="border-2 border-gray-600 bg-gray-700 rounded-lg p-3 w-full mb-4 text-gray-300"
          />

          {/* Skills Dropdown */}
          <label className="block text-sm mb-2 text-gray-400">Skills</label>
          <select
            value=""
            onChange={handleSkillSelect}
            className="w-full bg-gray-700 text-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all mb-4"
          >
            <option value="" disabled>Select a skill to add</option>
            {availableSkills.map((availableSkill) => (
              <option key={availableSkill} value={availableSkill}>
                {availableSkill}
              </option>
            ))}
          </select>

          {/* Display selected skills with remove option */}
          <div className="flex flex-wrap gap-2 mb-4 overflow-auto max-h-32 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {formData.skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-700 text-gray-300 px-3 py-1 rounded-lg"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-red-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <textarea
            name="achievements"
            placeholder="Enter your achievements (comma-separated)"
            value={formData.achievements}
            onChange={handleInputChange}
            className="border-2 border-gray-600 bg-gray-700 rounded-lg p-3 w-full mb-4 text-gray-300 min-h-[100px]"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleInputChange}
            className="border-2 border-gray-600 bg-gray-700 rounded-lg p-3 w-full mb-4 text-gray-300"
          />

          <input
            type="text"
            name="github_username"
            placeholder="GitHub Username"
            value={formData.github_username}
            onChange={handleInputChange}
            className="border-2 border-gray-600 bg-gray-700 rounded-lg p-3 w-full mb-6 text-gray-300"
          />

          <p className="text-gray-400 text-sm mb-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg w-full transition-colors duration-300"
          >
            Submit
          </button>
        </div>
      </motion.div>
    </div>
  );
}