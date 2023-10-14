import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
// eslint-disable-next-line 
import config from "../config.json";

const Register = () => {
  const navigate = useNavigate();

  // Variable that holds the form data object
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /**
   * Handles the register process
   * @param {Event} e The form submission event
   */
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`https://cmi6sikkb9.execute-api.us-east-1.amazonaws.com/Prod/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      navigate("/successfulregistration");
    } catch (error) {
      console.error("Registration failed:", error.response.data.error);
    }
  };

  return (
    <>
      <div className="top-banner">
        <h1>Register Now!</h1>
      </div>
      <Container className="login-container">
        <Row className="justify-content-center">
          <Col md={6} className="login-form">
            <h2 className="text-center">Create Your Account</h2>
            <Form onSubmit={handleRegister}>
              <Form.Group controlId="username">
                <Form.Label className="mt-3">Username</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  className="centered-text-input"
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label className="mt-3">Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="centered-text-input"
                />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label className="mt-3">Password</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="centered-text-input"
                />
              </Form.Group>

              <Form.Group controlId="confirmPassword">
                <Form.Label className="mt-3">Confirm Your Password</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  className="centered-text-input"
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Register
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Register;
