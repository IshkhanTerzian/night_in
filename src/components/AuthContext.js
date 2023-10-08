import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Variable to hold the loggedIn status of a given user
  const [loggedIn, setLoggedIn] = useState(false);
  // Variable to hold the logged in UserName
  const [loggedInUsername, setLoggedInUsername] = useState("");
  // Variable to hold the logged in UserID
  const [loggedInUserId, setLoggedInUserId] = useState("");
  // Variable to hold the logged in UserType
  const [loggedInUserType, setLoggedInUserType] = useState("");

  /**
   * Check for saved authentication data in local storage during mounting
   */
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

  /**
   * Log a user in and store authentication data in local storage
   * @param {string} username - The UserName of the user
   * @param {string} userId - The UserID of the user
   * @param {string} userType - The UserType
   */
  const login = (username, userId, userType) => {
    localStorage.setItem("username", username);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userType", userType);
    setLoggedInUsername(username);
    setLoggedInUserId(userId);
    setLoggedInUserType(userType);
    setLoggedIn(true);
  };

  /**
   * Log a user out and remove authentication data from local storage
   */
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
    <AuthContext.Provider
      value={{
        loggedIn,
        loggedInUsername,
        loggedInUserId,
        loggedInUserType,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
