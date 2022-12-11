import { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";
const socket = io.connect("http://localhost:3000");
function App() {
  const [MessageList, setMessageList] = useState([]);
  const [Room, setRoom] = useState("");
  const [Message, setMessage] = useState("");
  const JoinRoom = async () => {
    if (Room !== "") {
      socket.emit("join_room", Room);
    }
  };
  const SendMessage = async () => {
    if (Message !== "") {
      await socket.emit("send_message", {
        room: Room,
        id: socket.id,
        message: Message,
      });
    }
    setMessageList([
      ...MessageList,
      {
        room: Room,
        id: socket.id,
        message: Message,
      },
    ]);
    console.log(MessageList);
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList([
        ...MessageList,
        {
          room: data.room,
          id: data.id,
          message: data.message,
        },
      ]);
    });
  }, [socket]);
  return (
    <div className="App">
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">
              {" "}
              <div>
                <input
                  className="input input-bordered w-full max-w-xs"
                  placeholder="Enter Room to join"
                  onChange={(e) => {
                    setRoom(e.target.value);
                  }}
                />
                <button
                  className="btn btn-ghost btn-lg ml-2"
                  onClick={JoinRoom}
                >
                  Join
                </button>
              </div>
            </h1>
            <div className="mockup-phone">
              <div className="camera"></div>
              <div className="display">
                <div className="artboard artboard-demo phone-1 ">
                  <div >
                    {MessageList.map((element) => {
                      return (
                        <div>
                          {element.id === socket.id ? (
                            <div className="chat chat-end relative left-20">
                              <div className="chat-bubble chat-bubble-success">
                                {element.message}
                              </div>
                            </div>
                          ) : (
                            <div className="chat chat-start relative right-20">
                              <div className="chat-bubble chat-bubble-info">
                                {element.message}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex absolute bottom-40">
                    <input
                      className="input input-bordered w-44"
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                      placeholder="Enter Message"
                    />
                    <button className="btn btn-md ml-3" onClick={SendMessage}>
                      Send{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
