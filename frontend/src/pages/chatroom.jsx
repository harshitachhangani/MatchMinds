import { useState, useEffect, useRef } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import io from "socket.io-client";

const socket = io("https://web-socket-server-02l2.onrender.com/");  // Update socket server URL

function ChatRoom() {
  const [message, setMessage] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [currUser, setCurrUser] = useState({});
  const [chatFriend, setChatFriend] = useState("");
  const [chats, setChats] = useState([]);
  const [friends, setFriends] = useState([]);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch chat history for a specific room
  const fetchChatHistory = async (roomCode) => {
    try {
      const jwt = document.cookie
        .split("; ")
        .find((row) => row.startsWith("LOGIN_INFO"))
        ?.split("=")[1];

      const response = await fetch(`http://localhost:5000/chat/getChats/${roomCode}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt,
        },
      });

      if (response.ok) {
        const chatHistory = await response.json();
        setChats(chatHistory);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  // Socket and initial setup
  useEffect(() => {
    // Socket connection and room joining
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    // Get logged-in user data and friends
    const jwt = document.cookie
      .split("; ")
      .find((row) => row.startsWith("LOGIN_INFO"))
      ?.split("=")[1];

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
        
        // Set initial chat friend if friends exist
        if (data.user.friends.length > 0) {
          const initialFriend = data.user.friends[0];
          setChatFriend(initialFriend);
          
          // Generate room code and fetch chat history
          const roomString = 
            data.user.username < initialFriend 
              ? data.user.username + initialFriend 
              : initialFriend + data.user.username;
          
          setRoomCode(roomString);
          
          // Join room and fetch chat history
          socket.emit("joinRoom", { roomCode: roomString });
          fetchChatHistory(roomString);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // Socket event listeners
    socket.on("recieveMessage", (data) => {
      // Add received message to chats
      setChats(prevChats => [...prevChats, {
        sender: data.sender,
        message: data.message
      }]);
      scrollToBottom();
    });

    return () => {
      socket.off("connect");
      socket.off("recieveMessage");
    };
  }, []);

  // Send message function
  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      // Save message to backend
      const response = await fetch("http://localhost:5000/chat/saveChats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user1: currUser.username,
          user2: chatFriend,
          roomCode: roomCode,
          message: message
        })
      });

      if (response.ok) {
        // Emit message via socket
        socket.emit("sendMessage", { 
          message, 
          roomCode, 
          sender: currUser.username 
        });

        // Add message to local chat state
        setChats(prevChats => [...prevChats, {
          sender: currUser.username,
          message: message
        }]);

        // Clear message input
        setMessage("");
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Select user to chat with
  const selectedUser = async (e) => {
    const selectedFriend = e.target.innerHTML;
    setChatFriend(selectedFriend);

    // Generate room code
    const roomString =
      currUser.username < selectedFriend
        ? currUser.username + selectedFriend
        : selectedFriend + currUser.username;

    setRoomCode(roomString);

    // Join room via socket
    socket.emit("joinRoom", { roomCode: roomString });

    // Fetch or create chat room and history
    try {
      const response = await fetch("http://localhost:5000/chat/getRoomCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currUser.username,
          friend: selectedFriend
        })
      });

      const data = await response.json();
      setRoomCode(data.roomCode);
      
      // Fetch chat history
      await fetchChatHistory(data.roomCode);
    } catch (error) {
      console.error("Error selecting user:", error);
    }
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
                    src={friend.image}
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
              src={chatFriend.image}
              alt={chatFriend}
              className="w-10 h-10 rounded-full"
            />
            <h2 className="text-xl font-semibold text-violet-400">
              Chat with {chatFriend || "Select a Friend"}
            </h2>
          </div>
          
          {/* Messages Container */}
          <div 
            ref={messagesContainerRef} 
            className="flex-grow overflow-y-auto max-h-[calc(100vh-400px)] space-y-4 p-4"
          >
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
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="mt-4 flex items-center">
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