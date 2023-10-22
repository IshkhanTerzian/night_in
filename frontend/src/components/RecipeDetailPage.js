import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Col, Row, Button, Form } from "react-bootstrap";
import { useAuth } from "./AuthContext";
import axios from "axios";

import config from "../config.json";
import NavbarComponent from "./NavbarComponent";
import "../styles/RecipeDetailPage.css";

const RecipeDetailPage = () => {
  const navigate = useNavigate();

  // Variable to grab the cocktailID of the clicked image
  const { cocktailId } = useParams();

  // Variable that holds the user's logged in type
  const { loggedInUserType } = useAuth();

  // Variable that holds the info for the cocktail rendered
  const [cocktailInfo, setCocktailInfo] = useState(null);

  // Variable to toggle between the customization of ingredients
  const [selectedSize, setSelectedSize] = useState("Select Size");

  // Bool variable to hold the trigger for single button
  const [isSingleButtonActive, setIsSingleButtonActive] = useState(true);

  // Bool variable to hold the trigger for custom button
  const [isCustomButtonActive, setIsCustomButtonActive] = useState(false);

  // Variable to get the user's input to calculate the ingredients amount
  const [customQuantity, setCustomQuantity] = useState(1);

  // Array that holds the list of all the ingredients for this specific cocktail
  const [originalIngredients, setOriginalIngredients] = useState([]);

  // Variable to hold the error messages
  const [customQuantityError, setCustomQuantityError] = useState("");

  // Varialbe that holds the counting increment of this specific cocktail, to be used in Metrics
  const [incrementedSearchedCounter, setIncrementedSearchedCounter] =
    useState(null);

  useEffect(() => {
    const fetchCocktailDetailsAndIncrementCounter = async () => {
      try {
        const response = await axios.get(
          `${config.AWS_URL}/recipedetailpage/${cocktailId}`
        );
        setCocktailInfo(response.data.data);
        setOriginalIngredients(response.data.data.Ingredients);

        if (!incrementedSearchedCounter) {
          const incrementSearchedCounterResponse = await axios.post(
            `${config.AWS_URL}/incrementSearchedCounter/${cocktailId}`,
            {
              SearchedCounter: response.data.data.SearchedCounter || 0,
            }
          );

          if (incrementSearchedCounterResponse.status === 200) {
            setCocktailInfo((prevInfo) => ({
              ...prevInfo,
              SearchedCounter: prevInfo.SearchedCounter + 1,
            }));
            setIncrementedSearchedCounter(true);
          } else {
            alert("Error incrementing SearchedCounter.");
          }
        }
      } catch (error) {
        console.error("Error fetching cocktail information:", error);
      }
    };

    fetchCocktailDetailsAndIncrementCounter();
  }, [cocktailId, incrementedSearchedCounter]);

  /**
   * Handles the event to toggle between single select size
   */
  const handleSingleClick = () => {
    setSelectedSize("Single");
    setIsSingleButtonActive(true);
    setIsCustomButtonActive(false);
    setCustomQuantity(1);
    setCustomQuantityError("");

    setCocktailInfo({
      ...cocktailInfo,
      Ingredients: originalIngredients,
    });
  };

  /**
   * Handles the event to toggle between custom select size
   */
  const handleCustomClick = () => {
    setSelectedSize("Custom");
    setIsSingleButtonActive(false);
    setIsCustomButtonActive(true);
  };

  /**
   * Handles the rendering of each ingredients list to be altered based
   * upon the user's input
   * @param {Event} e The input field change event
   */
  const handleCustomQuantityChange = (e) => {
    setCustomQuantity(e.target.value);
  };

  /**
   * Handles the calculation of each ingredient to be rendered
   */
  const handleCustomCalculate = () => {
    if (isCustomButtonActive) {
      const customQuantityValue = parseFloat(customQuantity);
      if (
        isNaN(customQuantityValue) ||
        customQuantityValue <= 0 ||
        customQuantityValue % 1 !== 0
      ) {
        setCustomQuantityError(
          "Please enter a valid positive integer for Custom Quantity."
        );
        setCocktailInfo({
          ...cocktailInfo,
          Ingredients: originalIngredients,
        });
      } else {
        setCustomQuantityError("");
        const updatedIngredients = originalIngredients.map((ingredient) => ({
          ...ingredient,
          quantity: ingredient.quantity * customQuantityValue,
        }));

        setCocktailInfo({
          ...cocktailInfo,
          Ingredients: updatedIngredients,
        });
      }
    }
  };

  /**
   * Deletes the cocktail entirely from the DB and all connections
   * related to this specific cocktailID
   */
  const handleDeleteCocktail = async () => {
    try {
      const response = await axios.delete(
        `${config.AWS_URL}/recipedetailpage/${cocktailId}`
      );

      if (response.status === 200) {
        navigate("/recipes");
      } else {
        alert("Error deleting cocktail.");
      }
    } catch (error) {
      console.error("Error deleting cocktail:", error);
    }
  };

  /**
   * Handles the event to send the admin to the update cocktail page
   * for this specific cocktail
   */
  const handleUpdateCocktail = () => {
    navigate(`/updatingBaseCocktail/${cocktailId}`);
  };

  
  return (
    <>
      <NavbarComponent />
      <Container className="mb-4 mt-4">
        <Row>
          <Col md={6}>
            {cocktailInfo && (
              <img
                src={`data:image/png;base64,${cocktailInfo.CocktailImage}`}
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
                <p>
                  Select Size: <span className="bold-text">{selectedSize}</span>
                </p>
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
                    {customQuantityError && (
                      <p className="text-danger">{customQuantityError}</p>
                    )}
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
      <Container className="text-center mt-4">
        <Row>
          <Col>
            {loggedInUserType === "A" && (
              <>
                <Button
                  variant="danger"
                  onClick={handleDeleteCocktail}
                  style={{ marginRight: "10px" }}
                >
                  Delete Cocktail
                </Button>
                <Button variant="danger" onClick={handleUpdateCocktail}>
                  Update Cocktail
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RecipeDetailPage;
