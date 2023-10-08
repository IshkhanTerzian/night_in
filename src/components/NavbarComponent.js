import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

import "../styles/NavbarComponent.css";

function NavbarComponent() {
  const navigate = useNavigate();

  // Variables being imported into this component from useAuth
  const { loggedIn, loggedInUsername, logout } = useAuth();

  /**
   * Logs the user out of the application and navigates to the logout page
   */
  const handleLogout = () => {
    logout();
    navigate("/logout");
  };

  /**
   * Navigates to the home page
   */
  const handleLogin = () => {
    navigate("/");
  };

  /**
   * Navigates to the user's profile page
   */
  const handleProfile = () => {
    navigate(`/profile`);
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
              <NavDropdown.Item onClick={handleProfile}>
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Nav.Link
              className="btn btn-primary border ml-auto"
              onClick={handleLogin}
            >
              Log In
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarComponent;
