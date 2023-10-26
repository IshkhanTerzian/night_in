import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "./AuthContext";

import config from "../config.json";
import axios from "axios";

function UserDetailPage() {
  // Variables that hold the logged in UserName and UserID
  const { loggedInUsername, loggedInUserId } = useAuth();

  // Variable to hold the user's data sent back
  const [userData, setUserData] = useState("");

  useEffect(() => {
    if (loggedInUserId) {
      axios
        .get(`${config.AWS_URL}/userinfo/${loggedInUserId}`)
        .then((response) => {
          setUserData(response.data.data[0]);
        })
        .catch((error) => {
          console.error("Error fetching user's information", error);
        });
    }
  }, [loggedInUserId]);

  return (
    <>
      <Container className="text-center mt-4 mb-4">
        <h1 className="display-4 font-weight-bold">
          Your Details {loggedInUsername}
        </h1>
      </Container>
      <Container className="text-center mt-4 mb-4">
        <Row>
          <Col md={8}>
            <h2 className="mb-3">
              <strong>Email:</strong>
            </h2>
            <h2 className="mb-3">
              <strong>UserName:</strong>
            </h2>
            <h2 className="mb-3">
              <strong>UserType:</strong>
            </h2>
          </Col>
          <Col md={2}>
            <p>{userData.Email}</p>
            <p>{userData.UserName}</p>
            <p>{userData.UserType}</p>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UserDetailPage;
