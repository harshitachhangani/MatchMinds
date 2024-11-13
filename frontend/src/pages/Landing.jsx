import React from 'react';
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Vision from "../components/Vision";
import graphiics from "../assets/landing_graphics.png";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaSearch, FaUsers, FaTrophy, FaRocket } from "react-icons/fa";

const Landing = () => {
    const features = [
        {
            title: "Smart Matching",
            description: "Our AI-powered matching system connects you with the perfect teammates based on skills and experience.",
            icon: <FaSearch className="w-12 h-12 text-violet-500 mb-4" />
        },
        {
            title: "Diverse Teams",
            description: "Build well-rounded teams with complementary skills from a global talent pool.",
            icon: <FaUsers className="w-12 h-12 text-violet-500 mb-4" />
        },
        {
            title: "Track Record",
            description: "Showcase your hackathon achievements and build a compelling portfolio.",
            icon: <FaTrophy className="w-12 h-12 text-violet-500 mb-4" />
        }
    ];

    const stats = [
        { number: "1000+", label: "Active Users" },
        { number: "500+", label: "Successful Teams" },
        { number: "50+", label: "Hackathons" },
        { number: "90%", label: "Match Rate" }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <div className="fixed w-full top-0 left-0 z-50">
                <Navbar />
            </div>

            {/* Hero Section */}
            <header className="bg-[#141D2C] flex-grow flex items-center justify-center mt-16 p-10">
                <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl">
                    <div className="text-left px-4 md:w-1/2">
                        <h1 className="text-4xl md:text-7xl font-bold text-white mb-6">
                            Build Your
                            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-400">
                                Dream Team
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 mb-8">
                            Connect with skilled developers, designers, and innovators. 
                            Form the perfect team for your next hackathon victory.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/register">
                                <button className="py-4 px-8 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl text-lg transition duration-300">
                                    Get Started
                                </button>
                            </Link>
                            <Link to="/searchUser">
                                <button className="py-4 px-8 border border-violet-600 text-violet-400 hover:bg-violet-600/10 font-semibold rounded-xl text-lg transition duration-300">
                                    Browse Teams
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="md:w-1/2 p-4">
                        <img src={graphiics} alt="Team Building" className="w-full h-auto max-w-lg rounded-lg" />
                    </div>
                </div>
            </header>

            {/* Stats Section */}
            <section className="bg-[#1A2233] py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <h2 className="text-4xl md:text-5xl font-bold text-violet-400 mb-2">
                                    {stat.number}
                                </h2>
                                <p className="text-gray-400 text-lg">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-[#141D2C] py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-white mb-16">
                        Why Choose <span className="text-violet-400">HackBuddy</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-[#1A2233] p-8 rounded-xl text-center">
                                <div className="flex justify-center">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="bg-[#1A2233] py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-white mb-16">How It Works</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: "1", title: "Create Profile", desc: "Set up your profile with skills and experience" },
                            { step: "2", title: "Find Events", desc: "Browse upcoming hackathons and competitions" },
                            { step: "3", title: "Match Teams", desc: "Connect with compatible team members" },
                            { step: "4", title: "Start Building", desc: "Collaborate and create amazing projects" }
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center mx-auto mb-6">
                                    <span className="text-2xl font-bold text-white">{item.step}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            


            {/* CTA Section */}
            <section className="bg-[#141D2C] py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="bg-gradient-to-r from-violet-600 to-pink-600 p-12 rounded-2xl">
                        <h2 className="text-4xl font-bold text-white mb-6">Ready to Build Your Dream Team?</h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Join thousands of developers, designers, and innovators creating 
                            amazing projects together.
                        </p>
                        <Link to="/register">
                            <button className="py-4 px-8 bg-white text-violet-600 hover:bg-gray-100 font-semibold rounded-xl text-lg transition duration-300">
                                Start Building Today
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#141D2C] text-gray-400 py-12 mt-auto border-t border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-white font-bold mb-4">About</h3>
                            <p className="text-sm">
                                HackBuddy connects talented individuals to build amazing projects 
                                together in hackathons and competitions.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                                <li><Link to="/events" className="hover:text-white transition">Events</Link></li>
                                <li><Link to="/teams" className="hover:text-white transition">Teams</Link></li>
                                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-4">Resources</h3>
                            <ul className="space-y-2">
                                <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
                                <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
                                <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                                <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-4">Connect</h3>
                            <div className="flex space-x-4">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                                    <FaFacebook size={24} />
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                                    <FaTwitter size={24} />
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                                    <FaInstagram size={24} />
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                                    <FaLinkedin size={24} />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="text-center pt-8 border-t border-gray-800">
                        <p className="text-sm">&copy; {new Date().getFullYear()} HackBuddy. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;