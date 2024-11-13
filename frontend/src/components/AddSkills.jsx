import React, { useState, useEffect } from "react";

const AddSkills = ({ user }) => {
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState([]);
  const [showcaseSkills, setShowcaseSkills] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.skills) {
      setSkills(user.skills);
    }
  }, [user]);

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!skill.trim()) return;
      
      if (skills.includes(skill.trim())) {
        setError("This skill already exists!");
        setTimeout(() => setError(""), 3000);
        return;
      }

      try {
        setLoading(true);
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("LOGIN_INFO"))
          ?.split("=")[1];

        const response = await fetch("http://localhost:5000/userCRUD/addSkills", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            username: user.username,
            skill: skill.trim(),
          }),
        });

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setSkills([...skills, skill.trim()]);
        setSkill("");
      } catch (err) {
        setError(err.message || "Failed to add skill");
        setTimeout(() => setError(""), 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  const removeSkill = async (skillToRemove) => {
    try {
      setLoading(true);
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("LOGIN_INFO"))
        ?.split("=")[1];

      const response = await fetch("http://localhost:5000/userCRUD/removeSkill", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          username: user.username,
          skill: skillToRemove,
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setSkills(skills.filter((s) => s !== skillToRemove));
    } catch (err) {
      setError(err.message || "Failed to remove skill");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Skills</h2>
        <button
          onClick={() => setShowcaseSkills(!showcaseSkills)}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded-lg text-sm transition-colors"
        >
          {showcaseSkills ? "Hide Skills" : "Show Skills"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      {showcaseSkills && (
        <div className="flex flex-wrap gap-2 mb-6">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <div
                key={index}
                className="group flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => removeSkill(skill)}
              >
                <span>{skill}</span>
                <span className="text-gray-500 group-hover:text-red-400">×</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic">No skills added yet</p>
          )}
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          placeholder="Add a new skill (press Enter to add)"
          className="w-full bg-gray-700 text-gray-300 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-500 border-t-blue-500"></div>
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs mt-2">
        Click on a skill to remove it
      </p>
    </div>
  );
};

export default AddSkills;