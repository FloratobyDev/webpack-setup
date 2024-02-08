import "./style.css";
import App from "./App";
import AuthProvider from "./contexts/AuthProvider";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom/client";
import Snackbar from "./contexts/Snackbar";
import { store } from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AuthProvider>
      <Snackbar>
        <App />
      </Snackbar>
    </AuthProvider>
  </Provider>,
);
