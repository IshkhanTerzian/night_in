import React, { useState, useEffect } from "react";
import { Container, Col, Row, Pagination, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";

import config from "../config.json";
import NavbarComponent from "./NavbarComponent";
import CocktailCard from "./CocktailCard";
import UserCreatedCocktailCard from "./UserCreatedCocktailCard";
import FilterListGroup from "./FilterListGroup";

// Import data to be used within this component
import {
  alcoholFilters,
  flavorFilters,
  timeOfDayList,
  userCreationList,
  adminFilters,
} from "../data/filterLists";

// Importing images saved within the project
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

  // Variable that holds the logged in UserID and UserType
  const { loggedInUserId, loggedInUserType } = useAuth();

  // Array that holds the information of all the cocktails from the DB
  const [cocktailData, setCocktailData] = useState([]);

  // Array that holds the information of all the user cocktails from the DB
  const [userCreatedCocktails, setUserCreatedCocktails] = useState([]);

  // Array to hold the filtered cocktails depending on user's choice
  const [filteredCocktails, setFilteredCocktails] = useState([]);

  // Array to set the correct filtering types
  const [activeFilters, setActiveFilters] = useState([]);

  // Variable to hold the page pagination
  const [page, setPage] = useState(1);

  // Variable to hold the selected filter of user's choice
  const [selectedFilter, setSelectedFilter] = useState(null);

  // Variable t hold the input of search
  const [searchFilter, setSearchFilter] = useState("");

  // Variable to set proper rendering of conditions
  const [yourCreationsFilterActive, setYourCreationsFilterActive] =
    useState(false);

  // Variable to hold the images of alcohol types depending on user's filter choice
  const [alcoholSideImage, setalcoholSideImage] = useState(EmptyBottle);

  // Variable that sets max cocktails per page to be rendered
  const cocktailsPerPage = 9;

  // Gets the last item index for the list
  const indexOfLastCocktail = page * cocktailsPerPage;

  // Gets the first item index from the list
  const indexOfFirstCocktail = indexOfLastCocktail - cocktailsPerPage;

  // Update to get the new rendered cocktails to be rendered on the screen
  const currentCocktails =
    filteredCocktails.length > 0
      ? filteredCocktails.slice(
          (page - 1) * cocktailsPerPage,
          page * cocktailsPerPage
        )
      : cocktailData.slice(indexOfFirstCocktail, indexOfLastCocktail);

  useEffect(() => {
    try {
      axios
        .get(`${config.AWS_URL}/recipes`)
        .then((response) => {
          setCocktailData(response.data.data);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    } catch (err) {}
  }, []);

  useEffect(() => {
    try {
      if (loggedInUserId) {
        axios
          .get(`${config.AWS_URL}/usercreatedcocktails/${loggedInUserId}`)
          .then((response) => {
            console.log(response.data.data);
            setUserCreatedCocktails(response.data.data);
          })
          .catch((err) => {
            console.error("Error fetching user-created cocktails:", err);
          });
      }
    } catch (err) {}
  }, [loggedInUserId]);

  /**
   * Handles changes in the search input field
   * @param {Event} e - The input field change event
   */
  const handleSearchChange = (e) => {
    setSearchFilter(e.target.value);
  };

  /**
   * Handles the click event for the search button, filtering cocktails based on the search input
   */
  const handleSearchClick = () => {
    const filtered = cocktailData.filter((cocktail) =>
      cocktail.CocktailName.toLowerCase().includes(searchFilter.toLowerCase())
    );
    setFilteredCocktails(filtered);
  };

  /**
   * Handles pagination clicks to switch between pages of cocktails
   * @param {number} pageNumber - The page number to navigate to
   */
  const handlePaginationClick = (pageNumber) => {
    setPage(pageNumber);
  };

  /**
   * Handles filter clicks to filter cocktails based on selected filters
   * @param {string} filter - The filter to apply to cocktails
   */
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
    } else if (filter === "All Creations") {
      if (selectedFilter === "All Creations") {
        setSelectedFilter(null);
        setFilteredCocktails([]);
        setalcoholSideImage(EmptyBottle);
        setYourCreationsFilterActive(false);
      } else {
        setSelectedFilter(filter);

        try {
          axios
            .get(`${config.AWS_URL}/allusercreatedcocktails`)
            .then((response) => {
              console.log(response.data.data);
              setFilteredCocktails(response.data.data);
              setPage(1);
            })
            .catch((err) => {
              console.error("Error fetching all user-created cocktails:", err);
            });
        } catch (err) {}

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
        case "Lubch":
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

  /**
   * Handles the click event for a cocktail image, navigating to the cocktail detail page
   * @param {number} cocktailId - The ID of the clicked cocktail
   */
  const handleImageClick = (cocktailId) => {
    navigate(`/recipedetailpage/${cocktailId}`);
  };

  /**
   * Handles the click event for a usercreated cocktail image, navigating to the usercreated cocktail detail page
   * @param {number} userCocktailID - The ID of the clicked usercreated cocktail
   */
  const handleUserImageClick = (userCocktailID) => {
    navigate(`/usercreatedcocktaildetailpage/${userCocktailID}`);
  };

  return (
    <>
      <NavbarComponent />
      <main>
        <Container fluid className="image-with-text-container mb-4"></Container>
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
                        className="w-100"
                      />
                    </Form.Group>
                  </Form>
                </Col>
                <Col xs={4}>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleSearchClick}
                    id="searchButton"
                    className="w-100"
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
              <Pagination className="pagination justify-content-center mt-4">
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
