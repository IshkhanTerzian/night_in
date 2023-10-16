import React, { useEffect, useState } from "react";
import { Container, Image, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import config from '../config.json';
import NavbarComponent from "./NavbarComponent";
import CocktailCard from "./CocktailCard";
import Footer from "./Footer";
import "../styles/LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  // Array to hold the cocktails being called from the DB
  const [cocktailData, setCocktailData] = useState([]);

  useEffect(() => {
    axios
      .get(`${config.AWS_URL}/recipes`)
      .then((response) => {
        setCocktailData(response.data.data);
      })
      .catch((err) => {
        console.err("Error fetching data:", err);
      });
  }, []);

  /**
   * Handles the event to send the user to the detail page of the cocktail
   * @param {number} cocktailId
   */
  const handleImageClick = (cocktailId) => {
    navigate(`/recipedetailpage/${cocktailId}`);
  };

  return (
    <div>
      <NavbarComponent />
      <main>
        <Container fluid style={{ padding: 0 }} className="mb-4">
          <div className="image-with-text-container">
            <Image
              src="https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Image with Text"
              fluid
              className="full-width-image"
            />
            <div className="overlay">
              <h1>Discover Your Love For Cocktails</h1>
            </div>
          </div>
        </Container>

        <Container className="mb-4">
          <Row className="justify-content-between">
            <Col md={6}>
              {cocktailData.length > 1 ? (
                <CocktailCard
                  imageSrc={cocktailData[0].CocktailImage}
                  onClick={() => handleImageClick(cocktailData[0].CocktailID)}
                  cocktailName={cocktailData[0].CocktailName}
                  buttonText="View Details"
                  size={6}
                />
              ) : null}
            </Col>
            <Col md={6}>
              <h1 className="mb-3">Most Searched Cocktail</h1>
              <p>
                {cocktailData.length > 1 ? cocktailData[0].Description : null}
              </p>
            </Col>
          </Row>
        </Container>

        <Container>
          <h1 className="text-center mb-4">Other Cocktail Recipes!</h1>

          <Row className="justify-content-between mb-4">
            {cocktailData.slice(1, 5).map((cocktail, index) => (
              <CocktailCard
                key={index}
                imageSrc={cocktail.CocktailImage}
                onClick={() => handleImageClick(cocktail.CocktailID)}
                cocktailName={cocktail.CocktailName}
                buttonText="View Details"
                size={3}
              />
            ))}
          </Row>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
