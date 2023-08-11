import React, { useState } from "react";
import styles from "../styles/signup.module.css";
import axios from "axios";
import ToastNotification from "../styles/toast";
import { toast } from "react-toastify";
import { useContext } from "react";
import { userAuth } from "../context/userAuth";
import {useNavigate} from 'react-router-dom'



const Signup = () => {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [haveAccount, setHaveAccount] = useState(false);

  // getting user Context
  const userAuthCtx=useContext(userAuth);

  // navigate from react router
  const navigate= useNavigate();
  

  const formHandler = async (e) => {
    e.preventDefault();
    const data = { name, mail, password, phone };

    if (haveAccount) {
      try {
        const res = await axios.post(`http://localhost:4000/login`, {
          mail,
          password,
        });
        const { message, name, token } = res.data;
        console.log(name);
        localStorage.setItem('token',token);
        userAuthCtx.getLoginUser(name);
        toast.success(message);
        navigate('/home');
      } catch (error) {
        toast.error(error.response.data.error);
      }
    } else {
      try {
        const res = await axios.post(`http://localhost:4000/signup`, data);
        if(res.status===200){
          toast.success(res.data);
          setHaveAccount(true);
        }

      } catch (error) {
        toast.error(error.response.data);
      }
    }

    setName("");
    setMail("");
    setPassword("");
    setPhone("");
  };

  const toggleHandler = () => {
    setHaveAccount((prev) => !prev);
  };

  return (
    <>
      <div className={styles.container}>
        <form onSubmit={formHandler} className={styles.formCard}>
          {!haveAccount && (
            <>
              <label>Name</label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </>
          )}

          <label>Email</label>
          <input
            type="email"
            onChange={(e) => setMail(e.target.value)}
            value={mail}
          />

          {!haveAccount && (
            <>
              <label>Phone</label>
              <input
                type="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </>
          )}

          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <button>{haveAccount ? "Login" : "Signup"}</button>
        </form>
        <button className={styles.toggle} onClick={toggleHandler}>
          {haveAccount ? "New User?" : "Have An Account"}
        </button>
      </div>
      <ToastNotification />
    </>
  );
};

export default Signup;
