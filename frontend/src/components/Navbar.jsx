import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { color } from "framer-motion";

const Navbar = () => {
  const [currUser, setCurrUser] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const logoStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "2rem",
    width: "2rem",
    animation: "rotation 1.5s linear infinite",
    color: "white"
  };
  const keyframes = `
    @keyframes rotation {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `;

  useEffect(() => {
    try {
      const jwt = document.cookie
        .split("; ")
        .find((row) => row.startsWith("LOGIN_INFO"))
        .split("=")[1];

      fetch("http://localhost:5000/auth/getLoggedInUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCurrUser(data.user);
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-[#0F172A] w-full font-bricolage">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo and Links */}
          <div className="flex items-center">
            <style>{keyframes}</style>
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Logo" style={logoStyle} />
              <div className="text-white font-bold text-2xl ml-2">MatchMinds</div>
            </Link>
            <div className="hidden md:flex ml-10 space-x-4">
              <Link to="/" className="text-gray-300 hover:underline hover:text-white px-3 py-2 rounded-md text-md font-medium">
                Home
              </Link>
              <Link to="/searchUser" className="text-gray-300 hover:underline hover:text-white px-3 py-2 rounded-md text-md font-medium">
                Find Teammates
              </Link>
              <Link to="/recommendations" className="text-gray-300 hover:underline hover:text-white px-3 py-2 rounded-md text-md font-medium">
                Recommended Teammates
              </Link>
              <Link to="/chats" className="text-gray-300 hover:underline hover:text-white px-3 py-2 rounded-md text-md font-medium">
                Chat Room
              </Link>
            </div>
          </div>

          {/* Right Section: User Links */}
          <div className="hidden md:flex items-center space-x-4">
            {currUser.username ? (
              <Link to="/profile" className="text-white font-semibold hover:text-gray-300">
                {currUser.username}
              </Link>
            ) : (
              <>
                <Link to="/signup" className="text-gray-300 hover:underline hover:text-white px-3 py-2 rounded-md text-md font-medium">
                  Sign Up
                </Link>
                <Link to="/login" className="text-gray-300 hover:underline hover:text-white px-3 py-2 rounded-md text-md font-medium">
                  Log In
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              {isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Home
          </Link>
          <Link to="/searchUser" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Find Teammates
          </Link>
          <Link to="/chats" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Chat Room
          </Link>
          {currUser.username ? (
            <Link to="/profile" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              {currUser.username}
            </Link>
          ) : (
            <>
              <Link to="/signup" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Sign Up
              </Link>
              <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Log In
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
