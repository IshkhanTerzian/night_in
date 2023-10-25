import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Form } from "react-bootstrap";
import axios from "axios";

import config from "../config.json";
import NavbarComponent from "./NavbarComponent";

function UpdateMainThreadPost() {

  const navigate = useNavigate();

  // Variable to hold the forumPostID from the URL
  const { forumpostId } = useParams();

  // Variable that holds the data coming back from the DB for the specified thread
  const [data, setData] = useState(null);

  // Variable that holds the edited title of the thread
  const [editedTopicTitle, setEditedTopicTitle] = useState("");
  
  // Variable that holds the edited content of the thread
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    axios
      .get(`${config.AWS_URL}/forumpostcontentpage/${forumpostId}`)
      .then((response) => {
        if (response.data.data && response.data.data.length > 0) {
          const postData = response.data.data[0];
          setData(postData);
          setEditedTopicTitle(postData.TopicTitle);
          setEditedContent(postData.Content);
        }
      })
      .catch((error) => {
        console.error("Error fetching forum post:", error);
      });
  }, [forumpostId]);

  /**
   * Handles the event to update the main thread
   */
  const handleUpdateMainThread = () => {
    axios
      .post(`${config.AWS_URL}/updateMainThreadPost/${forumpostId}`, {
        TopicTitle: editedTopicTitle,
        Content: editedContent,
      })
      .then((response) => {
        console.log("Content updated successfully:", response.data.data);

        navigate(`/forumpostcontentpage/${forumpostId}`);
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
          <Form.Group controlId="topicTitle">
            <Form.Label>Topic Title</Form.Label>
            <Form.Control
              type="text"
              value={editedTopicTitle}
              onChange={(e) => setEditedTopicTitle(e.target.value)}
            />
          </Form.Group>
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
          <Button variant="primary" onClick={handleUpdateMainThread}>
            Update
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default UpdateMainThreadPost;
