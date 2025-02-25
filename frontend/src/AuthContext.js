import { createContext, useContext, useState, useEffect } from "react";

// AuthContext to store the user and provide login/logout functionality
const AuthContext = createContext();

// AuthProvider to wrap the app and provide authentication state
export const AuthProvider = ({ children }) => {
  // Initialize user state from localStorage, if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Login function to store user data in state and localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Save to localStorage
  };

  // Logout function to clear user data from state and localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
