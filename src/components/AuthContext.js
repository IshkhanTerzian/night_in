import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState("");

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setLoggedInUsername(savedUsername);
      setLoggedIn(true);
    }
  }, []);

  const login = (username) => {
    localStorage.setItem("username", username);
    setLoggedInUsername(username);
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("username");
    setLoggedInUsername("");
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, loggedInUsername, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
