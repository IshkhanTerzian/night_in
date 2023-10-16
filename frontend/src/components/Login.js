import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";

import "../styles/Login.css";
import Footer from "./Footer";

const Login = () => {
  const navigate = useNavigate();

  // Variable to check if the user has logged in
  const { login } = useAuth();

  // Variable to hold the UserName
  const [username, setUsername] = useState("");

  // Variable to hold the password
  const [password, setPassword] = useState("");

  // Variable to hold the error message
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Sends a POST request to the backend with the provided username and password,
   * upon successful login stores user data in local storage.
   * @param {Event} e - The form submission event
   */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://cmi6sikkb9.execute-api.us-east-1.amazonaws.com/Prod/`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const userInfo = response.data.data;

      const loggedInUser = userInfo.UserName;
      login(loggedInUser, userInfo.UserId);
      localStorage.setItem("username", loggedInUser);
      localStorage.setItem("userId", userInfo.UserId);
      localStorage.setItem("userType", userInfo.UserType);
      navigate("/landingpage");
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  /**
   * Navigates to the registration page when the button is clicked
   */
  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <>
      <div className="top-banner">
        <h1>Welcome to Night-In</h1>
      </div>

      <Container className="login-container">
        <Row className="justify-content-center">
          <Col md={6} className="login-form">
            <h2 className="text-center">Login</h2>
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="username">
                <Form.Label className="mt-3">Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="centered-text-input"
                />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label className="mt-3">Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="centered-text-input"
                />
              </Form.Group>

              {errorMessage && (
                <Alert variant="danger" className="mt-3">
                  {errorMessage}
                </Alert>
              )}

              <Button variant="primary" type="submit" className="w-100">
                Sign in
              </Button>

              <Button
                variant="secondary"
                type="button"
                className="w-100 mt-3"
                onClick={handleRegisterClick}
              >
                Register
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      <Footer className="sticky-footer" />
    </>
  );
};

export default Login;
