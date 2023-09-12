import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(`USERNAME: ${username}`);
    console.log(`PASSWORD: ${password}`);
    navigate("/landingpage");
  };

  const navigate = useNavigate();

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
