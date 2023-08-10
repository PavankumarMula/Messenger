import React from 'react'
import Styles from '../styles/chatwindow.module.css';

const ChatWindow = () => {
    
  return (
   <>
    <div className={Styles.chatContainer}>
      <h2>Chat App</h2>
      <p>Vaibhav:hello</p>
      <p>You joined</p>
      <p>Yash:Hello Folks How Are you</p>
      <p>Vaibhav:hello</p>
      <p>You joined</p>
      <p>Yash:Hello Folks How Are you</p>
      <p>Vaibhav:hello</p>
      <p>You joined</p>
      <p>Yash:Hello Folks How Are you</p>
      <p>Vaibhav:hello</p>
      <p>You joined</p>
      <p>Yash:Hello Folks How Are you</p>
      <p>Vaibhav:hello</p>
      <p>You joined</p>
      <p>Yash:Hello Folks How Are you</p>
      <div className={Styles.message}>
        <input placeholder='type here'></input>
        <button>send</button>
      </div>
    </div>
    
   </>
  )
}

export default ChatWindow