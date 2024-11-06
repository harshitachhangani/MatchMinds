import React, { useState, useEffect } from "react";

const AddSkills = (props) => {

    console.log(props.user, "props.currUser")
    // const [currUser,setCurrUser] = useState({});
    // console.log(currUser, "currUser")
    const [skill, setSkill] = useState("");
    const [skills, setSkills] = useState([]);

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (skill && !skills.includes(skill)) {
                setSkills([...skills, skill]);
                //fetch("https://teammatch-backend.onrender.com/userCRUD/addSkills", {
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
                    .then((res) => {
                        return res.json();
                    })
                    .then((data) => {
                        console.log(data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });


                setSkill("");
            }
        }
    };

    const [showcaseSkills, setShowcaseSkills] = useState(false);

    const showSkills = (e) => {
        e.preventDefault()
        setShowcaseSkills(!showcaseSkills);
    }

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter((skill) => skill !== skillToRemove));
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-4">

                {
                    showcaseSkills ? props.user.skills.map((skill, index) => (
                   <div
                       key={index}
                       onClick={() => removeSkill(skill)}
                       className="p-2 border-2 border-black rounded-xl w-fit cursor-pointer"
                   >
                       {skill}
                   </div>
               ))
               :
               <div></div>
            }
            </div>
            <form className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label htmlFor="skill"> Add Skill</label>
                    <button onClick={showSkills} className="p-2 border-2 border-black"> Show Skills </button>
                    <input
                        type="text"
                        id="skill"
                        placeholder="Enter your skill"
                        className="p-2 rounded-lg"
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </form>
        </div>
    );
};

export default AddSkills;
