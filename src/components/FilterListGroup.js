import React from "react";
import { ListGroup } from "react-bootstrap";

function FilterListGroup({ title, items, selectedFilter, onItemClick }) {
  return (
    <div>
      <h4>{title}</h4>
      <ListGroup className="list-group-flush mb-3">
        {items.map((filter, index) => (
          <ListGroup.Item
            key={index}
            onClick={() => onItemClick(filter)}
            active={selectedFilter === filter}
            style={{ cursor: "pointer", color: "red" }}
          >
            {filter}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default FilterListGroup;
