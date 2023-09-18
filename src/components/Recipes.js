import React, { useState } from "react";
import { Container, Col, Row, ListGroup, Pagination, Form, Button } from "react-bootstrap";
import NavbarComponent from "./NavbarComponent";
import CocktailCard from "./CocktailCard";

const alcoholFilters = ["Vodka", "Whiskey", "Brandy", "Gin", "Rum", "Tequila"];
const flavorFilters = ["Sweet", "Savoury", "Spicy", "Smokey", "Sour"];
const timeOfDayList = ["Brunch", "Lunch", "Dinner"];
const userCreationList = ["Creations"];

function Recipes() {


  const [page, setPage] = useState(1);
  const cocktailsPerPage = 9;
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCocktails, setFilteredCocktails] = useState([]);

  const cocktailArray = [
    {
      name: "Pisco Punch",
      imageSrc:
        "https://www.seriouseats.com/thmb/-SLJr8K8XKqQH6swSqLu2oxgzXc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2014__08__20120122-188625-yusho-pisco-punch-610p-3c834f44c9c8408aa4929ec251ef1e44.jpg",
    },
    {
      name: "Mojito",
      imageSrc:
        "https://www.seriouseats.com/thmb/-SLJr8K8XKqQH6swSqLu2oxgzXc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2014__08__20120122-188625-yusho-pisco-punch-610p-3c834f44c9c8408aa4929ec251ef1e44.jpg",
    },
    {
      name: "Old Fasioned",
      imageSrc:
        "https://www.seriouseats.com/thmb/-SLJr8K8XKqQH6swSqLu2oxgzXc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2014__08__20120122-188625-yusho-pisco-punch-610p-3c834f44c9c8408aa4929ec251ef1e44.jpg",
    },
    {
      name: "Pisco Punch",
      imageSrc:
        "https://www.seriouseats.com/thmb/-SLJr8K8XKqQH6swSqLu2oxgzXc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2014__08__20120122-188625-yusho-pisco-punch-610p-3c834f44c9c8408aa4929ec251ef1e44.jpg",
    },
    {
      name: "Mojito",
      imageSrc:
        "https://www.seriouseats.com/thmb/-SLJr8K8XKqQH6swSqLu2oxgzXc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2014__08__20120122-188625-yusho-pisco-punch-610p-3c834f44c9c8408aa4929ec251ef1e44.jpg",
    },
    {
      name: "Old Fasioned",
      imageSrc:
        "https://www.seriouseats.com/thmb/-SLJr8K8XKqQH6swSqLu2oxgzXc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2014__08__20120122-188625-yusho-pisco-punch-610p-3c834f44c9c8408aa4929ec251ef1e44.jpg",
    },
    {
      name: "Pisco Punch",
      imageSrc:
        "https://www.seriouseats.com/thmb/-SLJr8K8XKqQH6swSqLu2oxgzXc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2014__08__20120122-188625-yusho-pisco-punch-610p-3c834f44c9c8408aa4929ec251ef1e44.jpg",
    },
    {
      name: "Mojito",
      imageSrc:
        "https://www.seriouseats.com/thmb/-SLJr8K8XKqQH6swSqLu2oxgzXc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2014__08__20120122-188625-yusho-pisco-punch-610p-3c834f44c9c8408aa4929ec251ef1e44.jpg",
    },
    {
      name: "Old Fasioned",
      imageSrc:
        "https://www.seriouseats.com/thmb/-SLJr8K8XKqQH6swSqLu2oxgzXc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2014__08__20120122-188625-yusho-pisco-punch-610p-3c834f44c9c8408aa4929ec251ef1e44.jpg",
    },
    {
      name: "Pisco Punch",
      imageSrc:
        "https://www.seriouseats.com/thmb/-SLJr8K8XKqQH6swSqLu2oxgzXc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2014__08__20120122-188625-yusho-pisco-punch-610p-3c834f44c9c8408aa4929ec251ef1e44.jpg",
    },
    {
      name: "Mojito",
      imageSrc:
        "https://www.seriouseats.com/thmb/-SLJr8K8XKqQH6swSqLu2oxgzXc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2014__08__20120122-188625-yusho-pisco-punch-610p-3c834f44c9c8408aa4929ec251ef1e44.jpg",
    },
    {
      name: "Old Fasioned",
      imageSrc:
        "https://www.seriouseats.com/thmb/-SLJr8K8XKqQH6swSqLu2oxgzXc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2014__08__20120122-188625-yusho-pisco-punch-610p-3c834f44c9c8408aa4929ec251ef1e44.jpg",
    },

  ];
  

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = () => {
    const filtered = cocktailArray.filter((cocktail) =>
      cocktail.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCocktails(filtered);
  };

  const indexOfLastCocktail = page * cocktailsPerPage;
  const indexOfFirstCocktail = indexOfLastCocktail - cocktailsPerPage;
  const currentCocktails = filteredCocktails.length > 0
    ? filteredCocktails
    : cocktailArray.slice(indexOfFirstCocktail, indexOfLastCocktail);

  const handlePaginationClick = (pageNumber) => {
    setPage(pageNumber);
  };

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
                <h4>Flavor Profile</h4>
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
                <h4>Time Of Day</h4>
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
              <h4 className="mb-3">Drink List</h4>
              <Row className="mb-3">
                <Col xs={8}>
                  <Form>
                    <Form.Group controlId="searchForm">
                      <Form.Control
                        type="text"
                        placeholder="All Categories"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </Form.Group>
                  </Form>
                </Col>
                <Col xs={4}>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleSearchClick}
                  >
                    Search
                  </Button>
                </Col>
              </Row>
              <Row>
                {currentCocktails.map((cocktail, index) => (
                  <CocktailCard
                    key={index}
                    imageSrc={cocktail.imageSrc}
                    onClick={() => handleImageClick(cocktail.name)}
                    cocktailName={cocktail.name}
                    buttonText="View Details"
                    size={4}
                  />
                ))}
              </Row>
              <Pagination className="mt-4">
                {Array.from(
                  {
                    length: Math.ceil(cocktailArray.length / cocktailsPerPage),
                  },
                  (_, index) => (
                    <Pagination.Item
                      key={index}
                      active={index + 1 === page}
                      onClick={() => handlePaginationClick(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  )
                )}
              </Pagination>
            </Col>
            <Col md={2}>
              <h4 className="mb-4">Selected Drink</h4>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRZBJaGhO4ohjhAkj0Hs48Wk49Hhjo6pyYlA&usqp=CAU"
                alt=""
              />
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
}

export default Recipes;
