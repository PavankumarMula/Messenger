import React, { useEffect, useState } from "react";
import Styles from "../styles/chatwindow.module.css";
import axios from "axios";
import { messagesCtx } from "../context/messagesContext";
import { useContext } from "react";
import GroupsBar from "./GroupsBar";

const ChatWindow = () => {
  const [typedmsg, setTypedMsg] = useState("");

  // context work
  const { messages, userName, fetchMsgsfromDb } = useContext(messagesCtx);
  

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
    <div style={{display:'flex'}}>
      <GroupsBar/>
      <div className={Styles.chatContainer}>
        <h2>Chat App</h2>
       <p>Sachin : Hello Folks</p>
       <p>Rohit : Hello Sir</p>
       <p>Virat : Hello Paaji</p>
       <p>Pavan : HII Sir</p>
       <p>Sachin : How Are you guys doing</p>
        <div className={Styles.message}>
          <input
            placeholder="type here"
            onChange={(e) => setTypedMsg(e.target.value)}
            value={typedmsg}
          ></input>
          <button onClick={sendMessagesToServer}>send</button>
        </div>
      </div>
      </div>
    </>
  );
};

export default ChatWindow;
