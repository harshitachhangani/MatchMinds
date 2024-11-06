import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";

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

    const saveChats = (user1, user2) => {
        fetch("https://teammatch-backend.onrender.com/chatCRUD/saveChats", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user1, user2, roomCode, message }),
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
    };

    const sendMessage = () => {
        saveChats(currUser.username, chatFriend);

        socket.emit("sendMessage", { message, roomCode });
        const container = document.createElement("div");
        container.className = "flex justify-end w-full";

        const send = document.createElement("h1");
        send.innerHTML = message;
        send.className =
            "bg-[#595959] p-2 rounded-xl max-w-4/6 text-pretty text-white ";

        container.appendChild(send);
        msg.current.appendChild(container);
        console.log("Message sent");
        
        scrollTop.current.scrollIntoView({ behavior: "smooth" });

    };

    const joinRoom = (roomCode) => {
        socket.emit("joinRoom", { roomCode: roomCode });
        console.log("Room joined", roomCode);
    };

    const getUser = (jwt) => {
        fetch("https://teammatch-backend.onrender.com/auth/getLoggedInUser", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: jwt,
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setCurrUser(data.user);
                setFriends(data.user.friends);
                setChatFriend(data.user.friends[0]);
                console.log(data.user, "user");
                console.log(data.user.friends, "friends");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getChats = (roomCode) => {
        console.log(roomCode, "inside getChats roomcod");
        fetch("https://teammatch-backend.onrender.com/chatCRUD/getChats/" + roomCode, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setChats(data);
                console.log(data, "chats");
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
            const container = document.createElement("div");
            container.className = "flex justify-start max-w-4/6 ";

            const recieve = document.createElement("h1");
            recieve.innerHTML = data.message;
            recieve.className = "bg-[#595959] text-white p-2 rounded-xl text-wrap";

            container.appendChild(recieve);
            msg.current.appendChild(container);
            scrollTop.current.scrollIntoView({ behavior: "smooth" });

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
        console.log(roomString, "roomtString");

        setRoomCode(roomString);
        joinRoom(roomString);

        setChatFriend(e.target.innerHTML);
        getChats(roomString);

        console.log(roomString, "roomString");
        console.log(e.target.innerHTML);
        console.log("Selected");

    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
            e.target.value = "";
        }
    };

    return (
        <div>
            <div className="p-2 bg-black h-screen flex gap-2">
                {/* <Navbar></Navbar> */}
                {friends.length === 0 ? (
                    <div className="w-full h-full flex justify-center items-center ">
                        <Link to="/searchUser">
                            <div className="flex items-center gap-6 hover:bg-gray-300 cursor-pointer bg-white p-2 px-4 rounded-full text-2xl font-semibold">
                                Find Friends
                                <FaArrowRightLong></FaArrowRightLong>
                            </div>
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col h-full w-fit rounded-md bg-[#595959] text-white text-opacity-90 opacity-85">
                            {friends.map((friend) => {
                                return (
                                    <div key={friend}>
                                        <div className="flex justify-between items-center hover:-translate-y-[2px] hover:translate-x-[2px] cursor-pointer">
                                            <div
                                                className="pl-2 m-2 rounded-2xl px-6 hover:bg-gray-400 cursor-pointer font-bricolage uppercase font-medium text-xl"
                                                onClick={selectedUser}
                                            >
                                                {friend}
                                            </div>
                                            <div className="pr-2">
                                                <FaArrowRightLong></FaArrowRightLong>
                                            </div>
                                        </div>
                                        <hr className="h-0 border-t-2-[1px] border-black  border-opacity-40" />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="w-full rounded-md bg-gray-200 text-black">
                            <div className="w-full p-2 px-3 uppercase font-medium flex justify-between">
                                {chatFriend}
                                <Link to="/">
                                    <div>Home</div>
                                </Link>
                            </div>
                            <hr className="h-0 border-t-[1px] border-opacity-50 border-black" />
                            <div className="h-[85%] ">
                                <div
                                    className="overflow-scroll flex flex-col gap-1 h-full p-2"
                                    ref={msg}
                                >
                                    {chats.map((chat, i) => {
                                        return (
                                            <div key={i}>
                                                {chat.sender === currUser.username ? (
                                                    <div className="flex justify-end max-w-4/6">
                                                        <div className="bg-[#595959] p-2 rounded-xl max-w-4/6 text-pretty text-white ">
                                                            {chat.message}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-start max-w-4/6">
                                                        <div className="bg-[#595959] p-2 rounded-xl max-w-4/6 text-pretty text-white ">
                                                            {chat.message}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    <div ref={scrollTop}>

                                    </div>
                                </div>

                                <div className="w-full">
                                    <div className="fixed bottom-[8px] rounded-md h-fit bg-[#595959] w-[86.6%] p-2">
                                        <input
                                            type="text"
                                            placeholder="Message..."
                                            className="border-2 p-2 m-2 border-black rounded-xl w-10/12"
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                        />
                                        <button
                                            onClick={sendMessage}
                                            className="bg-blue-300 hover:bg-blue-600 p-3 rounded-xl w-1/12"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
