import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import LandingPage from "./components/LandingPage";
import RecipePage from "./components/RecipePage";
import ForumPage from "./components/ForumPage";
import LoginPage from "./components/Login";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/recipes" element={<RecipePage />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
