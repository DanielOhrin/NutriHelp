import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../modules/authManager";
import { isDuplicateUserData } from "../../modules/userProfileManager";
import logo from "../../assets/images/company_logo.png"

export default function Register() {
  const navigate = useNavigate(),
    [credentials, setCredentials] = useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    }),
    [profile, setProfile] = useState({
      firstName: "",
      lastName: "",
      gender: "",
      birthDate: "",
      weight: 0,
      height: 0,
      activityLevel: 0,
      weightGoal: 0
    }),
    [editingCredentials, setEditingCredentials] = useState(true)

  // Validation variables
  const [emailWarning, setEmailWarning] = useState(null),
    [usernameWarning, setUsernameWarning] = useState(null),
    [nextBtn, setNextBtn] = useState(null)

  // Variables for debouncing
  const usernameTimeout = useRef(null),
    emailTimeout = useRef(null),
    nextBtnToggle = useRef(null)

  // Stores DOM elemenmts for easy access
  useEffect(() => {
    setEmailWarning(document.getElementById("register-email-validation"))
    setUsernameWarning(document.getElementById("register-username-validation"))
    setNextBtn(document.getElementById("register-next-btn"))

    return () => {
      clearTimeout(usernameTimeout)
      clearTimeout(emailTimeout)
    }
  }, [])

  // Disables "next" button by default
  useEffect(() => {
    if (nextBtn !== null) nextBtn.disabled = true;
  }, [nextBtn])

  // Debouncing for email
  useEffect(() => {
    if (emailTimeout.current === null && credentials.email.trim() === "") return;

    clearTimeout(emailTimeout.current)

    if (credentials.email.trim() === "") {
      emailWarning.style.display = "none"
      return
    }

    emailTimeout.current = setTimeout(() => {
      isDuplicateUserData("email", credentials.email)
        .then(bool => {
          if (bool) {
            emailWarning.style.display = "inline"
          } else {
            emailWarning.style.display = "none"
          }
        })
      emailTimeout.current = null
    }, 1000)
  }, [credentials.email, emailWarning])

  // Debouncing for username
  useEffect(() => {
    if (emailTimeout.current === null && credentials.username.trim() === "") return;

    clearTimeout(usernameTimeout.current)

    if (credentials.username.trim() === "") {
      usernameWarning.style.display = "none"
      return
    }

    usernameTimeout.current = setTimeout(() => {

      isDuplicateUserData("username", credentials.username)
        .then(bool => {
          if (bool) {
            usernameWarning.style.display = "inline"
          } else {
            usernameWarning.style.display = "none"
          }
        })
      usernameTimeout.current = null
    }, 1000)


  }, [credentials.username, usernameWarning])

  // Conditionals for allowing user to continue the form
  //! Note: I did not add any validation for email other than checking for duplicates.
  useEffect(() => {
    clearTimeout(nextBtnToggle.current)

    nextBtnToggle.current = setTimeout(() => {
      if (nextBtn !== null) {
        if (
          usernameTimeout.current === null
          && emailTimeout.current === null
          && usernameWarning.style.display === "none"
          && emailWarning.style.display === "none"
          && !Object.values(credentials).includes("")
          && credentials.username.trim().length >= 5
          && credentials.password === credentials.confirmPassword) {
          nextBtn.disabled = false;
        } else {
          nextBtn.disabled = true;
        }
      }
    }, 1250)
  }, [nextBtn, usernameWarning, emailWarning, credentials])

  const changeState = (e) => {
    if (Object.keys(credentials).includes(e.target.name)) {
      const copy = { ...credentials }
      copy[e.target.name] = e.target.value

      setCredentials(copy)
    } else {
      const copy = { ...profile }

      if (e.target.name === "activityLevel") {
        copy.activityLevel = parseFloat(e.target.value)
      } else {
        copy[e.target.name] = isNaN(e.target.value) || e.target.value === "" ? e.target.value : parseInt(e.target.value)
      }

      setProfile(copy)
    }
  }

  return (
    <section id="register-container">
      <img className="logo-background" src={logo} alt="Logo" />
      <div id="register-box">
        <h1>Register</h1>
        {
          editingCredentials ?
            <Form onSubmit={e => { e.preventDefault(); setEditingCredentials(!editingCredentials) }}>
              <fieldset>
                <FormGroup>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    autoComplete="username"
                    className="register-input"
                    name="username"
                    type="text"
                    value={credentials.username}
                    maxLength={15}
                    onChange={changeState}
                  />
                  <FormText>Mininum Length: 5</FormText>
                  <br />
                  <FormText color="danger" id="register-username-validation" className="hidden">An account with that username already exists.</FormText>
                </FormGroup>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    autoComplete="email"
                    className="register-input"
                    name="email"
                    type="text"
                    value={credentials.email}
                    maxLength={30}
                    onChange={changeState}
                  />
                  <FormText color="danger" id="register-email-validation" className="hidden">An account with that email already exists.</FormText>
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    autoComplete="new-password"
                    className="register-input"
                    name="password"
                    type="password"
                    value={credentials.password}
                    onChange={changeState}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="confirmPassword">Confirm Password</Label>
                  <Input
                    autoComplete="new-password"
                    className="register-input"
                    name="confirmPassword"
                    type="password"
                    value={credentials.confirmPassword}
                    onChange={changeState}
                  />
                  <FormText color="danger" className={(credentials.password === credentials.confirmPassword ? "hidden" : "")}>Passwords do not match.</FormText>
                </FormGroup>
                <FormGroup>
                  <Button id="register-next-btn">Next</Button>
                  <FormText className="ml-4">
                    <Link to="/login">Already have an account?</Link>
                  </FormText>
                </FormGroup>
              </fieldset>
            </Form>
            : <Form>
              <fieldset>
                <FormGroup>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    className="register-input"
                    name="firstName"
                    type="text"
                    value={profile.firstName}
                    maxLength={25}
                    onChange={changeState}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    className="register-input"
                    name="lastName"
                    type="text"
                    value={profile.lastName}
                    maxLength={25}
                    onChange={changeState}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="gender">Gender</Label>
                  <select className="form-control register-input" name="gender" onChange={changeState}>
                    <option value="" hidden>Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="birthDate">Date of Birth</Label>
                  <Input
                    className="register-input"
                    name="birthDate"
                    type="date"
                    value={profile.birthDate}
                    onChange={changeState}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="weight">Weight (lbs.)(Change to include calculations)</Label>
                  <Input
                    className="register-input"
                    name="weight"
                    type="number"
                    value={profile.weight}
                    onChange={changeState}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="height">Height (in.)(Change to include calculations)</Label>
                  <Input
                    className="register-input"
                    name="height"
                    type="number"
                    value={profile.height}
                    onChange={changeState}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="activityLevel">Activity Level</Label>
                  <select className="form-control register-input" name="activityLevel" onChange={changeState}>
                    <option value="" hidden>Select Level</option>
                    <option value="1.2">Sedentary</option>
                    <option value="1.3">Light/Average Exercise</option>
                    <option value="1.4">Extreme Exercise</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="weightGoal">Weight Goal</Label>
                  <select className="form-control register-input" name="weightGoal" onChange={changeState}>
                    <option value="" hidden>Select Goal</option>
                    <option value="1">Lose 2 lbs./week</option>
                    <option value="2">Lose 1 lb./week</option>
                    <option value="3">Maintain Weight</option>
                    <option value="4">Gain 1 lb./week</option>
                    <option value="5">Gain 2 lbs./week</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <Button onClick={(e) => { clearTimeout(); navigate("/login") }}>Cancel</Button>
                  <Button className="mx-4">Register</Button>
                </FormGroup>
              </fieldset>
            </Form >
        }
      </div>
    </section>
  );
}
