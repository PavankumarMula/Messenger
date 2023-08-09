import React, { useState } from "react";
import styles from "../styles/signup.module.css";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [haveAccount, setHaveAccount] = useState(false);

  // form handler
  const formHandler = async (e) => {
    e.preventDefault();
    const data = { name, mail, password, phone };
    // if the user has already an  account
    if (haveAccount === true) {
      console.log(`user has an account`);
    }

    // if the user has NO account
    else {
      try {
        const res = await axios.post(`http://localhost:4000/signup`, data);
        alert(res.data);
      } catch (error) {
        alert(error.response.data);
      }
    }

    setName("");
    setMail("");
    setPassword("");
    setPhone("");
  };

  // this handler toggles b/w have an account and not having account
  const toggleHandler = () => {
    setHaveAccount((prev) => !prev);
  };

  return (
    <>
      <div className={styles.container}>
        <form onSubmit={formHandler} className={styles.formCard}>
          {haveAccount === false && (
            <>
              {" "}
              <label>Name</label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
              ></input>
            </>
          )}

          <label>Email</label>
          <input
            type="email"
            onChange={(e) => setMail(e.target.value)}
            value={mail}
          ></input>

          {haveAccount === false && (
            <>
              {" "}
              <label>Phone</label>
              <input
                type="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              ></input>
            </>
          )}

          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          ></input>

          <button>{haveAccount ? "Login" : "Signup"}</button>
        </form>
        <button className={styles.toggle} onClick={toggleHandler}>
          {haveAccount ? "New User?" : "Have An Account"}
        </button>
      </div>
    </>
  );
};

export default Signup;
