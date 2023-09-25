import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../styles/NavbarComponent.css"; 

function NavbarComponent() {
  const navigate = useNavigate();
  const { loggedIn, loggedInUsername, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/logout");
  };

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/landingpage" className="brand-text">
        Night-In
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href="/recipes" className="nav-link">
            Recipes
          </Nav.Link>
          <Nav.Link href="/forum" className="nav-link">
            Forum
          </Nav.Link>
          {loggedIn ? (
            <NavDropdown
              title={`Hello, ${loggedInUsername}`}
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Nav.Link className="btn btn-primary border ml-auto" onClick={handleLogin}>
              Log In
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarComponent;
