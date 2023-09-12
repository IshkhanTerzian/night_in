import React from "react";
import { Col, Image } from "react-bootstrap";

function CocktailObject({ imageSrc, onClick, cocktailName }) {
  return (
    <Col md={cocktailName === "Margarita" ? 6 : 3}>
      <Image src={imageSrc} fluid className="rounded" onClick={onClick} />
      {cocktailName !== "Margarita" && (
        <p className="text-center" style={{ fontWeight: "bold" }}>
          {cocktailName}
        </p>
      )}
    </Col>
  );
}

export default CocktailObject;
