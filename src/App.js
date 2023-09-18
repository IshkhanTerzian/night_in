import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";

import Login from "./components/Login";
import Register from "./components/Register";
import LandingPage from "./components/LandingPage";
import RecipePage from "./components/Recipes";
import ForumPage from "./components/Forum";
import Logout from "./components/Logout";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/recipes" element={<RecipePage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
        </AuthProvider>
    </Router>
  );
}

export default App;
