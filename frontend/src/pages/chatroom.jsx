import { useEffect, useState, useRef } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";  // Assuming Navbar component exists
import io from "socket.io-client";

const socket = io("https://web-socket-server-02l2.onrender.com/");

function App() {
  const [message, setMessage] = useState("");
  const [messageRecieved, setMessageRecieved] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [currUser, setCurrUser] = useState({});
  const [chatFriend, setChatFriend] = useState("");
  const [chats, setChats] = useState([]);
  const [friends, setFriends] = useState([]);

  const msg = useRef();
  const scrollTop = useRef();

  const scrollToBottom = () => {
    scrollTop.current?.scrollIntoView({ behavior: "smooth" });
  };

  const saveChats = (user1, user2) => {
    fetch("http://localhost:5000/chatCRUD/saveChats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user1, user2, roomCode, message }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendMessage = () => {
    saveChats(currUser.username, chatFriend);

    socket.emit("sendMessage", { message, roomCode });
    setChats((prevChats) => [
      ...prevChats,
      { sender: currUser.username, message: message },
    ]);
    setMessage("");
    scrollToBottom();
  };

  const joinRoom = (roomCode) => {
    socket.emit("joinRoom", { roomCode: roomCode });
  };

  const getUser = (jwt) => {
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
  };

  const getChats = (roomCode) => {
    fetch("http://localhost:5000/chatCRUD/getChats/" + roomCode, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setChats(data);
      })
      .catch((err) => {
        console.log(err);
      });

    setTimeout(() => {
      scrollTop.current.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  useEffect(() => {
    joinRoom(roomCode);
    socket.on("recieveMessage", (data) => {
      saveChats(chatFriend, currUser.username);
      setMessageRecieved(data.message);
      setChats((prevChats) => [
        ...prevChats,
        { sender: chatFriend, message: data.message },
      ]);
      scrollToBottom();
    });

    const jwt = document.cookie
      .split("; ")
      .find((row) => row.startsWith("LOGIN_INFO"))
      .split("=")[1];

    getUser(jwt);
  }, [socket]);

  const selectedUser = (e) => {
    e.preventDefault();
    const roomString =
      currUser.username < e.target.innerHTML
        ? currUser.username + e.target.innerHTML
        : e.target.innerHTML + currUser.username;

    setRoomCode(roomString);
    joinRoom(roomString);

    setChatFriend(e.target.innerHTML);
    getChats(roomString);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
      e.target.value = "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#141D2C] text-white">
      <div className="fixed w-full top-0 left-0 z-50">
        <Navbar />
      </div>

      <div className="flex-grow flex w-full mt-16 p-4 gap-4">
        <div className="bg-[#1A2233] w-1/3 rounded-lg p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold text-violet-400 mb-4">Friends</h2>
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

          <div
            ref={msg}
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
            <div ref={scrollTop} />
          </div>

          <div className="mt-4 flex items-center">
            <input
              type="text"
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="bg-[#2A2E3D] text-white p-3 rounded-xl w-full"
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

      <footer className="bg-[#141D2C] text-gray-400 py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} HackBuddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
