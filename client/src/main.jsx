import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AuthProvider from "./context/AuthContext";

import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>

        <Toaster
          position="top-right"
          reverseOrder={false}
        />

        <App />

      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);