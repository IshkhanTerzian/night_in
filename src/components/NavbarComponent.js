import React from "react";
import { Navbar, Nav } from "react-bootstrap";

function NavbarComponent() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/landingpage">Night-In</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href="/recipes" className="font-weight-bold">
            Recipes
          </Nav.Link>
          <Nav.Link href="/forum" className="font-weight-bold">
            Forum
          </Nav.Link>
          <Nav.Link href="/login" className="btn btn-primary border ml-auto">
            Log In
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarComponent;
