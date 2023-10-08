import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import axios from "axios";
import NavbarComponent from "./NavbarComponent";
import "../styles/UpdatingUserCreatedCocktail.css"; // Import your external CSS file here

const UpdatingUserCreatedCocktail = () => {
  const navigate = useNavigate();
  const { usercocktailId } = useParams();
  const [editedCocktailName, setEditedCocktailName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedInstructions, setEditedInstructions] = useState("");
  const [ingredientLines, setIngredientLines] = useState([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchUserCreatedCocktailDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/usercreatedcocktaildetailpage/${usercocktailId}`
        );
        const data = response.data;
        const parsedIngredients = JSON.parse(data.Ingredients);
        setIngredientLines(parsedIngredients);
        setEditedCocktailName(data.CocktailName);
        setEditedDescription(data.Description);
        setEditedInstructions(data.Instructions);
      } catch (error) {
        console.error(
          "Error fetching user-created cocktail information:",
          error
        );
      }
    };
    fetchUserCreatedCocktailDetails();
  }, [usercocktailId]);

  const handleUpdateCocktail = async () => {
    try {
      const imageBase64 = await convertImageToBase64(imageFile);

      const updatedCocktailData = {
        CocktailName: editedCocktailName,
        Description: editedDescription,
        Instructions: editedInstructions,
        Ingredients: JSON.stringify(ingredientLines),
        CocktailImage: imageBase64,
      };

      const response = await axios.post(
        `http://localhost:3001/updateUserCreatedCocktail/${usercocktailId}`,
        updatedCocktailData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate(`/usercreatedcocktaildetailpage/${usercocktailId}`);

      if (response.status === 200) {
      } else {
        console.error("Error updating cocktail:", response.data);
      }
    } catch (error) {
      console.error("Error updating cocktail:", error);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
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

  const handleNewIngredientChange = (e) => {
    const ingredientText = e.target.value;
    setNewIngredient(ingredientText);
  };

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

  const removeIngredient = (index) => {
    const updatedIngredients = [...ingredientLines];
    updatedIngredients.splice(index, 1);
    setIngredientLines(updatedIngredients);
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
                  alt="Selected Image"
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
                    className="file-input-button" // Add this class
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
                <h2 className="mb-4">Edit Cocktail Name</h2>
                <Form.Group controlId="cocktailNameInput" className="mb-4">
                  <Form.Control
                    type="text"
                    placeholder="Cocktail Name"
                    value={editedCocktailName}
                    onChange={(e) => setEditedCocktailName(e.target.value)}
                  />
                </Form.Group>
                <h3 className="mb-4">Edit Description</h3>
                <Form.Group controlId="row1Textarea" className="mb-4">
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Edit cocktail description"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <h3 className="mb-4">Ingredients</h3>
                <div className="ingredient-instruction">
                  <p className="ingredient-label">
                    Add or remove ingredients below:
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
            <h2 className="mb-4">Edit Instructions</h2>
            <Form.Group controlId="instructionsTextarea" className="mb-4">
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Edit instructions for making your cocktail!"
                value={editedInstructions}
                onChange={(e) => setEditedInstructions(e.target.value)}
                className="instructions-textarea"
              />
            </Form.Group>
            <Container className="text-center">
              <Button
                variant="primary"
                size="lg"
                className="submit-button"
                onClick={handleUpdateCocktail}
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

export default UpdatingUserCreatedCocktail;
