import React from "react";
import navStyles from "../styles/NavBar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { userAuth } from "../context/userAuth";
import { useContext } from "react";

const NavBar = () => {
  // destructuring the logout function from userAuth Context
  const { logout } = useContext(userAuth);

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
        <h4>{localStorage.getItem('name')}</h4>
        <button className={navStyles.logout} onClick={logoutHandler}>
          Logout
        </button>
      </div>
    </>
  );
};

export default NavBar;
