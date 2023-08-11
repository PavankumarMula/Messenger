import React from "react";
import navStyles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import { userAuth } from "../context/userAuth";
import { useContext } from "react";

const NavBar = () => {
  // destructuring the logout function from userAuth Context
  const { logout } = useContext(userAuth);
  return (
    <>
      <div className={navStyles.header}>
        <div className={navStyles.links}>
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/register">Register</NavLink>
        </div>
        <button className={navStyles.logout} onClick={() => logout()}>
          Logout
        </button>
      </div>
    </>
  );
};

export default NavBar;
