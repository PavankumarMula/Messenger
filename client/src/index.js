import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import UserAuthProvider from "./context/userAuth";
import MessageCtxProvider from "./context/messagesContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <UserAuthProvider>
      <MessageCtxProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MessageCtxProvider>
    </UserAuthProvider>
  </>
);
