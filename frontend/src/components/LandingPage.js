import React, { useEffect, useState } from "react";
import { Container, Image, Col, Row, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";

import config from "../config.json";
import NavbarComponent from "./NavbarComponent";
import CocktailCard from "./CocktailCard";
import Footer from "./Footer";
import "../styles/LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const { loggedInUserType } = useAuth();
  // Array to hold the cocktails being called from the DB
  const [cocktailData, setCocktailData] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [bannerText, setBannerText] = useState("");

  useEffect(() => {
    axios
      .get(`${config.AWS_URL}/recipes`)
      .then((response) => {
        setCocktailData(response.data.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${config.AWS_URL}/updatedBannerImage`)
      .then((response) => {
        console.log(response.data.data);
        setImageFile(response.data.data[0].SiteBannerImage);
        setBannerText(response.data.data[0].SiteBannerText);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  /**
   * Handles the event to send the user to the detail page of the cocktail
   * @param {number} cocktailId
   */
  const handleImageClick = (cocktailId) => {
    navigate(`/recipedetailpage/${cocktailId}`);
  };

  const handleUpdateBanner = () => {
    navigate("/updatebanner");
  };

  return (
    <>
      <NavbarComponent />
      <Container fluid style={{ padding: 0 }} className="mb-4">
        <div className="image-with-text-container">
          <Image
            src={`data:image/png;base64,${imageFile}`}
            alt="Image with Text"
            fluid
            className="full-width-image"
          />
          <div className="overlay">
            <h1>{bannerText}</h1>
          </div>
        </div>
        {loggedInUserType === "A" && (
          <Col md={12} className="text-center">
            <Button onClick={handleUpdateBanner}>Update Banner</Button>
          </Col>
        )}
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
      <Footer />
    </>
  );
}

export default LandingPage;