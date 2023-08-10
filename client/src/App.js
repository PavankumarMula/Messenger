import './App.css';
import React from 'react'
import Signup from './Components/Signup';
import NavBar from './Components/NavBar';
import { Route, Routes } from "react-router-dom";
import ChatWindow from './Components/ChatWindow';

const App = () => {
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
