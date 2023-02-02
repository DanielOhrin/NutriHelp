import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import { register } from "../../modules/authManager";
import { isDuplicateUserData } from "../../modules/userProfileManager";
import logo from "../../assets/images/company_logo.png"

export default function Register() {
  const navigate = useNavigate(),
    [credentials, setCredentials] = useState({
      email: "",
      password: "",
      confirmPassword: ""
    }),
    [profile, setProfile] = useState({
      username: "",
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
    emailTimeout = useRef(null)

  useEffect(() => {
    setEmailWarning(document.getElementById("register-email-validation"))
    setUsernameWarning(document.getElementById("register-username-validation"))
    setNextBtn(document.getElementById("register-next-btn"))
  }, [])

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

  useEffect(() => {
    clearTimeout(emailTimeout.current)

    emailTimeout.current = setTimeout(() => {
      if (credentials.email === "") return;
      isDuplicateUserData("email", credentials.email)
        .then(bool => {
          if (bool) {
            emailWarning.style.display = "inline"
          } else {
            emailWarning.style.display = "none"
          }
          setEmailWarning(document.getElementById("register-email-validation"))
        })
    }, 2000)
  }, [credentials.email, emailWarning])

  useEffect(() => {
    clearTimeout(usernameTimeout.current)

    usernameTimeout.current = setTimeout(() => {
      if (profile.username === "") return;

      isDuplicateUserData("username", profile.username)
        .then(bool => {
          if (bool) {
            usernameWarning.style.display = "inline"
          } else {
            usernameWarning.style.display = "none"
          }
          setUsernameWarning(document.getElementById("register-username-validation"))
        })
    }, 2000)


  }, [profile.username, usernameWarning])

  const validateCredentials = (e) => {
    e.preventDefault()

    if (true) {
      setEditingCredentials(!editingCredentials)
    } else {

    }
  }

  return (
    <section id="register-container">
      <img className="logo-background" src={logo} alt="Logo" />
      <div id="register-box">
        <h1>Register</h1>
        {
          editingCredentials ?
            <Form onSubmit={validateCredentials}>
              <fieldset>
                <FormGroup>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    autoComplete="username"
                    className="register-input"
                    name="username"
                    type="text"
                    value={profile.username}
                    maxLength={15}
                    onChange={changeState}
                  />
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
                  <Button id="register-next-btn" className="mx-2">Next</Button>
                  <FormText>Already have an account?</FormText>
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
