import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleRegister = (e) => {
    e.preventDefault();

    // Reset previous errors
    setErrors({
      username: "",
      email: "",
      password: "",
    });

    // Error handling for username length
    if (formData.username.length < 5 || formData.username.length > 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "Username must be between 5 and 10 characters.",
      }));
      return;
    }

    // Error handling for email host
    const emailHost = formData.email.split("@")[1];
    if (!emailHost || !emailHost.includes(".")) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email address.",
      }));
      return;
    }

    // Error handling for password matching confirmPassword
    if (formData.password !== formData.confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Passwords do not match.",
      }));
      return;
    }

    console.log("Registration data:", formData);
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
                {errors.username && (
                  <Alert variant="danger">{errors.username}</Alert>
                )}
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
                {errors.email && <Alert variant="danger">{errors.email}</Alert>}
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
                {errors.password && (
                  <Alert variant="danger">{errors.password}</Alert>
                )}
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

      <div className="bottom-banner">
        <h1>copyright @ Ishkhan Terzian</h1>
      </div>
    </>
  );
};

export default Register;
