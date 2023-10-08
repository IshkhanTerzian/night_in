import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import axios from "axios";

import NavbarComponent from "./NavbarComponent";
import "../styles/UpdatingBaseCocktail.css";

const UpdatingBaseCocktail = () => {
  const navigate = useNavigate();

  // Variable thats passed from the params, holds the cocktailID
  const { cocktailId } = useParams();

  // Variable to hold the edited cocktail name
  const [editedCocktailName, setEditedCocktailName] = useState("");

  // Variable to hold the edited description

  const [editedDescription, setEditedDescription] = useState("");

  // Variable to hold the edited instructions
  const [editedInstructions, setEditedInstructions] = useState("");

  // Variable to hold the new image
  const [imageFile, setImageFile] = useState(null);

  // Variable to hold the alcholType
  const [alcoholTypeID, setAlcoholTypeID] = useState("");

  // Array to hold the ingredients list
  const [ingredientLines, setIngredientLines] = useState([]);

  useEffect(() => {
    const fetchCocktailDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipedetailpage/${cocktailId}`
        );
        const data = response.data;
        setIngredientLines(data.Ingredients);
        setEditedCocktailName(data.CocktailName);
        setEditedDescription(data.Description);
        setEditedInstructions(data.Instructions);
        setAlcoholTypeID(data.AlcoholTypeID);
      } catch (error) {
        console.error("Error fetching cocktail details:", error);
      }
    };

    fetchCocktailDetail();
  }, [cocktailId]);

  /**
   * Handles the update for the specified cocktail, sends the data
   * to the backend to update the DB
   */
  const handleUpdate = async () => {
    try {
      const imageBase64 = await convertImageToBase64(imageFile);

      const updatedCocktailData = {
        CocktailName: editedCocktailName,
        Description: editedDescription,
        Instructions: editedInstructions,
        Ingredients: ingredientLines,
        CocktailImage: imageBase64,
        AlcoholTypeID: alcoholTypeID,
      };

      const response = await axios.post(
        `http://localhost:3001/updateCocktail/${cocktailId}`,
        updatedCocktailData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate(`/recipedetailpage/${cocktailId}`);
    } catch (error) {
      console.error("Error updating cocktail:", error);
    }
  };

  /**
   * Handles the change event when a file is selected in the input field
   * @param {Event} e - Oject representing the input change event
   */
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  /**
   * Converts an image file to base64 format
   * @param {File} imageFile - The image file to be converted
   * @returns {Promise<string|null>} A promise that resolves with the base64 data or null if no file is provided
   */
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
      <Container className="mb-4 mt-4">
        <Row>
          <Col md={6}>
            <div className="image-container bg-light text-center position-relative p-3">
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt=""
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
                    className="upload-button"
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
          <Col md={6} className="mb-3">
            <Row>
              <Col>
                <h2 className="mb-4">Edit Cocktail</h2>
                <Form.Group controlId="cocktailNameInput" className="mb-4">
                  <Form.Control
                    type="text"
                    placeholder="Cocktail Name"
                    value={editedCocktailName}
                    onChange={(e) => setEditedCocktailName(e.target.value)}
                  />
                </Form.Group>
                <h3 className="mb-4">Description</h3>
                <Form.Group controlId="row1Textarea" className="mb-4">
                  <Form.Control
                    as="textarea"
                    rows={5}
                    className="description-textarea"
                    placeholder="Describe your cocktail!"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Col md={6} className="mb-3">
              <Row>
                <Col>
                  <h3 className="mb-4">AlcoholTypeID:</h3>
                  <Form.Group controlId="alcoholTypeIdInput" className="mb-4">
                    <Form.Control
                      type="text"
                      placeholder="Alcohol Type ID"
                      value={alcoholTypeID}
                      onChange={(e) => setAlcoholTypeID(e.target.value)}
                    />
                  </Form.Group>
                  <h3 className="mb-4">Ingredients</h3>
                  <ul>
                    {ingredientLines.map((ingredient, index) => (
                      <li key={index}>
                        {`${ingredient.quantity} ${ingredient.unit} ${ingredient.ingredientID}`}{" "}
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
            </Col>
          </Col>
        </Row>
      </Container>
      <Col md={12}>
        <Row>
          <Col>
            <h2 className="mb-4">Instructions</h2>
            <Form.Group controlId="instructionsTextarea" className="mb-4">
              <Form.Control
                as="textarea"
                rows={5}
                className="instructions-textarea"
                placeholder="Enter instructions for making your cocktail!"
                value={editedInstructions}
                onChange={(e) => setEditedInstructions(e.target.value)}
              />
            </Form.Group>
            <Container className="text-center">
              <Button
                variant="primary"
                size="lg"
                className="update-button"
                onClick={handleUpdate}
              >
                Update Cocktail
              </Button>
            </Container>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default UpdatingBaseCocktail;
