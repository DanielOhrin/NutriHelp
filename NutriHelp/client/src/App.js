import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { Spinner } from 'reactstrap';
import Header from "./components/Header";
import ApplicationViews from "./components/ApplicationViews";
import Footer from "./components/Footer"
import { onLoginStatusChange, getRole, getCurrentUID } from "./modules/authManager";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null),
    [role, setRole] = useState("")

  useEffect(() => {
    onLoginStatusChange(setIsLoggedIn);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => {
        getRole(getCurrentUID())
          .then(userType => setRole(userType.name))
      }, 200)
    } else {
      setRole("")
    }
  }, [isLoggedIn])

  if (isLoggedIn === null) {
    return <Spinner className="app-spinner dark" />;
  }

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} role={role} />
      <ApplicationViews isLoggedIn={isLoggedIn} role={role} />
      <Footer />
    </Router>
  );
}

export default App;
