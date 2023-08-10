import React from 'react'
import navStyles from '../styles/NavBar.module.css';
import {NavLink} from 'react-router-dom'

const NavBar = () => {
  return (
   <>
   <div className={navStyles.header}>
   <div className={navStyles.links}>
    <NavLink to='/home'>Home</NavLink>
    <NavLink to='/register'>Register</NavLink>
   </div>
   </div>
   </>
  )
}

export default NavBar