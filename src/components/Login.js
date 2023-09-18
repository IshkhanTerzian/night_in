import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import { useAuth } from "./AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { loggedInUsername, login } = useAuth(); 
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/login", { username, password })
      .then((response) => {
        console.log(response.data);
        const loggedInUsername = response.data.username;
        console.log(loggedInUsername);
        login(loggedInUsername); 
        navigate("/landingpage");
      })
      .catch((error) => {
        console.error(error.response.data.error);
        setErrorMessage("Login failed. Please check your credentials.");
      });
  };

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
      <Footer />
    </>
  );
};

export default Login;
