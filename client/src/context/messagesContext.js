import axios from "axios";
import React, { useEffect, useState } from "react";
import { userAuth } from "./userAuth";
import { useContext } from "react";

// create a messages context
export const messagesCtx = React.createContext();

const MessageCtxProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
 

  const { isUserLoggedIn, userName } = useContext(userAuth);

  useEffect(() => {
   const token=localStorage.getItem('token')
   if(token){
    fetchMsgsfromDb();
   }
  }, []);

 

  const fetchMsgsfromDb = async () => {
    console.log("fetching messages from backend")
    try {
      const res = await axios.get(`http://localhost:4000/getAllMsgs`);
      if (res.status === 200) {
        setMessages(res.data);
        console.log(res.data);
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
