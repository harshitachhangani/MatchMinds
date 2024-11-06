import React from "react";
import ProfilePic from "../assets/pfp.png";
import { FiEdit2 } from "react-icons/fi";
import { FiX } from "react-icons/fi";

const TeamDetails = () => {
  return (
    <div
      style={{ backgroundColor: "#304D30", color: "white" }}
      className="rounded mt-3 p-2  flex justify-between items-center"
    >
      <div>
        <p>Team Name</p>
        <p className="text-white-300">Number of members: 5</p>
      </div>
      <div className="flex items-center">
        <div className="bg-white p-2 rounded-full ml-10">
          <FiEdit2 color="black" />
        </div>
        <div className="bg-red-600 p-2 rounded-full ml-2">
          <FiX />
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
