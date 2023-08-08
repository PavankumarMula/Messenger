import React, { useState } from "react";
import styles from "../styles/signup.module.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // form handler
  const formHandler = (e) => {
    e.preventDefault();
    console.log(name, mail, password, phone);
    setName("");
    setMail("");
    setPassword("");
    setPhone("");
  };

  return (
    <>
      <div className={styles.container}>
        <form onSubmit={formHandler} className={styles.formCard}>

          <label>Name</label>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          ></input>

          <label>Email</label>
          <input
            type="email"
            onChange={(e) => setMail(e.target.value)}
            value={mail}
          ></input>

          <label>Phone</label>
          <input
            type="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          ></input>

          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          ></input>
          
          <button>Submit</button>
          <button>Have An Account?</button>
        </form>
      </div>
    </>
  );
};

export default Signup;
