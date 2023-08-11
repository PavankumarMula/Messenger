import React, { useState } from "react";
import Styles from "../styles/chatwindow.module.css";
import axios from "axios";

const ChatWindow = () => {
  const [typedmsg, setTypedMsg] = useState("");

  // sending the user typed message in the backend
  const sendMessagesToServer = async () => {
    const token=localStorage.getItem('token');
    if(token){
     const res= await axios.post(`http://localhost:4000/sendMsg`,{
       message:typedmsg
      },
      {
        headers:{Authorization:token}
      })

      console.log(res);
    }

   setTypedMsg("");

  };


  return (
    <>
      <div className={Styles.chatContainer}>
        <h2>Chat App</h2>
        <p>Vaibhav:hello</p>
        <p>You joined</p>
        <p>Yash:Hello Folks How Are you</p>
        <p>Vaibhav:hello</p>
        <p>You joined</p>
        <p>Yash:Hello Folks How Are you</p>
        <p>Vaibhav:hello</p>
        <p>Yash:Hello Folks How Are you</p>
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
