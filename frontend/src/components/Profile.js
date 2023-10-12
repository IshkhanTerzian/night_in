import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { Container, Row, Col } from "react-bootstrap";

import NavbarComponent from "./NavbarComponent";
import PasswordChangeForm from "./PasswordChangeForm";
import UserDetailPage from "./UserDetailPage";
import MetricsPage from "./MetricsPage";
import "../styles/Profile.css";

function Profile() {
  // Variable that holds the logged in UserType
  const { loggedInUserType } = useAuth();
  // Variable to hold the choice of user selection for sub-topic
  const [selectedItem, setSelectedItem] = useState("My Details");

  /**
   * Function to handle click on "My Details" item
   */
  const handleMyDetailsClick = () => {
    setSelectedItem("My Details");
  };

  /**
   * Function to handle click on "Password" item
   */
  const handlePasswordClick = () => {
    setSelectedItem("Password");
  };

  /**
   * Function to handle click on "Metrics" item
   */
  const handleMetricsClick = () => {
    setSelectedItem("Metrics");
  };

  let content;

  if (selectedItem === "My Details") {
    content = <UserDetailPage />;
  } else if (selectedItem === "Password") {
    content = <PasswordChangeForm />;
  } else if (selectedItem === "Metrics") {
    content = <MetricsPage />;
  }

  return (
    <div>
      <NavbarComponent />
      <Container className="text-center mt-4">
        <Row>
          <Col>
            <div
              className={`clickable-text ${
                selectedItem === "My Details" ? "font-weight-bold" : ""
              }`}
              onClick={handleMyDetailsClick}
            >
              My Details
            </div>
          </Col>
          <Col>
            <div
              className={`clickable-text ${
                selectedItem === "Password" ? "font-weight-bold" : ""
              }`}
              onClick={handlePasswordClick}
            >
              Password
            </div>
          </Col>
          {loggedInUserType === "A" && (
            <Col>
              <div
                className={`clickable-text ${
                  selectedItem === "Metrics" ? "font-weight-bold" : ""
                }`}
                onClick={handleMetricsClick}
              >
                Metrics
              </div>
            </Col>
          )}
        </Row>
      </Container>
      {content}
    </div>
  );
}

export default Profile;
