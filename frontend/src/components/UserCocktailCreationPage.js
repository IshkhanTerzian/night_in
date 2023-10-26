import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import axios from "axios";

import config from "../config.json";
import NavbarComponent from "./NavbarComponent";
import "../styles/UserCocktailCreationPage.css";

const UserCocktailCreationPage = () => {
  const navigate = useNavigate();

  // Variable to hold the user's ID
  const { userId } = useParams();

  // Variable to hold the image file being uploaded
  const [imageFile, setImageFile] = useState(null);

  // Array to hold the list of ingredients for a cocktail
  const [ingredientLines, setIngredientLines] = useState([]);

  // Variable to add a new ingredient
  const [newIngredient, setNewIngredient] = useState("");

  // Variable that holds the name of the cocktail
  const [cocktailName, setCocktailName] = useState("");

  // Variable that holds the description of the cocktail
  const [description, setDescription] = useState("");

  // Variable that holds the instructions of the cocktail
  const [instructions, setInstructions] = useState("");

  // Variable that holds the error message
  const [quantityError, setQuantityError] = useState("");

  /**
   * Handles the change event when a file input for an image is selected
   * @param {Event} e - Object representing the file input change
   */
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  /**
   * Handles the change event when a new ingredient is entered
   * @param {Event} e  Object representing the input change
   */
  const handleNewIngredientChange = (e) => {
    const ingredientText = e.target.value;
    setNewIngredient(ingredientText);
  };

  /**
   * Adds a new ingredient to the ingredient array
   */
  const addNewIngredient = () => {
    if (newIngredient.trim() !== "") {
      const [quantity] = newIngredient.split(" ");

      const quantityValue = parseFloat(quantity);

      if (
        isNaN(quantityValue) ||
        quantityValue <= 0 ||
        quantityValue % 1 !== 0
      ) {
        setQuantityError(
          "Please enter a valid positive integer for the quantity."
        );
      } else {
        setIngredientLines([...ingredientLines, newIngredient]);
        setNewIngredient("");
        setQuantityError("");
      }
    }
  };

  /**
   * Removes an ingredient from the ingredient array
   * @param {number} index - The index of the ingredient to remove
   */
  const removeIngredient = (index) => {
    const updatedIngredients = [...ingredientLines];
    updatedIngredients.splice(index, 1);
    setIngredientLines(updatedIngredients);
  };

  /**
   * Handles the form submission by sending data to the backend
   */
  const handleSubmit = async () => {
    try {
      const imageBase64 = await convertImageToBase64(imageFile);

      const requestData = {
        userId,
        CocktailName: cocktailName,
        Description: description,
        Ingredients: ingredientLines,
        Instructions: instructions,
        CocktailImage: imageBase64,
      };

      const response = await axios.post(
        `${config.AWS_URL}/usercreatingcocktail/${userId}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/recipes");
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  /**
   * Converts an image file to base64 format
   * @param {File} imageFile - The image file to convert
   * @returns {Promise<string|null>} A Promise that resolves to the base64-encoded image data or null if no file is provided
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
          <Col md={6} className="mb-3">
            <Row>
              <Col>
                <h2 className="mb-4">Enter a name for your Cocktail!</h2>
                <Form.Group controlId="cocktailNameInput" className="mb-4">
                  <Form.Control
                    type="text"
                    placeholder="Cocktail Name"
                    value={cocktailName}
                    onChange={(e) => setCocktailName(e.target.value)}
                  />
                </Form.Group>
                <h3 className="mb-4">Description</h3>
                <Form.Group controlId="row1Textarea" className="mb-4">
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Describe your cocktail!"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <h3 className="mb-4">Ingredients</h3>
                <div className="ingredient-instruction">
                  <p style={{ fontSize: "20px" }}>
                    Add an ingredient using this format:{" "}
                    <span>Quantity Unit Ingredient</span>
                  </p>
                  <p className="text-muted" style={{ fontSize: "20px" }}>
                    For example:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      "1 oz Vodka" or "2 dashes Angostura Bitters"
                    </span>
                  </p>
                  {quantityError && (
                    <p className="text-danger">{quantityError}</p>
                  )}
                </div>
                {ingredientLines.length > 0 ? (
                  <ul>
                    {ingredientLines.map((line, index) => (
                      <li key={index}>
                        {line}
                        <Button
                          variant="link"
                          className="remove-ingredient-button"
                          onClick={() => removeIngredient(index)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No ingredients added yet.</p>
                )}
                <div className="d-flex align-items-center">
                  <Form.Group controlId="newIngredientInput" className="mr-2">
                    <Form.Control
                      type="text"
                      placeholder="Add a new ingredient"
                      value={newIngredient}
                      onChange={handleNewIngredientChange}
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    className="add-ingredient-button"
                    onClick={addNewIngredient}
                  >
                    Add Ingredient
                  </Button>
                </div>
              </Col>
            </Row>
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
                placeholder="Enter instructions for making your cocktail!"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </Form.Group>
            <Container className="text-center">
              <Button
                variant="primary"
                size="lg"
                className="submit-button"
                onClick={handleSubmit}
              >
                Submit Your Recipe
              </Button>
            </Container>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default UserCocktailCreationPage;
