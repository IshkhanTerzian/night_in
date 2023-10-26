import React, { useState } from "react";
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import config from "../config.json";
import NavbarComponent from "./NavbarComponent";
import "../styles/UpdateBanner.css";

function UpdateBanner() {
  const [imageFile, setImageFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const navigate = useNavigate();

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleUpdate = async () => {
    if (imageFile) {
      try {
        const imageBase64 = await convertImageToBase64(imageFile);

        const requestData = {
          SiteBannerImage: imageBase64,
          SiteBannerText: textInput,
        };

        const response = await axios.post(
          `${config.AWS_URL}/updatebanner`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        navigate("/landingpage");
      } catch (error) {
        console.error("Error sending data:", error);
      }
    } else {
    }
  };

  const convertImageToBase64 = (imageFile) => {
    return new Promise((resolve, reject) => {
      if (!imageFile) {
        resolve(null);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result.split(",")[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      }
    });
  };

  return (
    <>
      <NavbarComponent />
      <Container fluid>
        <Row>
          <Col md={12}>
            <div className="image-container">
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Enter a file"
                  className="img-fluid"
                />
              ) : (
                <Form.Group controlId="formFile" className="mb-0">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    style={{ display: "none" }}
                  />
                  <Button
                    variant="link"
                    style={{ fontSize: "36px" }}
                    as="label"
                    htmlFor="formFile"
                  >
                    +
                  </Button>
                  <p className="mt-2">Click to select an image</p>
                </Form.Group>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="text-center">
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Enter text (limit 45 characters)"
                maxLength="45"
                value={textInput}
                onChange={handleTextChange}
                className="form-control"
              />
            </Form.Group>
            <Button onClick={handleUpdate}>Update</Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UpdateBanner;
