import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Form } from "react-bootstrap";
import axios from "axios";

import config from "../config.json";
import NavbarComponent from "./NavbarComponent";

function UpdateMainThreadPost() {
  const navigate = useNavigate();

  // Variable that holds the threadID for the post
  const { threadID } = useParams();

  // Variable that holds the editable content
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    axios
      .get(`${config.AWS_URL}/getSingleThreadPost/${threadID}`)
      .then((response) => {
        const data = response.data.data[0];
        setEditedContent(data.Content);
      })
      .catch((error) => {
        console.error("Error fetching forum post:", error);
      });
  }, [threadID]);

  /**
   * Handles the update button press to send the new content
   * to the be saved in the DB
   */
  const handleUpdateThread = () => {
    axios
      .post(`${config.AWS_URL}/updatethreadpost/${threadID}`, {
        Content: editedContent,
      })
      .then((response) => {
        navigate(`/forum`);
      })
      .catch((error) => {
        console.error("Error updating content:", error);
      });
  };

  return (
    <>
      <NavbarComponent />
      <Container>
        <h2>Edit Main Thread Post</h2>
        <Form>
          <Form.Group controlId="content">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows="8"
              style={{ resize: "none" }}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleUpdateThread}>
            Update
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default UpdateMainThreadPost;
