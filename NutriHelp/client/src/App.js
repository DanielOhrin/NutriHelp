import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { Spinner } from 'reactstrap';
import Header from "./components/Header";
import ApplicationViews from "./components/ApplicationViews";
import Footer from "./components/Footer"
import { onLoginStatusChange, getRole, getCurrentUID } from "./modules/authManager";
import { getCurrentProfile } from './modules/userProfileManager';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null),
    [credentials, setCredentials] = useState({})

  const CredentialsContext = createContext({})

  useEffect(() => {
    onLoginStatusChange(setIsLoggedIn);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => {
        getCurrentProfile(false)
          .then(userProfile => {
            const newCredentials = {
              Id: userProfile.id,
              role: userProfile.userType.name,
              email: userProfile.email
            }

            setCredentials(newCredentials)
          })
      }, 200)
    } else {
      setCredentials({})
    }
  }, [isLoggedIn])

  if (isLoggedIn === null) {
    return <Spinner className="app-spinner dark" />;
  }

  return (
    <Router>
      <CredentialsContext.Provider value={credentials}>
        <Header isLoggedIn={isLoggedIn} />
        <ApplicationViews isLoggedIn={isLoggedIn} />
      </CredentialsContext.Provider>
      <Footer />
    </Router>
  );
}

export default App;
