import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import NavbarComponent from "./NavbarComponent";

function CreatingForumPost() {
  const navigate = useNavigate();

  // Variable that holds logged in UserID
  const { loggedInUserId } = useAuth();

  // Form data object to hold the information needed for rendering
  const [formData, setFormData] = useState({
    topicTitle: "",
    description: "",
    content: "",
  });

  /**
   * Handles input changes for form fields
   * @param {Event} e - The event object representing the input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /**
   * Handles the form submission and sends a forum post to the backend
   * @param {Event} e - The event object for the form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const forumPost = {
      userID: loggedInUserId,
      topicTitle: formData.topicTitle,
      description: formData.description,
      numberOfReplies: 0,
      content: formData.content,
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/creatingforumpostpage",
        forumPost
      );

      if (response.status === 200) {
        navigate("/forum");
      } else {
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <NavbarComponent />
      <div className="container mt-4">
        <h1>CREATING A FORUM POST</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Topic Title</Form.Label>
            <Form.Control
              type="text"
              name="topicTitle"
              value={formData.topicTitle}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              style={{ whiteSpace: "pre-wrap" }} // Preserve new lines
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Create Post
          </Button>
        </Form>
      </div>
    </>
  );
}
export default CreatingForumPost;