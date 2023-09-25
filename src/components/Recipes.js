import React, { useState, useEffect } from "react";
import { Container, Col, Row, Pagination, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";

import NavbarComponent from "./NavbarComponent";
import CocktailCard from "./CocktailCard";
import UserCreatedCocktailCard from "./UserCreatedCocktailCard";
import FilterListGroup from "./FilterListGroup";

import {
  alcoholFilters,
  flavorFilters,
  timeOfDayList,
  userCreationList,
  adminFilters,
} from "../data/filterLists";

import EmptyBottle from "../assets/empty.png";
import WhiskeyBottle from "../assets/whiskeybottle.jpg";
import VodkaBottle from "../assets/vodka.png";
import BrandyBottle from "../assets/brandy.png";
import GinBottle from "../assets/gin.png";
import RumBottle from "../assets/rum.png";
import TequilaBottle from "../assets/tequila.png";
import PersonalBottle from "../assets/personal.png";
import AllCocktails from "../assets/allcocktails.png";

function Recipes() {
  const navigate = useNavigate();
  const { loggedInUserId, loggedInUserType } = useAuth();

  const [cocktailData, setCocktailData] = useState([]);
  const [userCreatedCocktails, setUserCreatedCocktails] = useState([]);
  const [filteredCocktails, setFilteredCocktails] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);

  const [page, setPage] = useState(1);
  const [totalFilteredPages, setTotalFilteredPages] = useState(1);
  const [filteredItemCount, setFilteredItemCount] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [yourCreationsFilterActive, setYourCreationsFilterActive] =
    useState(false);
  const [alcoholSideImage, setalcoholSideImage] = useState(EmptyBottle);

  const calculateTotalFilteredPages = () => {
    const numCocktailCards = filteredCocktails.length;
    const newTotalFilteredPages = Math.ceil(
      numCocktailCards / cocktailsPerPage
    );
    setTotalFilteredPages(newTotalFilteredPages);
  };

  const cocktailsPerPage = 9;
  const indexOfLastCocktail = page * cocktailsPerPage;
  const indexOfFirstCocktail = indexOfLastCocktail - cocktailsPerPage;
  const currentCocktails =
    filteredCocktails.length > 0
      ? filteredCocktails.slice(
          (page - 1) * cocktailsPerPage,
          page * cocktailsPerPage
        )
      : cocktailData.slice(indexOfFirstCocktail, indexOfLastCocktail);

  useEffect(() => {
    const numCocktailCards = filteredCocktails.length;
    const newTotalFilteredPages = Math.ceil(
      numCocktailCards / cocktailsPerPage
    );
    setTotalFilteredPages(newTotalFilteredPages);
  }, [filteredCocktails, cocktailsPerPage]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/recipes")
      .then((resp) => {
        setCocktailData(resp.data);
      })
      .catch((err) => {
        console.err("Error fetching data:", err);
      });
  }, []);

  useEffect(() => {
    if (loggedInUserId) {
      axios
        .get(`http://localhost:3001/usercreatedcocktails/${loggedInUserId}`)
        .then((resp) => {
          setUserCreatedCocktails(resp.data);
        })
        .catch((err) => {
          console.err("Error fetching user-created cocktails:", err);
        });
    }
  }, [loggedInUserId]);

  const handleSearchChange = (event) => {
    setSearchFilter(event.target.value);
  };

  const handleSearchClick = () => {
    const filtered = cocktailData.filter((cocktail) =>
      cocktail.CocktailName.toLowerCase().includes(searchFilter.toLowerCase())
    );
    setFilteredCocktails(filtered);
  };

  const handlePaginationClick = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleFilterClick = (filter) => {
    if (filter === "Your Creations") {
      if (yourCreationsFilterActive) {
        setSelectedFilter(null);
        setFilteredCocktails([]);
        setYourCreationsFilterActive(false);
        setalcoholSideImage(EmptyBottle);
      } else {
        setSelectedFilter(filter);
        setFilteredCocktails(userCreatedCocktails);
        setYourCreationsFilterActive(true);
        setalcoholSideImage(PersonalBottle);
      }

      setFilteredItemCount(userCreatedCocktails.length);

      const newCocktailsPerPage = Math.ceil(filteredItemCount / 9);
    } else if (filter === "All Creations") {
      if (selectedFilter === "All Creations") {
        setSelectedFilter(null);
        setFilteredCocktails([]);
        setalcoholSideImage(EmptyBottle);
        setYourCreationsFilterActive(false);
      } else {
        setSelectedFilter(filter);

        axios
          .get("http://localhost:3001/allusercreatedcocktails")
          .then((resp) => {
            setFilteredCocktails(resp.data);
            setFilteredItemCount(resp.data.length);
            setPage(1);
          })
          .catch((err) => {
            console.err("Error fetching all user-created cocktails:", err);
          });

        setalcoholSideImage(AllCocktails);
        setYourCreationsFilterActive(false);
      }
    } else {
      let alcoholTypeId = 0;

      switch (filter) {
        case "Vodka":
        case "Sweet":
        case "Dinner":
          alcoholTypeId = 1;
          setalcoholSideImage(VodkaBottle);
          break;
        case "Whiskey":
        case "Savoury":
        case "Lunch":
          alcoholTypeId = 2;
          setalcoholSideImage(WhiskeyBottle);
          break;
        case "Brandy":
        case "Smokey":
        case "Dinner":
          alcoholTypeId = 3;
          setalcoholSideImage(BrandyBottle);
          break;
        case "Gin":
        case "Sour":
        case "Lunch":
          alcoholTypeId = 4;
          setalcoholSideImage(GinBottle);
          break;
        case "Rum":
        case "Spicy":
        case "Brunch":
          alcoholTypeId = 5;
          setalcoholSideImage(RumBottle);
          break;
        case "Tequila":
        case "Savoury":
        case "Brunch":
          alcoholTypeId = 6;
          setalcoholSideImage(TequilaBottle);
          break;
        default:
          alcoholTypeId = 0;
          setalcoholSideImage(EmptyBottle);
      }

      const newCocktailsPerPage = Math.ceil(filteredItemCount / 9);

      setActiveFilters((prevFilters) =>
        prevFilters.includes(filter)
          ? prevFilters.filter((f) => f !== filter)
          : [...prevFilters, filter]
      );

      if (selectedFilter === filter) {
        setSelectedFilter(null);
        setFilteredCocktails([]);
        setalcoholSideImage(EmptyBottle);
      } else {
        setSelectedFilter(filter);
        const filtered = cocktailData.filter(
          (cocktail) => cocktail.AlcoholTypeID === alcoholTypeId
        );

        setFilteredCocktails(filtered);
        setPage(1);
      }
      setYourCreationsFilterActive(false);
    }
  };

  const handleImageClick = (cocktailId) => {
    navigate(`/recipedetailpage/${cocktailId}`);
  };

  const handleUserImageClick = (userCocktailID) => {
    navigate(`/usercreatedcocktaildetailpage/${userCocktailID}`);
  };

  return (
    <>
      <NavbarComponent />
      <main>
        <Container fluid style={{ padding: 0 }} className="mb-4">
          <div className="image-with-text-container"></div>
        </Container>
        <Container className="mt-4">
          <Row>
            <Col md={2}>
              <FilterListGroup
                title="Alcohol Base"
                items={alcoholFilters}
                selectedFilter={selectedFilter}
                onItemClick={handleFilterClick}
                activeFilters={activeFilters}
              />
              <FilterListGroup
                title="Flavor Profile"
                items={flavorFilters}
                selectedFilter={selectedFilter}
                onItemClick={handleFilterClick}
                activeFilters={activeFilters}
              />
              <FilterListGroup
                title="Time Of Day"
                items={timeOfDayList}
                selectedFilter={selectedFilter}
                onItemClick={handleFilterClick}
                activeFilters={activeFilters}
              />
              <FilterListGroup
                title="User's Creations"
                items={
                  loggedInUserType === "A" ? adminFilters : userCreationList
                }
                selectedFilter={selectedFilter}
                onItemClick={(filter) => {
                  if (
                    filter === "Create a Cocktail!" &&
                    loggedInUserType === "G"
                  ) {
                    navigate(`/usercreatingcocktail/${loggedInUserId}`);
                  } else if (loggedInUserType === "A") {
                    navigate(`/admincreatingcocktail`);
                  } else {
                    handleFilterClick(filter);
                  }
                }}
                activeFilters={activeFilters}
              />
            </Col>
            <Col md={8}>
              <Row className="mb-3">
                <Col xs={8}>
                  <Form>
                    <Form.Group controlId="searchForm">
                      <Form.Control
                        type="text"
                        placeholder="All Categories"
                        value={searchFilter}
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
                {(selectedFilter === "Your Creations" &&
                  yourCreationsFilterActive) ||
                selectedFilter === "All Creations"
                  ? currentCocktails.map((cocktail, index) => (
                      <UserCreatedCocktailCard
                        key={index}
                        imageSrc={cocktail.CocktailImage}
                        onClick={() =>
                          handleUserImageClick(cocktail.UserCocktailID)
                        }
                        cocktailName={cocktail.CocktailName}
                        buttonText="View Details"
                        size={4}
                      />
                    ))
                  : currentCocktails.map((cocktail, index) => (
                      <CocktailCard
                        key={index}
                        imageSrc={cocktail.CocktailImage}
                        onClick={() => handleImageClick(cocktail.CocktailID)}
                        cocktailName={cocktail.CocktailName}
                        buttonText="View Details"
                        size={4}
                      />
                    ))}
              </Row>
              <Pagination className="mt-4 justify-content-center">
                {Array.from(
                  {
                    length: Math.ceil(cocktailData.length / cocktailsPerPage),
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
              <img src={alcoholSideImage} alt="" />
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
}

export default Recipes;
