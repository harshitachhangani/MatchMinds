import React from "react";
import { motion } from "framer-motion";
import VisionImage from "../assets/Vision.png";
import Mission from "../assets/Mission.png";
import Navbar from "./Navbar";

const Vision = () => {
  return (
    <div className="min-h-screen z-10 w-full">
      <section id="vision" className="bg-green-100 p-3 px-10">
        <h2 className="text-4xl mr-10 italic text-right">Our Vision</h2>
        <div className="flex text-xl gap-16">
          <img className="h-1/4 w-1/4" src={VisionImage} />
          <p className="mt-10">
            Our vision is to revolutionize the way professionals collaborate on
            projects. We aim to provide a platform where individuals can find
            like-minded professionals to build their dream teams and accomplish
            projects together. Initially focused on hackathons, our platform
            will soon expand to include a wide range of events such as
            marathons, travel adventures, and various team-building activities.
            We envision a versatile platform that facilitates collaboration and
            teamwork across diverse domains.
          </p>
        </div>
        <div className="text-xl">
          <div className="flex flex-row-reverse gap-10 mt-24">
            <img className="h-1/3 w-1/3 -mt-48" src={Mission} />
            <div>
              <h3 className="text-4xl mr-10 italic -mt-20">Our Mission</h3>
              <p className="mt-10">
                Our mission is to empower individuals to connect, collaborate,
                and create meaningful projects together. By fostering a
                community-driven platform, we strive to break down barriers,
                inspire innovation, and cultivate a supportive ecosystem for
                diverse talents to thrive.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Vision;
