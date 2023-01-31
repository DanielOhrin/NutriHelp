import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { Spinner } from 'reactstrap';
import Header from "./components/Header";
import ApplicationViews from "./components/ApplicationViews";
import { onLoginStatusChange, getRole } from "./modules/authManager";
import firebase from 'firebase/compat/app';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null),
    [role, setRole] = useState("")

  useEffect(() => {
    onLoginStatusChange(setIsLoggedIn);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getRole(firebase.auth().currentUser.uid)
        .then(userType => setRole(userType.name))
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
    </Router>
  );
}

export default App;
