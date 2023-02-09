import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UsersTable from "./admin/UsersTable";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Daily from "./user/daily/Daily";
import Home from "./user/Home";
import Profile from "./user/Profile";

export default function ApplicationViews({ isLoggedIn, role }) {
  return (
    <main>
      <Routes>
        <Route path="/">
          <Route
            index
            element={isLoggedIn ? role === "Admin" ? <UsersTable /> : role === "User" ? <Home /> : <></> : <Navigate to="/login" />}
          />

          <Route path="profile" element={<Profile />} />
          <Route path="daily" element={<Daily />} />


          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route path="*" element={<p>Whoops, nothing here...</p>} />
        </Route>
      </Routes>
    </main>
  );
};
