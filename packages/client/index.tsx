import "./style.css";
import App from "./App";
import AuthProvider from "./contexts/AuthProvider";
import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
);
