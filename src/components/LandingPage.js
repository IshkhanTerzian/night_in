import { Container, Image, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";
import CocktailObject from "./CocktailObject";
import "../styles/LandingPage.css";
import Footer from "./Footer";

function LandingPage() {
  const navigate = useNavigate();

  const handleFindRecipesClick = () => {
    navigate("/recipes");
  };

  const handleImageClick = (info) => {
    console.log("Clicked Cocktail Info:", info);
  };

  return (
    <div>
      <header>
        <NavbarComponent />
      </header>

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
          <Row>
            <CocktailObject
              imageSrc="https://www.liquor.com/thmb/opuU8zi3Hm40X9dazbbSTr-EEMg=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Spicy_Margarita_2597x2597_primary-4460e82ef0b24462883ae97db8e4b5bf.jpg"
              onClick={() => handleImageClick("Margarita")}
              cocktailName="Margarita"
            />
            <Col md={6}>
              <h1>Most Searched Cocktail</h1>
              <p>
                The classic Margarita is one of the most popular cocktails in
                the world. Despite having no clear provenance, the combination
                of tequila and lime juice, plus agave syrup and/or orange
                liqueur, has charmed drinkers since its inception,
                circumnavigating its way around the globe to become one of the
                most ubiquitous drinks today—one that has spawned countless
                variations.
              </p>
              <button
                className="btn btn-primary"
                onClick={handleFindRecipesClick}
              >
                Find Recipe
              </button>
            </Col>
          </Row>
        </Container>
        <Container>
          <h1 className="text-center mb-3">Other Cocktail Recipes!</h1>

          <Row>
            <CocktailObject
              imageSrc="https://www.seriouseats.com/thmb/-SLJr8K8XKqQH6swSqLu2oxgzXc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2014__08__20120122-188625-yusho-pisco-punch-610p-3c834f44c9c8408aa4929ec251ef1e44.jpg"
              onClick={() => handleImageClick("Pisco Punch")}
              cocktailName="Pisco Punch"
            />
            <CocktailObject
              imageSrc="https://www.liquor.com/thmb/vFCt_txNBLFVkLdSNbxPbsjo27Q=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/hanky-panky-720x720-primary-00b7166e4c16427795707b3121c00178.jpg"
              onClick={() => handleImageClick("Hanky-Panky")}
              cocktailName="Hanky-Panky"
            />
            <CocktailObject
              imageSrc="https://www.liquor.com/thmb/xPAsh2K8KIa9U4pW4XiMOMYGV3s=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__liquor__2019__03__14090749__Long-Island-Iced-Tea-720x720-article-272623f47e80457594178a552f708068.jpg"
              onClick={() => handleImageClick("Long Island Iced Tea")}
              cocktailName="Long Island Iced Tea"
            />
            <CocktailObject
              imageSrc="https://www.liquor.com/thmb/jS6tetULiZ09eJDoPlY6wM4Ft1I=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/whiskey-sour-1500x1500-hero-c9df509bb1d141f1a8424051c3d78445.jpg"
              onClick={() => handleImageClick("Whiskey Sour")}
              cocktailName="Whiskey Sour"
            />
          </Row>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
