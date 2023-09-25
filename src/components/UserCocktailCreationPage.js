import React, { useState } from "react";
import { useParams } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import axios from "axios";

const UserCocktailCreationPage = () => {
  const { userId } = useParams();
  const [imageFile, setImageFile] = useState(null); 
  const [ingredientLines, setIngredientLines] = useState([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [cocktailName, setCocktailName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file); 
  };

  const handleNewIngredientChange = (event) => {
    const ingredientText = event.target.value;
    setNewIngredient(ingredientText);
  };

  const addNewIngredient = () => {
    if (newIngredient.trim() !== "") {
      setIngredientLines([...ingredientLines, newIngredient]);
      setNewIngredient("");
    }
  };

  const removeIngredient = (index) => {
    const updatedIngredients = [...ingredientLines];
    updatedIngredients.splice(index, 1);
    setIngredientLines(updatedIngredients);
  };

  
  const handleSubmit = async () => {
    try {
      const imageBase64 = await convertImageToBase64(imageFile);
  
      console.log("Image converted to base64:", imageBase64);
  
      const requestData = {
        userId,
        CocktailName: cocktailName,
        Description: description,
        Ingredients: ingredientLines,
        Instructions: instructions,
        CocktailImage: imageBase64, 
      };
  
      console.log("Data being sent to the server:", requestData);
  
      const response = await axios.post(
        `http://localhost:3001/usercreatingcocktail/${userId}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };
  
  const convertImageToBase64 = (imageFile) => {
    return new Promise((resolve, reject) => {
      if (!imageFile) {
        resolve(null);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result.split(',')[1];
          console.log("Image converted to base64:", base64Data);
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
                  alt="Selected Image"
                  className="img-fluid"
                  style={{
                    maxHeight: "50%",
                    maxWidth: "50%",
                    height: "auto",
                    width: "auto",
                  }}
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
                    style={{
                      height: "200px",
                      width: "100%",
                      overflowY: "auto",
                      resize: "none",
                    }}
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
                  <p>
                    Add an ingredient using this format:{" "}
                    <span>value unit ingredientName</span>
                  </p>
                </div>
                {ingredientLines.length > 0 ? (
                  <ul>
                    {ingredientLines.map((line, index) => (
                      <li key={index}>
                        {line}
                        <Button
                          variant="link"
                          style={{ fontSize: "18px" }}
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
                    onClick={addNewIngredient}
                    className="mx-5"
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
                style={{
                  height: "200px",
                  width: "100%",
                  overflowY: "auto",
                  resize: "none",
                }}
                placeholder="Enter instructions for making your cocktail!"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </Form.Group>
            <Container className="text-center">
              <Button variant="primary" size="lg" onClick={handleSubmit}>
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
