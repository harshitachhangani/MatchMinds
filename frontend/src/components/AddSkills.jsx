import React, { useState } from "react";

const AddSkills = (props) => {
    const [skill, setSkill] = useState("");
    const [skills, setSkills] = useState([]);
    const [showcaseSkills, setShowcaseSkills] = useState(false);

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (skill && !skills.includes(skill)) {
                setSkills([...skills, skill]);

                fetch("http://localhost:5000/userCRUD/addSkills", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: document.cookie.split("; ").find((row) => row.startsWith("LOGIN_INFO")).split("=")[1],
                    },
                    body: JSON.stringify({
                        username: props.user.username,
                        skill: skill,
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => console.log(data))
                    .catch((err) => console.log(err));

                setSkill("");
            }
        }
    };

    const showSkills = (e) => {
        e.preventDefault();
        setShowcaseSkills(!showcaseSkills);
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter((skill) => skill !== skillToRemove));
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Skills</h2>
            <div className="flex flex-wrap gap-3 mb-4">
                {showcaseSkills ? (
                    props.user.skills.map((skill, index) => (
                        <div
                            key={index}
                            onClick={() => removeSkill(skill)}
                            className="px-3 py-1 bg-green-100 text-green-800 font-medium rounded-full cursor-pointer hover:bg-green-200 transition duration-200"
                        >
                            {skill}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm italic">Click "Show Skills" to view your skills</p>
                )}
            </div>
            <form className="flex flex-col gap-4">
                <button
                    onClick={showSkills}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition duration-300 focus:outline-none"
                >
                    {showcaseSkills ? "Hide Skills" : "Show Skills"}
                </button>
                <div className="flex flex-col gap-2 mt-3">
                    <label htmlFor="skill" className="text-gray-600 font-medium">Add a Skill</label>
                    <input
                        type="text"
                        id="skill"
                        placeholder="Enter a new skill"
                        className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500 transition duration-300"
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </form>
            <p className="text-xs text-gray-500 mt-2">Press Enter to add the skill.</p>
        </div>
    );
};

export default AddSkills;
