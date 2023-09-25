import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(""); 
  const [loggedInUserType, setLoggedInUserType] = useState(""); 


  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedUserId = localStorage.getItem("userId"); 
    const savedUserType = localStorage.getItem("userType");

    if (savedUsername) {
      setLoggedInUsername(savedUsername);
      setLoggedInUserId(savedUserId || ""); 
      setLoggedInUserType(savedUserType || "G"); 
      setLoggedIn(true);
    }
  }, []);

  const login = (username, userId, userType) => {
    localStorage.setItem("username", username);
    localStorage.setItem("userId", userId); 
    localStorage.setItem("userType", userType); 
    setLoggedInUsername(username);
    setLoggedInUserId(userId); 
    setLoggedInUserType(userType);
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId"); 
    localStorage.removeItem("userType"); 
    setLoggedInUsername("");
    setLoggedInUserId(""); 
    setLoggedInUserType("");
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, loggedInUsername, loggedInUserId, loggedInUserType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
