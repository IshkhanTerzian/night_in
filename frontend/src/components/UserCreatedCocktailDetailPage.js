import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Col, Row, Button, Form } from "react-bootstrap";
import { useAuth } from "./AuthContext";
import axios from "axios";

import config from "../config.json";
import NavbarComponent from "./NavbarComponent";

const UserCreatedCocktailDetailPage = () => {
  const navigate = useNavigate();

  const { loggedInUserType, loggedInUserId } = useAuth();
  const { usercocktailId } = useParams();
  const [cocktailInfo, setCocktailInfo] = useState(null);
  const [selectedSize, setSelectedSize] = useState("Select Size");
  const [isSingleButtonActive, setIsSingleButtonActive] = useState(true);
  const [isCustomButtonActive, setIsCustomButtonActive] = useState(false);
  const [customQuantity, setCustomQuantity] = useState(1);
  const [originalIngredients, setOriginalIngredients] = useState([]);
  const [customQuantityError, setCustomQuantityError] = useState("");
  const [checkForumPost, setCheckForumPost] = useState("");
  const [incrementedSearchedCounter, setIncrementedSearchedCounter] =
    useState(null);

  const [ratingStatus, setRatingStatus] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  useEffect(() => {
    const fetchUserCreatedCocktailDetails = async () => {
      try {
        const response = await axios.get(
          `${config.AWS_URL}/usercreatedcocktaildetailpage/${usercocktailId}`
        );
        console.log("RESPONSE: " + response.data.data);

        console.log("RESPONSE: " + response.data);
        setCocktailInfo(response.data);
        const parsedIngredients = JSON.parse(response.data.Ingredients);
        setOriginalIngredients(parsedIngredients);

        if (!incrementedSearchedCounter) {
          const incrementSearchedCounterResponse = await axios.post(
            `${config.AWS_URL}/incrementUserSearchedCounter/${usercocktailId}`,
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

        setCheckForumPost(response.data.data.ForumExistsForCocktail);
      } catch (error) {
        console.error(
          "Error fetching user-created cocktail information:",
          error
        );
      }
    };

    fetchUserCreatedCocktailDetails();
  }, [usercocktailId, incrementedSearchedCounter]);

  const handleSingleClick = () => {
    setSelectedSize("Single");
    setIsSingleButtonActive(true);
    setIsCustomButtonActive(false);
    setCustomQuantity(1);
    setCustomQuantityError("");

    setCocktailInfo({
      ...cocktailInfo,
      Ingredients: JSON.stringify(originalIngredients),
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
    const customQuantityValue = parseFloat(customQuantity);
    if (
      isNaN(customQuantityValue) ||
      customQuantityValue <= 0 ||
      customQuantityValue % 1 !== 0
    ) {
      setCustomQuantityError(
        "Please enter a valid positive integer for Custom Quantity."
      );
    } else {
      setCustomQuantityError("");
      const updatedIngredients = originalIngredients.map((ingredient) => {
        const updatedQuantity = `${
          parseFloat(ingredient) * customQuantityValue
        } ${ingredient.split(" ").slice(1).join(" ")}`;
        return updatedQuantity;
      });

      setCocktailInfo({
        ...cocktailInfo,
        Ingredients: JSON.stringify(updatedIngredients),
      });
    }
  };

  const handleDeleteCocktail = async () => {
    try {
      const response = await axios.delete(
        `${config.AWS_URL}/usercreatedcocktaildetailpage/${usercocktailId}`
      );

      if (response.status === 200) {
        console.log("Cocktail deleted successfully");
        navigate("/recipes");
      }
    } catch (error) {
      console.error("Error deleting cocktail:", error);
    }
  };

  const handleCreateForumPostClick = async () => {
    try {
      const requestData = {
        userId: loggedInUserId,
        topicTitle: `${cocktailInfo.CocktailName} Review!`,
        description: `Rate and comment about this cocktail!`,
        content:
          "Please comment and give a rating on what you think about my cocktail!",
        cocktailIDPlaceholder: usercocktailId,
      };

      const response = await axios.post(
        `${config.AWS_URL}/createforumpostforcocktail`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        navigate("/forum");
      } else {
        console.error("Error creating forum post.");
      }
    } catch (error) {
      console.error("Error creating forum post:", error);
    }
  };

  /**
   * Handles the event to send the user to the update cocktail page
   * for this specific user created cocktail
   */
  const handleUserCreatedUpdateCocktail = () => {
    navigate(`/updatingUserCreatedCocktail/${usercocktailId}`);
  };

  const handleLikes = () => {
    if (ratingStatus !== "like") {
      const updatedLikes = likes + 1;
      const updatedDislikes =
        ratingStatus === "dislike" ? dislikes - 1 : dislikes;

      setLikes(updatedLikes);
      setDislikes(updatedDislikes);

      setRatingStatus("like");

      updateRatings(updatedLikes, updatedDislikes);
    }
  };

  const handleDislikes = () => {
    if (ratingStatus !== "dislike") {
      const updatedLikes = ratingStatus === "like" ? likes - 1 : likes;
      const updatedDislikes = dislikes + 1;

      setLikes(updatedLikes);
      setDislikes(updatedDislikes);

      setRatingStatus("dislike");

      updateRatings(updatedLikes, updatedDislikes);
    }
  };

  const updateRatings = (updatedLikes, updatedDislikes) => {
    axios
      .post(`${config.AWS_URL}/updateRatings`, {
        likes: updatedLikes,
        dislikes: updatedDislikes,
        usercocktailId,
      })
      .then((response) => {
      })
      .catch((error) => {
        console.error("Error updating the database:", error);
      });
  };

  return (
    <>
      <NavbarComponent />
      <Container className="mb-4 mt-4">
        <Row>
          <Container className="mb-4 mt-4">
            <Row>
              <Col md={6}>
                <div className="text-center">
                  <h2>Total Likes: {likes}</h2>
                  <Button
                    variant="primary"
                    onClick={handleLikes}
                    disabled={ratingStatus === "like"}
                  >
                    Like
                  </Button>
                </div>
              </Col>
              <Col md={6}>
                <div className="text-center">
                  <h2>Total Dislikes: {dislikes}</h2>
                  <Button
                    variant="danger"
                    onClick={handleDislikes}
                    disabled={ratingStatus === "dislike"}
                  >
                    Dislike
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>

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
                      JSON.parse(cocktailInfo.Ingredients).map(
                        (ingredient, index) => <li key={index}>{ingredient}</li>
                      )}
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
            {loggedInUserType === "G" && (
              <>
                <Button
                  variant="danger"
                  onClick={handleDeleteCocktail}
                  style={{ marginRight: "10px" }}
                >
                  Delete Cocktail
                </Button>
                <Button
                  variant="danger"
                  onClick={handleUserCreatedUpdateCocktail}
                >
                  Update Cocktail
                </Button>
              </>
            )}
          </Col>
        </Row>
        <Col md={12}>
          <Row>
            <Col md={12}>
              <Row>
                <Col>
                  {checkForumPost === "N" && (
                    <Button
                      variant="primary"
                      size="lg"
                      className="submit-button"
                      onClick={handleCreateForumPostClick}
                    >
                      Create a Forum Post
                    </Button>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Container>
    </>
  );
};

export default UserCreatedCocktailDetailPage;
