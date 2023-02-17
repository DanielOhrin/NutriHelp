import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { Spinner } from 'reactstrap';
import Header from "./components/Header";
import ApplicationViews from "./components/ApplicationViews";
import Footer from "./components/Footer"
import { onLoginStatusChange } from "./modules/authManager";
import { getCurrentProfile } from './modules/userProfileManager';
import { CredentialsContext } from './context/CredentialsContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null),
    [credentials, setCredentials] = useState({})


  useEffect(() => {
    onLoginStatusChange(setIsLoggedIn);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => {
        getCurrentProfile(false)
          .then(userProfile => {
            const newCredentials = {
              id: userProfile.id,
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
      <CredentialsContext.Provider value={{ credentials }}>
        <Header isLoggedIn={isLoggedIn} />
        <ApplicationViews isLoggedIn={isLoggedIn} />
        <Footer />
      </CredentialsContext.Provider>
    </Router>
  );
}

export default App;
