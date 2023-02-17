import React, { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { useNavigate } from "react-router";
import "../styles/ChatRoom.css";

import { db, auth, timestamp } from "../firebase/config";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

function UsersComponent({ currentUid, setReceiver, users }) {
  const navigate = useNavigate();
  const handleToggle = (name, uid) => {
    setReceiver({
      name,
      uid,
    });
    console.log(uid);
    navigate(`/chatroom/${uid}`);
    console.log(users);
  };

  return (
    <ul
      // dense
      className="users-comp"
    >
      {users.length > 0 &&
        users.map((value, index) => {
          if (currentUid !== value.uid)
            return (
              <li
                key={Math.random().toString()}
                className="user-userpanel"
                // disablePadding
              >
                <button
                  className="users-comp-btn"
                  type="button"
                  onClick={() => {
                    handleToggle(value.name, value.uid);
                  }}
                >
                  {value.online && <span className="online-user"></span>}
                  <span>
                    {value.name}, {value.email}{" "}
                  </span>
                </button>
              </li>
            );
        })}
    </ul>
  );
}

export default function ChatRoom() {
  const [users, setUsers] = useState([]);

  const [receiver, setReceiver] = useState(null);
  const [chatMessage, setChatMessage] = useState("");

  const [allMessages, setAllMessages] = useState([]);

  const user = auth.currentUser;

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      console.log(snapshot.docs.map((doc) => doc.data()));
      setUsers(snapshot.docs.map((doc) => doc.data()));
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (receiver) {
      const unsub = onSnapshot(
        query(
          collection(
            db,
            "users",
            user?.uid,
            "chats",
            receiver?.uid,
            "messages"
          ),
          orderBy("sentAt")
        ),
        (snapshot) => {
          setAllMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              messages: doc.data(),
            }))
          );
        }
      );
      return unsub;
    }
  }, [receiver?.uid]);

  const sendMessage = async () => {
    try {
      if (user && receiver) {
        await addDoc(
          collection(db, "users", user.uid, "chats", receiver.uid, "messages"),
          {
            username: user.displayName,
            messageUid: user.uid,
            message: chatMessage,
            sentAt: timestamp.fromDate(new Date()),
          }
        );

        await addDoc(
          collection(db, "users", receiver.uid, "chats", user.uid, "messages"),
          {
            username: user.displayName,
            messageUid: user.uid,
            message: chatMessage,
            sentAt: timestamp.fromDate(new Date()),
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
    setChatMessage("");
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "row", flex: 1, width: "100%" }}
    >
      <div
        style={{
          display: "flex",
          flex: 0.2,
          height: "95vh",
          margin: 10,
          flexDirection: "column",
          backgroundColor: "#f2eecb",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: 5,
            justifyContent: "space-between",
          }}
        >
          <h4 style={{ margin: 0 }}>{user.displayName} </h4>
        </div>
        <div style={{ overflowY: "scroll" }}>
          <UsersComponent
            users={users}
            setReceiver={setReceiver}
            currentUid={user?.uid}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flex: 0.8,
          height: "95vh",
          margin: 10,
          flexDirection: "column",
        }}
      >
        <h4 style={{ margin: 2, padding: 10 }}>
          {receiver ? receiver.username : user?.displayName}{" "}
        </h4>

        {/* <Divider /> */}
        <div
          style={{
            backgroundColor: "#FBEEE6",
            padding: 5,
            display: "flex",
            flexDirection: "column",
            flex: 1,
            maxHeight: 460,
            overflowY: "scroll",
          }}
        >
          {/* messages area */}

          {allMessages &&
            allMessages.map(({ id, messages }) => {
              return (
                <div
                  key={id}
                  style={{
                    margin: 2,
                    display: "flex",
                    flexDirection:
                      user?.uid == messages.messageUid ? "row-reverse" : "row",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#BB8FCE",
                      padding: 6,
                      borderTopLeftRadius:
                        user?.uid == messages.messageUid ? 10 : 0,
                      borderTopRightRadius:
                        user?.uid == messages.messageUid ? 0 : 10,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      maxWidth: 400,
                      fontSize: 15,
                      textAlign:
                        user?.uid == messages.messageUid ? "right" : "left",
                    }}
                  >
                    {messages.message}
                  </span>
                </div>
              );
            })}
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            flex: 0.08,
            backgroundColor: "#f2eecb",
          }}
        >
          <input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            style={{
              flex: 1,
              outline: "none",
              borderRadius: 5,
              border: "none",
            }}
            type="text"
            placeholder="Type message..."
          />
          <button
            style={{ background: "none", color: "blue" }}
            onClick={sendMessage}
            // onKeyDown={(event) => {
            //   if (event.key === "Enter") {
            //     console.log("YAYY");
            //     sendMessage();
            //   }
            // }}
          >
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
}
