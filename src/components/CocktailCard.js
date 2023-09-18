import React from "react";
import { Card, Button, Col } from "react-bootstrap";

const CocktailCard = ({
  imageSrc,
  onClick,
  cocktailName,
  buttonText,
  size,
}) => {
  return (
    <Col md={size}>
      <Card className="w-100">
        <Card.Img src={imageSrc} alt={`Image of ${cocktailName}`} />
        <Card.Body>
          <Card.Title>{cocktailName}</Card.Title>
          <Button variant="primary" onClick={onClick}>
            {buttonText}
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default CocktailCard;
