import React, { useState } from "react";
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import NavbarComponent from "./NavbarComponent";
import "../styles/AdminCocktailCreation.css";

const AdminCocktailCreation = () => {
  const navigate = useNavigate();

  // Storing the image of the cocktail
  const [imageFile, setImageFile] = useState(null);

  // Name of a cocktail
  const [cocktailName, setCocktailName] = useState("");

  // Description of a cocktail
  const [description, setDescription] = useState("");

  // Instructions for a cocktail
  const [instructions, setInstructions] = useState("");

  // AlcoholType of the cocktail
  const [alcoholTypeID, setAlcoholTypeID] = useState(1);

  // Array to hold all the ingredients for a cocktail
  const [ingredientLines, setIngredientLines] = useState([]);

  // An object that holds each requirement of an ingredient
  const [newIngredient, setNewIngredient] = useState({
    quantity: "",
    unit: "",
    ingredientID: "",
  });

  /**
   * Handles the change event when a file is selected in the input field.
   * @param {Event} e - The event object representing the input change event.
   */
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  /**
   * Adds a new ingredient object into the ingrientLines object
   */
  const addNewIngredient = () => {
    const ingredientAdded = {
      quantity: newIngredient.quantity,
      unit: newIngredient.unit,
      ingredientID: newIngredient.ingredientID,
    };

    setIngredientLines([...ingredientLines, ingredientAdded]);

    setNewIngredient({
      quantity: "",
      unit: "",
      ingredientID: "",
    });
  };

  /**
   * Removes an ingredient from the list of ingredient lines.
   * @param {number} index - The index of the ingredient to be removed.
   */
  const removeIngredient = (index) => {
    const updatedIngredients = [...ingredientLines];
    updatedIngredients.splice(index, 1);
    setIngredientLines(updatedIngredients);
  };

  /**
   * Handles the form submission when creating a new cocktail.
   * Sends a POST request to the server with cocktail data.
   */
  const handleSubmit = async () => {
    try {
      const imageBase64 = await convertImageToBase64(imageFile);

      const requestData = {
        CocktailName: cocktailName,
        Description: description,
        Ingredients: ingredientLines,
        Instructions: instructions,
        CocktailImage: imageBase64,
        AlcoholTypeID: alcoholTypeID,
      };

      // eslint-disable-next-line
      const response = await axios.post(
        `http://localhost:3001/admincreatingcocktail/`,
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
   * Converts an image file to base64 format.
   * @param {File} imageFile - The image file to be converted.
   * @returns {Promise<string|null>} A promise that resolves with the base64 data or null if no file is provided.
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
                <h2 className="mb-4">Enter a new Base</h2>
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
                    className="description-textarea"
                    placeholder="Describe your cocktail!"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <h3 className="mb-4">AlcoholTypeID:</h3>
              <Col>
                <Form.Group controlId="alcoholTypeIdInput" className="mb-4">
                  <Form.Control
                    type="text"
                    placeholder="Alcohol Type ID"
                    value={alcoholTypeID}
                    onChange={(e) => setAlcoholTypeID(e.target.value)}
                  />
                </Form.Group>
                <h3 className="mb-4">Ingredients</h3>
                <div className="ingredient-instruction">
                  <p>
                    Add an ingredient using the following format:{" "}
                    <span>Quantity Unit IngredientID</span>
                  </p>
                </div>
                {ingredientLines.length > 0 ? (
                  <ul>
                    {ingredientLines.map((line, index) => (
                      <li key={index}>
                        {line.quantity} {line.unit} {line.ingredientID}
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
                  <Form.Group
                    controlId="newIngredientQuantityInput"
                    className="mr-2"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Quantity"
                      value={newIngredient.quantity}
                      onChange={(e) =>
                        setNewIngredient({
                          ...newIngredient,
                          quantity: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group
                    controlId="newIngredientUnitInput"
                    className="mr-2"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Unit"
                      value={newIngredient.unit}
                      onChange={(e) =>
                        setNewIngredient({
                          ...newIngredient,
                          unit: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="newIngredientIDInput" className="mr-2">
                    <Form.Control
                      type="text"
                      placeholder="Ingredient ID"
                      value={newIngredient.ingredientID}
                      onChange={(e) =>
                        setNewIngredient({
                          ...newIngredient,
                          ingredientID: e.target.value,
                        })
                      }
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
                className="instructions-textarea"
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

export default AdminCocktailCreation;
