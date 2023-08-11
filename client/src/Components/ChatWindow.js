import React, { useEffect, useState } from "react";
import Styles from "../styles/chatwindow.module.css";
import axios from "axios";
import { messagesCtx } from "../context/messagesContext";
import { useContext } from "react";

const ChatWindow = () => {
  const [typedmsg, setTypedMsg] = useState("");

  // context work
  const { messages, userName, fetchMsgsfromDb } = useContext(messagesCtx);

  // fetching the all messages from data base
  useEffect(() => {}, []);

  // sending the user typed message in the backend
  const sendMessagesToServer = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const res = await axios.post(
        `http://localhost:4000/sendMsg`,
        {
          message: typedmsg,
        },
        {
          headers: { Authorization: token },
        }
      );

      if (res.status === 200) {
        fetchMsgsfromDb();
      }
    }

    setTypedMsg("");
  };

  return (
    <>
      <div className={Styles.chatContainer}>
        <h2>Chat App</h2>
        {messages.length > 0 &&
          messages.map((obj) => {
            return (
              <p>
                {obj.userName} : {obj.message}
              </p>
            );
          })}
        <div className={Styles.message}>
          <input
            placeholder="type here"
            onChange={(e) => setTypedMsg(e.target.value)}
            value={typedmsg}
          ></input>
          <button onClick={sendMessagesToServer}>send</button>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
