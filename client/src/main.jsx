import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminAuthProvider from "./context/AdminAuthContext";

import App from "./App.jsx";
import "./index.css";

import AuthProvider from "./context/AuthContext.jsx";
import CompanyAuthProvider from "./context/CompanyAuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CompanyAuthProvider>
          <AdminAuthProvider>
            <App />
            <Toaster position="top-right" />
          </AdminAuthProvider>
        </CompanyAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);