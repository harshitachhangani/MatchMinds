import Navbar from "../components/Navbar";
import graphiics from "../assets/landing_graphics.png";
import { Link } from "react-router-dom";
import Vision from "../components/Vision";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Landing = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Fix the navbar to the top */}
            <div className="fixed w-full top-0 left-0">
                <Navbar />
            </div>
            
            {/* <header className="bg-[#141D2C] flex-grow flex items-center justify-center mt-16 p-10">
                <div className="text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-white">
                        Match Your{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-t from-purple-400 via-pink-400 to-white rounded-lg">
                            Dream Team
                        </span>
                    </h1>
                    <p className="mt-4 text-lg md:text-2xl text-gray-400">
                        We connect professionals to build their dream teams and accomplish projects together.
                    </p>
                    <p className="text-lg md:text-2xl text-gray-400">
                        Streamline the process of finding compatible team members and foster collaboration.
                    </p>
                    <Link to="/login">
                        <button className="mt-6 py-3 px-6 bg-violet-600 hover:bg-violet-800 text-white font-semibold rounded-xl text-lg transition duration-500 ease-in-out">
                            Get Started
                        </button>
                    </Link>
                    <div className="mt-8">
                        <img src={graphiics} alt="Graphics" className="w-full h-auto max-w-md mx-auto rounded-lg" />
                    </div>
                </div>
            </header> */}
            <header className="bg-[#141D2C] flex-grow flex items-center justify-center mt-16 p-10">
    <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl">
        {/* Image Section */}
        <div className="md:w-1/2 p-4">
            <img src={graphiics} alt="Graphics" className="w-full h-auto max-w-lg rounded-lg" />
        </div>
        
        {/* Text Section */}
        <div className="text-left px-4 md:w-1/2">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
                Match Your{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-t from-purple-400 via-pink-400 to-white rounded-lg">
                    Dream Team
                </span>
            </h1>
            <p className="mt-4 text-lg md:text-2xl text-gray-400">
                We connect professionals to build their dream teams and accomplish projects together.
            </p>
            <p className="text-lg md:text-2xl text-gray-400">
                Streamline the process of finding compatible team members and foster collaboration.
            </p>
            <Link to="/login">
                <button className="mt-6 py-3 px-6 bg-violet-600 hover:bg-violet-800 text-white font-semibold rounded-xl text-lg transition duration-500 ease-in-out">
                    Get Started
                </button>
            </Link>
        </div>
    </div>
</header>

            <section className="bg-[#1A2233] p-8 md:p-12 text-white">
                <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-6">Why Choose MatchMinds?</h2>
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="md:w-1/3 text-center">
                        <h3 className="text-2xl font-bold mb-3">Top-tier Teams</h3>
                        <p className="text-gray-300">
                            Assemble top-tier teams with MatchMinds. Connect with experts across fields to bring your projects to life.
                        </p>
                    </div>
                    <div className="md:w-1/3 text-center">
                        <h3 className="text-2xl font-bold mb-3">Powerful Tools</h3>
                        <p className="text-gray-300">
                            Manage your projects with a suite of powerful tools—from task tracking to communication—all in one place.
                        </p>
                    </div>
                    <div className="md:w-1/3 text-center">
                        <h3 className="text-2xl font-bold mb-3">Active Community</h3>
                        <p className="text-gray-300">
                            Join a vibrant community of professionals. Gain insights, network, and collaborate with like-minded individuals.
                        </p>
                    </div>
                </div>
            </section>
            {/* <Vision /> */}
            <footer className="bg-[#141D2C] text-gray-400 py-8 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center space-x-4 mb-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-200">
                            <FaFacebook size={24} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-200">
                            <FaTwitter size={24} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-200">
                            <FaInstagram size={24} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-200">
                            <FaLinkedin size={24} />
                        </a>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        <Link to="/about" className="hover:text-gray-200">About Us</Link> | 
                        <Link to="/contact" className="hover:text-gray-200 mx-2">Contact</Link> | 
                        <Link to="/privacy" className="hover:text-gray-200">Privacy Policy</Link>
                    </p>
                    <p className="text-gray-500 text-xs">&copy; {new Date().getFullYear()} MatchMinds. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
