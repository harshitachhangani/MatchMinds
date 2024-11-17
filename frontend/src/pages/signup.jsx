import { useState } from "react";
import loginPic from "../assets/signup_graphics.png";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { availableSkills } from "../data/skills"; // Importing from the new file
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
    achievements: 0
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Added logic for achievements input
    if (name === "achievementsInput") {
      const count = value.split(",").filter((achievement) => achievement.trim() !== "").length;
      setFormData((prev) => ({
        ...prev,
        achievements: count, // Update the achievements count
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle adding a skill
  const handleSkillSelect = (e) => {
    const selectedSkill = e.target.value;
    if (selectedSkill && !formData.skills.includes(selectedSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, selectedSkill],
      }));
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data before submitting:", formData);

    try {
      const response = await axios.post("http://localhost:5000/auth/signup", formData);

      if (response.status === 200) {
        navigate("/login");
      } else {
        alert(response.data.error || response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(error.response.data.message || "An error occurred during signup");
      } else {
        console.error("Error:", error);
        alert("An error occurred during signup");
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

          <label className="block text-sm mb-2 text-gray-400">Hackathons Participated</label>
          <input
            type="number"
            name="hackathons_participated"
            placeholder="Number of Hackathons Participated"
            value={formData.hackathons_participated}
            onChange={handleInputChange}
            className="border-2 border-gray-600 bg-gray-700 rounded-lg p-3 w-full mb-4 text-gray-300"
          />


          <label className="block text-sm mb-2 text-gray-400">Achievements (seperated by comma)</label>
          <input
            type="text"
            name="achievementsInput" // Used for display purposes
            placeholder="Achievements (comma-separated)"
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
