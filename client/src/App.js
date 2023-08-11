import './App.css';
import React from 'react'
import Signup from './Components/Signup';
import NavBar from './Components/NavBar';
import { Route, Routes } from "react-router-dom";
import ChatWindow from './Components/ChatWindow';
import { userAuth } from './context/userAuth';
import { useContext } from 'react';

const App = () => {
  const {isUserLoggedIn}=useContext(userAuth);
  console.log(isUserLoggedIn);
  return (
    <>
    <NavBar/>
   <Routes>
    <Route exact path='/' element={<Signup/>}></Route>
    <Route exact path='/home' element={<ChatWindow/>}></Route>
    <Route exact path='/register' element={<Signup/>}></Route>
   </Routes>
    </>
  )
}

export default App
