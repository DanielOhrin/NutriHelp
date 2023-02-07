import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Daily from "./user/daily/Daily";
import Home from "./user/Home";

export default function ApplicationViews({ isLoggedIn, role }) {
  return (
    <main>
      <Routes>
        <Route path="/">
          <Route
            index
            element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
          />

          <Route path="daily" element={<Daily />} />

          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route path="*" element={<p>Whoops, nothing here...</p>} />
        </Route>
      </Routes>
    </main>
  );
};
