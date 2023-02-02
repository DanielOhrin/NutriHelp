import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import { register } from "../../modules/authManager";
import { isDuplicateUserData } from "../../modules/userProfileManager";
import logo from "../../assets/images/NutriHelp_logo.png"

export default function Register() {
  const navigate = useNavigate(),
    [credentials, setCredentials] = useState({
      email: "",
      password: "",
      confirmPassword: ""
    }),
    [profile, setProfile] = useState({
      userName: "",
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

  // Variables for debouncing
  const userNameTimeout = setTimeout(() => { }, 5000),
    emailTimeout = setTimeout(() => { }, 5000)


  useEffect(() => {
    isDuplicateUserData("email", "xqiam@outlook.com").then(bool => console.log(bool));
  }, [])

  const changeState = (e) => {
    if (Object.keys(credentials).includes(e.target.name)) {
      const copy = { ...credentials }
      copy[e.target.name] = e.target.value

      setCredentials(copy)
    } else {
      const copy = { ...profile }
      copy[e.target.name] = e.target.value

      setProfile(copy)
    }
  }

  const isUnique = useCallback((field) => {

  }, [])

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
                  <Label htmlFor="userName">Username</Label>
                  <Input
                    className="register-input"
                    name="userName"
                    type="text"
                    onChange={changeState}
                  />
                  <FormText color="danger" className="hidden">An account with that username already exists.</FormText>
                </FormGroup>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    className="register-input"
                    name="email"
                    type="text"
                    onChange={changeState}
                  />
                  <FormText color="danger" className="hidden">An account with that email already exists.</FormText>
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    className="register-input"
                    name="password"
                    type="password"
                    onChange={changeState}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="confirmPassword">Confirm Password</Label>
                  <Input
                    className="register-input"
                    name="confirmPassword"
                    type="password"
                    onChange={changeState}
                  />
                </FormGroup>
                <FormGroup>
                  <Button className="mx-2">Next</Button>
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
                    onChange={changeState}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    className="register-input"
                    name="lastName"
                    type="text"
                    onChange={changeState}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="gender">Gender (Change to select)</Label>
                  <Input
                    className="register-input"
                    name="gender"
                    type="text"
                    onChange={changeState}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="birthDate">Date of Birth (Change to date input (local))</Label>
                  <Input
                    className="register-input"
                    name="birthDate"
                    type="text"
                    onChange={changeState}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="weight">Weight (Change to include calculations)</Label>
                  <Input
                    className="register-input"
                    name="weight"
                    type="text"
                    onChange={changeState}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="height">Height (Change to include calculations)</Label>
                  <Input
                    className="register-input"
                    name="height"
                    type="text"
                    onChange={changeState}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="activityLevel">activity level(Change to select)</Label>
                  <Input
                    className="register-input"
                    name="activityLevel"
                    type="text"
                    onChange={changeState}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="weightGoal">Weight goal (Change to select)</Label>
                  <Input
                    className="register-input"
                    name="weightGoal"
                    type="text"
                    onChange={changeState}
                  />
                </FormGroup>
                <FormGroup>
                  <Button onClick={(e) => { e.preventDefault(); setEditingCredentials(!editingCredentials) }}>Back</Button>
                  <Button className="mx-4">Register</Button>
                </FormGroup>
              </fieldset>
            </Form >
        }
      </div>
    </section>
  );
}
