import React, { useEffect, useState } from "react";

// creating context
export const userAuth = React.createContext();

const UserAuthProvider = ({ children }) => {
  const isUserLoggedIn = localStorage.getItem("token") !== null;
  const [userName, setUserName] = useState("");

  

  // once the user logged in get his name
  const getLoginUser = (name) => {
    setUserName(name);
  };

  // function for logout user
  const logout = () => {
    localStorage.removeItem("token");
    setUserName("");
    localStorage.removeItem('messages');
    localStorage.removeItem("name");
    localStorage.removeItem('users')
  };

  const authCtxValue = {
    isUserLoggedIn,
    getLoginUser,
    userName,
    logout,
  };

  return (
    <>
      <userAuth.Provider value={authCtxValue}>{children}</userAuth.Provider>
    </>
  );
};

export default UserAuthProvider;
