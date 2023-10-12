import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

import Footer from "./Footer";
import "../styles/SuccessfulRegistration.css";

const SuccessfulRegistration = () => {
  const navigate = useNavigate();

  /**
   * Handles the event to send the user to the login screen
   */
  const handleGoToLogin = () => {
    navigate("/");
  };

  return (
    <div className="d-flex flex-column vh-100">
      <div className="top-banner">
        <h1>Successfully Registered</h1>
      </div>

      <Container className="text-center mt-5 flex-grow-1">
        <h1>SUCCESSFULLY REGISTERED YOUR ACCOUNT</h1>
        <Button variant="primary" onClick={handleGoToLogin}>
          Go back to Login
        </Button>
      </Container>

      <Footer className="sticky-footer" />
    </div>
  );
};

export default SuccessfulRegistration;
