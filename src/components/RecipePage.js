import React, { useState } from "react";
import { Container, Image, Col, Row, ListGroup } from "react-bootstrap";
import CocktailObject from "./CocktailObject";


import NavbarComponent from "./NavbarComponent";

function RecipePage() {
  const alcoholFilters = [
    "Vodka",
    "Whiskey",
    "Brandy",
    "Gin",
    "Rum",
    "Tequila",
  ];

  const flavorFilters = ["Sweet", "Savoury", "Spicy", "Smokey", "Sour"];
  const timeOfDayList = ["Brunch", "Lunch", "Dinner"];
  const userCreationList = ["Creations"];
  const [selectedFilter, setSelectedFilter] = useState(null);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    console.log("PRESSED ON " + filter);
  };

  const handleImageClick = (info) => {
    console.log("Clicked Cocktail Info:", info);
  };

  return (
    <>
      <NavbarComponent />
      <main>
        <Container fluid style={{ padding: 0 }} className="mb-4">
          <div className="image-with-text-container">
            <Image
              src="https://st4.depositphotos.com/1194063/38774/i/450/depositphotos_387740932-stock-photo-set-various-cocktails-shaker-black.jpg"
              alt="Image with Text"
              fluid
              className="full-width-image"
            />
            <div className="overlay">
              <h1>Find Your Drink</h1>
            </div>
          </div>
        </Container>

        <Container className="mt-4">
          <h2 className="mb-4">Filter Recipes</h2>
          <Row>
            <Col md={2}>
              <ListGroup className="list-group-flush">
                <h4>Alcohol Base</h4>
                {alcoholFilters.map((filter, index) => (
                  <ListGroup.Item
                    key={index}
                    onClick={() => handleFilterClick(filter)}
                    active={selectedFilter === filter}
                    style={{ cursor: "pointer" }}
                  >
                    {filter}
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <ListGroup className="list-group-flush">
                <h4>Favor Profile</h4>
                {flavorFilters.map((filter, index) => (
                  <ListGroup.Item
                    key={index}
                    onClick={() => handleFilterClick(filter)}
                    active={selectedFilter === filter}
                    style={{ cursor: "pointer" }}
                  >
                    {filter}
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <ListGroup className="list-group-flush">
                <h4>Time of Day</h4>
                {timeOfDayList.map((filter, index) => (
                  <ListGroup.Item
                    key={index}
                    onClick={() => handleFilterClick(filter)}
                    active={selectedFilter === filter}
                    style={{ cursor: "pointer" }}
                  >
                    {filter}
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <ListGroup className="list-group-flush">
                <h4>User's Creations</h4>
                {userCreationList.map((filter, index) => (
                  <ListGroup.Item
                    key={index}
                    onClick={() => handleFilterClick(filter)}
                    active={selectedFilter === filter}
                    style={{ cursor: "pointer" }}
                  >
                    {filter}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col md={8}>
              <h4>Drink List</h4>
              <CocktailObject
              imageSrc="https://www.seriouseats.com/thmb/-SLJr8K8XKqQH6swSqLu2oxgzXc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2014__08__20120122-188625-yusho-pisco-punch-610p-3c834f44c9c8408aa4929ec251ef1e44.jpg"
              onClick={() => handleImageClick("Pisco Punch")}
              cocktailName="Pisco Punch"
            />
            <CocktailObject
              imageSrc="https://www.seriouseats.com/thmb/-SLJr8K8XKqQH6swSqLu2oxgzXc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2014__08__20120122-188625-yusho-pisco-punch-610p-3c834f44c9c8408aa4929ec251ef1e44.jpg"
              onClick={() => handleImageClick("Pisco Punch")}
              cocktailName="Pisco Punch"
            />
            <CocktailObject
              imageSrc="https://www.seriouseats.com/thmb/-SLJr8K8XKqQH6swSqLu2oxgzXc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2014__08__20120122-188625-yusho-pisco-punch-610p-3c834f44c9c8408aa4929ec251ef1e44.jpg"
              onClick={() => handleImageClick("Pisco Punch")}
              cocktailName="Pisco Punch"
            />
            </Col>
            <Col md={2}>
              <h4 className="mb-4">Selected Drink</h4>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRZBJaGhO4ohjhAkj0Hs48Wk49Hhjo6pyYlA&usqp=CAU" alt=""></img>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
}

export default RecipePage;
