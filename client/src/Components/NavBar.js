import React from "react";
import navStyles from "../styles/NavBar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { userAuth } from "../context/userAuth";
import { useContext } from "react";

const NavBar = () => {
  // destructuring the logout function from userAuth Context
  const { logout,userName } = useContext(userAuth);
  console.log(userName)
  const navigate = useNavigate();

  // function for logging out
  const logoutHandler = () => {
    logout();
    navigate("./register");
  };

  return (
    <>
      <div className={navStyles.header}>
        <div className={navStyles.links}>
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/register">Register</NavLink>
        </div>
        <button className={navStyles.logout} onClick={logoutHandler}>
          Logout
        </button>
      </div>
    </>
  );
};

export default NavBar;
