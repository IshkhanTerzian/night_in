import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Col, Row, Button, Form } from "react-bootstrap";
import axios from "axios";
import NavbarComponent from "./NavbarComponent";
import "../styles/RecipeDetailPage.css";

const RecipeDetailPage = () => {
  const { cocktailId } = useParams();
  const [cocktailInfo, setCocktailInfo] = useState(null);
  const [selectedSize, setSelectedSize] = useState("Select Size");
  const [isSingleButtonActive, setIsSingleButtonActive] = useState(true);
  const [isCustomButtonActive, setIsCustomButtonActive] = useState(false);
  const [customQuantity, setCustomQuantity] = useState(1);
  const [originalIngredients, setOriginalIngredients] = useState([]);

  useEffect(() => {
    const fetchCocktailDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipedetailpage/${cocktailId}`
        );
        console.log("RESPONSE DATA:", response.data); 
        setCocktailInfo(response.data);
        setOriginalIngredients(response.data.Ingredients);
      } catch (error) {
        console.error("Error fetching cocktail information:", error);
      }
    };

    fetchCocktailDetails();
  }, [cocktailId]);

  const handleSingleClick = () => {
    setSelectedSize("Single");
    setIsSingleButtonActive(true);
    setIsCustomButtonActive(false);
    setCustomQuantity(1);

    setCocktailInfo({
      ...cocktailInfo,
      Ingredients: originalIngredients,
    });
  };

  const handleCustomClick = () => {
    setSelectedSize("Custom");
    setIsSingleButtonActive(false);
    setIsCustomButtonActive(true);
  };

  const handleCustomQuantityChange = (event) => {
    setCustomQuantity(event.target.value);
  };

  const handleCustomCalculate = () => {
    const customQuantityValue = parseInt(customQuantity);
    if (isNaN(customQuantityValue) || customQuantityValue <= 0) {
      alert("Please enter a valid positive integer for Custom Quantity.");
      return;
    }

    const updatedIngredients = originalIngredients.map((ingredient) => ({
      ...ingredient,
      quantity: ingredient.quantity * customQuantityValue,
    }));

    setCocktailInfo({
      ...cocktailInfo,
      Ingredients: updatedIngredients,
    });
  };

  return (
    <>
      <NavbarComponent />
      <Container className="mb-4 mt-4">
        <Row>
          <Col md={6}>
            {cocktailInfo && (
              <img
                src={`data:image/png;base64,${cocktailInfo.CocktailImageBase64}`}
                alt={cocktailInfo.CocktailName}
                onError={(e) => {
                  console.error("Error loading image:", e);
                }}
                className="full-width-image"
              />
            )}
          </Col>
          <Col md={6}>
            {cocktailInfo && (
              <div>
                <h1>{cocktailInfo.CocktailName}</h1>
                <p>Select Size: {selectedSize}</p>
                <Button
                  variant="primary"
                  className={`custom-button ${
                    isSingleButtonActive ? "active" : ""
                  }`}
                  onClick={handleSingleClick}
                >
                  <span className="bold-text">Single</span>
                </Button>
                <Button
                  variant="primary"
                  className={`custom-button ${
                    isCustomButtonActive ? "active" : ""
                  }`}
                  onClick={handleCustomClick}
                >
                  <span className="bold-text">Custom</span>
                </Button>
                <div className="mt-3">
                  {isSingleButtonActive && <p>{cocktailInfo.Description}</p>}
                  {isCustomButtonActive && (
                    <p>
                      Custom drink will scale ingredients depending on the
                      number of people enjoying this drink!
                    </p>
                  )}
                </div>
                {isCustomButtonActive && (
                  <div className="mt-3">
                    <Form.Label>Custom Quantity:</Form.Label>
                    <Form.Control
                      type="number"
                      value={customQuantity}
                      onChange={handleCustomQuantityChange}
                    />
                    <Button
                      variant="primary"
                      className="custom-button"
                      onClick={handleCustomCalculate}
                    >
                      <span className="bold-text">Calculate</span>
                    </Button>
                  </div>
                )}
                <div className="mt-3">
                  <h2>Ingredients</h2>
                  <ul>
                    {cocktailInfo &&
                      cocktailInfo.Ingredients &&
                      cocktailInfo.Ingredients.map((ingredient, index) => (
                        <li key={index}>
                          {`${ingredient.quantity} ${ingredient.unit} ${ingredient.ingredientName}`}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <Container className="mt-4">
        <Row>
          <Col>
            {cocktailInfo && (
              <div>
                <h1>Instructions</h1>
                <p style={{ whiteSpace: "pre-line" }}>
                  {cocktailInfo.Instructions}
                </p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RecipeDetailPage;
