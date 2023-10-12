import React, { useState, useEffect } from "react";
import { Card, Button, Col } from "react-bootstrap";

import "../styles/CocktailCard.css";

const CocktailCard = ({ imageSrc, onClick, cocktailName, buttonText, size, }) => {

  // Variable that holds the converted base64Image of the cocktail to be rendered
  const [base64ImageSrc, setBase64ImageSrc] = useState("");

  useEffect(() => {
    if (imageSrc && imageSrc.data) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBase64ImageSrc(e.target.result);
      };
      reader.readAsDataURL(
        new Blob([new Uint8Array(imageSrc.data)], { type: "image/*" })
      );
    }
  }, [imageSrc]);

  return (
    <Col md={size} className="mb-3">
      <Card className="w-100 custom-card">
        <Card.Img
          src={base64ImageSrc}
          alt={`Image of ${cocktailName}`}
          className="custom-card-img"
        />
        <Card.Body className="text-center">
          <Card.Title>{cocktailName}</Card.Title>
          <Button variant="info" onClick={onClick} className="custom-button">
            {buttonText}
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default CocktailCard;
