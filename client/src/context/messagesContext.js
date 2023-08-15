import axios from "axios";
import React, { useEffect, useState } from "react";
import { userAuth } from "./userAuth";
import { useContext } from "react";

// create a messages context
export const messagesCtx = React.createContext();

const MessageCtxProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [allUsers,setAllUsers]=useState([]);

  const { isUserLoggedIn, userName } = useContext(userAuth);

  useEffect(() => {
    if(isUserLoggedIn){
      const msgs=localStorage.getItem('messages');
      if(msgs){
        setMessages(JSON.parse(msgs));
      }else setMessages([]);
    }else{
      setMessages([]);
    }
  }, [isUserLoggedIn]);

 

  const fetchMsgsfromDb = async () => {
    console.log("fetching messages from backend")
    try {
      const res = await axios.get(`http://localhost:4000/getAllMsgs`);
      if (res.status === 200) {
        setMessages(res.data);
        localStorage.setItem('messages',JSON.stringify(res.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const messagesCtxValue = {
    messages,
    fetchMsgsfromDb,
    userName,
  };

  return (
    <>
      <messagesCtx.Provider value={messagesCtxValue}>
        {children}
      </messagesCtx.Provider>
    </>
  );
};

export default MessageCtxProvider;
