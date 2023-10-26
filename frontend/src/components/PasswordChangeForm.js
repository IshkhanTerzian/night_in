import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";

import config from "../config.json";
import "../styles/PasswordChangeForm.css";

const PasswordChangeForm = () => {
  const navigate = useNavigate();
  // Variable that holds the logged in UserID
  const { loggedInUserId } = useAuth();

  // Variable that holds the current password of the user from the DB
  const [dbCurrentPassword, setDbCurrentPassword] = useState("");

  // Variable to hold the text typed from user to match password credentials
  const [currentPassword, setCurrentPassword] = useState("");

  // Variable to hold the new password entry for the account
  const [newPassword, setNewPassword] = useState("");

  // Variable to hold the confirmation of matching new passwords
  const [confirmPassword, setConfirmPassword] = useState("");

  // Variable to hold the error message for current password
  const [errorMessageForCurrentPassword, setErrorMessageForCurrentPassword] =
    useState("");

  // Variable to hold error message for matching passwords
  const [
    errorMessageForMatchingPasswords,
    setErrorMessageForMatchingPasswords,
  ] = useState("");

  useEffect(() => {
    axios
      .get(`${config.AWS_URL}/password/${loggedInUserId}`)
      .then((response) => {
        setDbCurrentPassword(response.data.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching users password", error);
      });
  }, [loggedInUserId]);

  /**
   * If the input validation passes, it sends a request to update the user's password
   */
  const handleUpdatePassword = () => {
    let currentPasswordError = "";
    let matchingPasswordsError = "";

    if (currentPassword.trim() === "") {
      currentPasswordError = "Current password cannot be empty";
    } else if (currentPassword !== dbCurrentPassword) {
      currentPasswordError = "Your password does not match";
    }

    if (newPassword.trim() === "") {
      matchingPasswordsError = "New password cannot be empty";
    }

    if (newPassword !== confirmPassword) {
      matchingPasswordsError = "Your password does not match";
    }

    setErrorMessageForCurrentPassword(currentPasswordError);
    setErrorMessageForMatchingPasswords(matchingPasswordsError);

    if (!currentPasswordError && !matchingPasswordsError) {
      axios
        .post(`${config.AWS_URL}/updatepassword/${loggedInUserId}`, {
          newPassword: newPassword,
        })
        .then((response) => {
          navigate("/successpasswordchange");
        })
        .catch((error) => {
          console.error("Error updating password", error);
        });
    }
  };

  return (
    <Container className="password-change-container">
      <h1 className="password-change-title">CHANGE PASSWORD</h1>
      <Form>
        <Form.Group controlId="currentPassword" className="mb-2 mt-5">
          <Container>
            <Row className="mb-1">
              <Col md="6" className="text-right">
                <Form.Label className="password-form-label">
                  Current Password
                </Form.Label>
              </Col>
              <Col md="6">
                <Form.Control
                  type="password"
                  placeholder="Enter current password"
                  className="password-form-control"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                {errorMessageForCurrentPassword && (
                  <div className="text-danger mt-2">
                    {errorMessageForCurrentPassword}
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </Form.Group>

        <Form.Group controlId="newPassword" className="mb-2">
          <Container>
            <Row className="mb-1">
              <Col md="6" className="text-right">
                <Form.Label className="password-form-label">
                  New Password
                </Form.Label>
              </Col>
              <Col md="6">
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  className="password-form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {errorMessageForMatchingPasswords && (
                  <div className="text-danger mt-2">
                    {errorMessageForMatchingPasswords}
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="mb-2">
          <Container>
            <Row className="mb-1">
              <Col md="6" className="text-right">
                <Form.Label className="password-form-label">
                  Confirm Password
                </Form.Label>
              </Col>
              <Col md="6">
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  className="password-form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errorMessageForMatchingPasswords && (
                  <div className="text-danger mt-2">
                    {errorMessageForMatchingPasswords}
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </Form.Group>

        <Button
          variant="primary"
          size="lg"
          onClick={handleUpdatePassword}
          className="mt-4"
        >
          Update Password
        </Button>
      </Form>
    </Container>
  );
};

export default PasswordChangeForm;
