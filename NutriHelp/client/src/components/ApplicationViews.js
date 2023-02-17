import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UsersTable from "./admin/UsersTable";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Ticket from "./tickets/Ticket";
import Daily from "./user/daily/Daily";
import Home from "./user/Home";
import Profile from "./user/Profile";
import Support from "./user/Support";
import { CredentialsContext } from "../context/CredentialsContext";

export default function ApplicationViews({ isLoggedIn }) {
  const { credentials } = useContext(CredentialsContext)

  return (
    <main>
      <Routes>
        <Route path="/">
          <Route
            index
            element={isLoggedIn ? credentials.role === "Admin" ? <UsersTable /> : credentials.role === "User" ? <Home /> : <></> : <Navigate to="/login" />}
          />

          <Route path="profile" element={isLoggedIn && credentials.role === "User" ? <Profile /> : <></>} />
          <Route path="daily" element={isLoggedIn && credentials.role === "User" ? <Daily /> : <></>} />
          <Route path="support" element={isLoggedIn && credentials.role === "User" ? <Support /> : <></>} />
          <Route path="ticket/:ticketId" element={isLoggedIn ? <Ticket credentials={credentials} /> : <></>} />

          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route path="*" element={<p>Whoops, nothing here...</p>} />
        </Route>
      </Routes>
    </main>
  );
};
