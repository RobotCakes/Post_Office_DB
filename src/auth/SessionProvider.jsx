// src/auth/SessionProvider.jsx
import React, { createContext, useState, useContext } from "react";

// Create an AuthContext
export const AuthContext = createContext(null);

// Define the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // State to store user session

  // Mock login function
  const login = (userData) => {
    setUser(userData);
  };

  // Mock logout function
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
