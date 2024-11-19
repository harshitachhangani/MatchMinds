import { useState, useEffect, useRef } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";  // Ensure the Navbar is included
import graphiics from "../assets/login_graphics.png"; // Replace with your image
import io from "socket.io-client";

const socket = io("https://web-socket-server-02l2.onrender.com/");

function ChatRoom() {
  const [message, setMessage] = useState("");
  const [messageRecieved, setMessageRecieved] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [currUser, setCurrUser] = useState({});
  const [chatFriend, setChatFriend] = useState("");
  const [chats, setChats] = useState([]);
  const [friends, setFriends] = useState([]);
  
  const msg = useRef();
  const scrollTop = useRef();

  useEffect(() => {
    socket.on("recieveMessage", (data) => {
      setMessageRecieved(data.message);
      const container = document.createElement("div");
      container.className = "flex justify-start max-w-4/6 ";
      
      const recieve = document.createElement("h1");
      recieve.innerHTML = data.message;
      recieve.className = "bg-[#595959] text-white p-2 rounded-xl text-wrap";
      
      container.appendChild(recieve);
      msg.current.appendChild(container);
      scrollTop.current.scrollIntoView({ behavior: "smooth" });
    });
    
    // Get logged-in user data and friends
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
        setFriends(data.user.friends);
        setChatFriend(data.user.friends[0]);
      })
      .catch((err) => {
        console.log(err);
      });

  }, [socket]);

  const sendMessage = () => {
    socket.emit("sendMessage", { message, roomCode });
    const container = document.createElement("div");
    container.className = "flex justify-end w-full";

    const send = document.createElement("h1");
    send.innerHTML = message;
    send.className =
      "bg-[#595959] p-2 rounded-xl max-w-4/6 text-pretty text-white ";
      
    container.appendChild(send);
    msg.current.appendChild(container);
    scrollTop.current.scrollIntoView({ behavior: "smooth" });
  };

  const selectedUser = (e) => {
    const roomString =
      currUser.username < e.target.innerHTML
        ? currUser.username + e.target.innerHTML
        : e.target.innerHTML + currUser.username;

    setRoomCode(roomString);
    setChatFriend(e.target.innerHTML);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#141D2C] text-white">
      <div className="fixed w-full top-0 left-0 z-50">
        <Navbar />
      </div>
  
      {/* Main Chat Section */}
      <div className="flex-grow flex w-full mt-16 p-4 gap-4">
        {/* Friends List Section */}
        <div className="bg-[#1A2233] w-1/3 rounded-lg p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold text-violet-400 mb-4">Search for friends</h2>
          <input
            type="text"
            className="bg-[#2A2E3D] text-white p-2 rounded-xl w-full mb-4"
            placeholder="Search for friends..."
          />
          <ul className="space-y-4">
            {friends.length === 0 ? (
              <div className="flex flex-col items-center">
                <Link to="/searchUser">
                  <div className="bg-white text-violet-600 p-4 rounded-xl flex items-center gap-2">
                    <FaArrowRightLong size={24} />
                    <span>Find Friends</span>
                  </div>
                </Link>
              </div>
            ) : (
              friends.map((friend) => (
                <li
                  key={friend}
                  onClick={selectedUser}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded-xl"
                >
                  <img
                    src={`https://via.placeholder.com/40`} // Replace with friend's image if available
                    alt={friend}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="text-white">{friend}</span>
                </li>
              ))
            )}
          </ul>
        </div>
  
        {/* Chat Section */}
        <div className="bg-[#1A2233] flex-grow rounded-lg flex flex-col p-4">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={`https://via.placeholder.com/40`} // Replace with chat friend's image
              alt={chatFriend}
              className="w-10 h-10 rounded-full"
            />
            <h2 className="text-xl font-semibold text-violet-400">
              Chat with {chatFriend || "Select a Friend"}
            </h2>
          </div>
          <div className="flex-grow overflow-y-auto max-h-[400px] space-y-4">
            {chats.map((chat, i) => (
              <div
                key={i}
                className={`flex ${chat.sender === currUser.username ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`${
                    chat.sender === currUser.username ? "bg-violet-600" : "bg-[#595959]"
                  } p-3 rounded-xl max-w-[75%] text-white`}
                >
                  {chat.message}
                </div>
              </div>
            ))}
            <div ref={scrollTop} />
          </div>
          <div className="mt-4 flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="bg-[#2A2E3D] text-white p-3 rounded-xl w-full"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="bg-violet-600 hover:bg-violet-700 text-white py-3 px-6 rounded-xl ml-4"
            >
              Send
            </button>
          </div>
        </div>
      </div>
  
      {/* Footer */}
      <footer className="bg-[#141D2C] text-gray-400 py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} HackBuddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default ChatRoom;
