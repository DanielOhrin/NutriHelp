import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { useNavigate, Link } from "react-router-dom";
import { login, logout } from "../../modules/authManager";
import logo from "../../assets/images/company_logo.png"
import "./auth.css"

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const loginSubmit = (e) => {
    e.preventDefault();
    login(email, password)
      .then(statusCode => {
        if (statusCode === 204) {
          navigate("/")
        } else {
          alert("This account has been disabled")
        }
      })
      .catch(() => alert("Invalid email or password"));
  };

  return (
    <>
      <div className="text-center mt-4">
        <h1>Welcome to NutriHelp!</h1>
        <h3>The hottest app for tracking your health!</h3>
      </div>
      <section id="login-container">
        <img className="auth-logo" src={logo} alt="Logo" />
        <div id="login-box-container">
          <div id="login-box">
            <h1>Login</h1>
            <Form onSubmit={loginSubmit}>
              <fieldset>
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    autoComplete="email"
                    name="email"
                    type="text"
                    autoFocus
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <FormText color="danger" id="login-validation" className="hidden">This account has been deactivated.</FormText>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    autoComplete="current-password"
                    name="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Button>Login</Button>
                  <Link className="ml-4" to="/register">Need an account?</Link>
                </FormGroup>
              </fieldset>
            </Form>
          </div>
        </div>
      </section>
    </>
  );
}