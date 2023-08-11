import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import UserAuthProvider from "./context/userAuth";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <UserAuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserAuthProvider>
  </>
);
